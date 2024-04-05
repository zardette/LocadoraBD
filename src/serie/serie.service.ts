import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import {v4  as uuid} from 'uuid'
import { RetornoCadastroDTO, RetornoObjDTO } from 'src/dto/retorno.dto';
import { GENERO } from 'src/genero/genero.entity';
import { GeneroService } from 'src/genero/genero.service';
import { Serie } from './serie.entity';
import { ListaSeriesDTO } from './dto/listaSerie.dto';
import { criaSerieDTO } from './dto/insereSerie.dto';
import { alteraSerieDTO } from './dto/atualizaSerie.dto';
import { FilmeService } from 'src/filme/filme.service';
 
@Injectable()
export class SerieService {
  constructor(
    @Inject('GENERO_REPOSITORY')
    private generoRepository: Repository<GENERO>,  
    private readonly generoService: GeneroService,
    @Inject('FILME_REPOSITORY')
    private filmeRepository: Repository<FilmeService>,
    private readonly filmeService: FilmeService,
    @Inject('SERIE_REPOSITORY')
    private serieRepository: Repository<Serie>,
  ) {}

  async listar(): Promise<ListaSeriesDTO[]> {
    var seriesListadas = await this.serieRepository.find();
    return seriesListadas.map(
      serie => new ListaSeriesDTO(
        serie.ID,
        serie.NOMESERIE,
        serie.EPSODIO,
        serie.TEMPORADA,
        serie.FILME  
      ))
  }

  async Compartilhar(id: string){
    var serie = await (this.serieRepository
      .createQueryBuilder('serie')
      .select('serie.ID', 'ID')
      .addSelect('serie.NOMESERIE','NOMESERIE')
      .addSelect('serie.EPSODIO','EPSODIO')
      .addSelect('serie.TEMPORADA','TEMPORADA')
      .addSelect('serie.FILME','FILME')  
      .andWhere('serie.ID = :ID',{ ID: `${id}` })
      .getRawOne());

    return{            
      message: `Estou assistindo o episódio ${serie.EPSODIO} da temporada ${serie.TEMPORADA} da serie ${serie.NOMESERIE} `
    }
  }

  async inserir(dados: criaSerieDTO): Promise<RetornoCadastroDTO>{
        let serie = new Serie();
        let filme = await this.filmeService.inserir(dados.filme);
        serie.ID = uuid();
        serie.NOMESERIE = dados.NOMESERIE;
        serie.EPSODIO = dados.EPSODIO;
        serie.TEMPORADA = dados.TEMPORADA
        serie.FILME = await this.filmeService.localizarID(filme.id)
        
    return this.serieRepository.save(serie)
    .then((result) => {
      return <RetornoCadastroDTO>{
        id: serie.ID,
        message: "Serie cadastrada!"
      };
    })
    .catch((error) => {
      return <RetornoCadastroDTO>{
        id: "",
        message: "Houve um erro ao cadastrar." + error.message
      };
    })    
  }

  localizarID(ID: string): Promise<Serie> {
    return this.serieRepository.findOne({
      where: {
        ID,
      },
    });
  }

  async remove(id: string): Promise<RetornoObjDTO> {
    const serie = await this.localizarID(id);
    
    return this.serieRepository.remove(serie)
    .then((result) => {
      return <RetornoObjDTO>{
        return: serie,
        message: "Serie excluida!"
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

          serie[chave] = valor;
      }
    )

    return this.serieRepository.save(serie)
    .then((result) => {
      return <RetornoCadastroDTO>{
        id: serie.ID,
        message: "Serie alterada!"
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