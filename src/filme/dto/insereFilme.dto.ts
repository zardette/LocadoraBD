import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";



export class criaFilmeDTO{
    @IsString()
    @IsNotEmpty({message: "nome Não pode ser vazio"})
    @ApiProperty({
        example: 'Indiana Jones',
        description: `O nome é usado para identificar o filme e listar.`,
    })
    NOME:string;
    
    @IsInt()
    @ApiProperty({
        example: '120',
        description: `A duração é um parametro numerico que armazena quantos minutos tem o filme.`,
    })
    DURACAO: number;

    @IsString()
    @ApiProperty({
        example: 'O filme conta a história de um arqueólogo....',
        description: `Uma breve descrição ou a sinopse completa do filme.`,
    })
    SINOPSE: string;

    @IsString()  
    @ApiProperty({
        example: '2012',
        description: `O ano de lançamento do filme.`,
    })  
    ANO: string;

    @IsString()
    @ApiProperty({
        example: 'Ação',
        description: `Nome do genero do filme`,
    })
    GENERO: string;

}

