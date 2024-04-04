import { ApiPropertyOptional } from "@nestjs/swagger";
import {  IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { alteraFilmeDTO } from "src/filme/dto/atualizaFilme.dto";



export class alteraSerieDTO{    
    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: 'Breaking Bad',
        description: `O nome será utilizado para identificar a série.`,
    })
    NOMESERIE: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: '01',
        description: `O número é usado para identificar a ordem dos episódios`,
    })
    EPISODIO: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: '03',
        description: `O número é usado para identificar a ordem das temporadas e para agrupar os mesmos episódios de uma temporada`,
    })
    TEMPORADA: string;

    @IsOptional()
    @ApiPropertyOptional({
        example: `{
            "NOME": "Indiana Jones",
            "DURACAO": 120,
            "SINOPSE": "A serie conta a história de um arqueólogo....",
            "ANO": "2012",
            "GENERO": "Ação"
          }`,
        description: `Essas são informações básicas para cada serie`,
    })
    filme: alteraFilmeDTO;    
}