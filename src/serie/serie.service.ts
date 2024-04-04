import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import {v4  as uuid} from 'uuid'
import { RetornoCadastroDTO, RetornoObjDTO } from 'src/dto/retorno.dto';

import { GENERO } from 'src/genero/genero.entity';
import { GeneroService } from 'src/genero/genero.service';
import { SERIE } from './serie.entity';
import { ListaSeriesDTO } from './dto/listaSerie.dto';
import { criaSerieDTO } from './dto/insereSerie.dto';
import { alteraSerieDTO } from './dto/atualizaSerie.dto';
import { FILME } from 'src/filme/filme.entity';
import { FilmeService } from 'src/filme/filme.service';

@Injectable()
export class SerieService {
  constructor(
    @Inject('SERIE_REPOSITORY')
    private serieRepository: Repository<SERIE>,
    @Inject('GENERO_REPOSITORY')
    private generoRepository: Repository<GENERO>,  
    private readonly generoService: GeneroService,
    @Inject('FILME_REPOSITORY')
    private filmeRepository: Repository<FILME>,  
    private readonly filmeService: FilmeService
  ) {}

  async listar(): Promise<ListaSeriesDTO[]> {
    var seriesListados = await this.serieRepository.find();
    return seriesListados.map(
      serie => new ListaSeriesDTO(
          serie.ID,
          serie.NOMESERIE,    
          serie.EPISODIO,
          serie.TEMPORADA
      ))
        
  }

  async Compartilhar(id: string){
    var serie = await (this.serieRepository 
      .createQueryBuilder('serie')
      .select('serie.ID', 'ID')
      .addSelect('fil.NOME','NOME_SERIE')
      .addSelect('fil.SINOPSE','SINOPSE')
      .addSelect('fil.ANO','ANO')
      .addSelect('fil.DURACAO','DURACAO')
      .addSelect('serie.EPISODIO','EPISODIO')
      .addSelect('serie.TEMPORADA','TEMPORADA')
      .addSelect('serie.NOMESERIE','NOMESERIE')
      .addSelect('gen.NOME','GENERO')
      .leftJoin('filme', 'fil','serie.idfilme = fil.id')  
      .leftJoin('genero', 'gen','fil.idgenero = gen.id')      
      .andWhere('serie.ID = :ID',{ ID: `${id}` })               
      .getRawOne());

    return{   
      message: "Estou assistindo o episódio " + serie.EPISODIO + " da temporada "+serie.TEMPORADA+" da serie "+serie.NOMESERIE+
        " que conta a seguinte história: "+serie.SINOPSE+ ", foi lançado em "+serie.ANO+" e tem duração de "
        +serie.DURACAO+" minutos. Assista também!!"
    }
  }

  async inserir(dados: criaSerieDTO): Promise<RetornoCadastroDTO>{
    let filme = await this.filmeService.inserir(dados.filme)
    let serie = new SERIE();
        serie.ID = uuid();
        serie.NOMESERIE = dados.NOMESERIE;
        serie.TEMPORADA = dados.TEMPORADA;
        serie.EPISODIO = dados.EPISODIO;        
        serie.filme = await this.filmeService.localizarID(filme.id);        

    return this.serieRepository.save(serie)
    .then((result) => {
      return <RetornoCadastroDTO>{
        id: serie.ID,
        message: "Serie cadastrado!"
      };
    })
    .catch((error) => {
      return <RetornoCadastroDTO>{
        id: "",
        message: "Houve um erro ao cadastrar." + error.message
      };
    })

    
  }

  localizarID(ID: string): Promise<SERIE> {
    return this.serieRepository.findOne({
      where: {
        ID,
      },
    });
  }


  async remover(id: string): Promise<RetornoObjDTO> {
    const serie = await this.localizarID(id);
    
    return this.serieRepository.remove(serie)
    .then((result) => {
      return <RetornoObjDTO>{
        return: serie,
        message: "Serie excluido!"
      };
    })
    .catch((error) => {
      return <RetornoObjDTO>{
        return: serie,
        message: "Houve um erro ao excluir." + error.message
      };
    });  
  }

  async alterar(id: string, dados: alteraSerieDTO): Promise<RetornoCadastroDTO> {
    const serie = await this.localizarID(id);

    Object.entries(dados).forEach(
      async ([chave, valor]) => {
          if(chave=== 'id'){
              return;
          }
          

            if (chave === 'filme') {
                if (serie.filme != undefined) {
                    this.filmeService.alterar(serie.filme.ID,dados.filme)
                }
                else {
                    let filme = await this.filmeService.inserir(dados.filme);
                    serie.filme = await this.filmeService.localizarID(filme.id);
                }
              }
            
           
          if (valor) 
            serie[chave] = valor;
      }
    )

    return this.serieRepository.save(serie)
    .then((result) => {
      return <RetornoCadastroDTO>{
        id: serie.ID,
        message: "Serie alterado!"
      };
    })
    .catch((error) => {
      return <RetornoCadastroDTO>{
        id: "",
        message: "Houve um erro ao alterar." + error.message
      };
    });
  }
}