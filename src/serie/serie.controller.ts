import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RetornoCadastroDTO, RetornoObjDTO } from "src/dto/retorno.dto";
import {v4  as uuid} from 'uuid'
import { alteraSerieDTO } from "./dto/atualizaSerie.dto";
import { criaSerieDTO } from "./dto/insereSerie.dto";
import { ListaSeriesDTO } from "./dto/listaSerie.dto";
import { SERIE } from "./serie.entity";
import { SerieService } from "./serie.service";

@ApiTags('serie')
@Controller('/series')
export class SerieController{    
    constructor(private readonly serieService: SerieService){
    }

    @Get()
    async Retorno():Promise<ListaSeriesDTO[]> {
        return this.serieService.listar();
    }

    @Get('/compartilhar/:id')
    async Compartilhar(@Param('id') id: string): Promise<{message:String}>{
        return this.serieService.Compartilhar(id);
    }

    @Delete('/:id')
    async remove(@Param('id') id: string): Promise<RetornoObjDTO>{
        return this.serieService.remover(id);
    }


    @Put('/:id')
    async atualiza(@Param('id') id: string, @Body() novosDados: alteraSerieDTO):Promise<RetornoCadastroDTO>{
        return this.serieService.alterar(id, novosDados);
    }

    @Post()
    async cria(@Body() dados: criaSerieDTO):Promise<RetornoCadastroDTO>{
        return this.serieService.inserir(dados);        
    }
}