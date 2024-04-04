import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";
import { criaFilmeDTO } from "src/filme/dto/insereFilme.dto";



export class criaSerieDTO {    
    @IsString()
    @ApiProperty({
        example: 'Breaking Bad',
        description: `O nome será utilizado para identificar a série.`,
    })
    NOMESERIE: string;

    @IsString()
    @ApiProperty({
        example: '01',
        description: `O número é usado para identificar a ordem dos episódios`,
    })
    EPISODIO: string;

    @IsString()
    @ApiProperty({
        example: '03',
        description: `O número é usado para identificar a ordem das temporadas e para agrupar os mesmos episódios de uma temporada`,
    })
    TEMPORADA: string;

    @IsNotEmpty({message:"Devem ser informados os dados da serie. "})
    @ApiProperty({
        example: `{
            "NOME": "Indiana Jones",
            "DURACAO": 120,
            "SINOPSE": "A serie conta a história de um arqueólogo....",
            "ANO": "2012",
            "GENERO": "Ação"
          }`,
        description: `Essas são informações básicas para cada serie`,
    })
    filme: criaFilmeDTO;
}
