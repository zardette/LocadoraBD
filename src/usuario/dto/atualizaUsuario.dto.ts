import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { EmailUnico } from "../validacao/email-unico.validator";
import { SenhaForte } from "../validacao/strongpass.validator";

export class AlteraUsuarioDTO{

    @IsString()
    @IsNotEmpty({message: "nome Não pode ser vazio"})
    @IsOptional()
    @ApiPropertyOptional({
        example: 'Roberto Silva',
        description: `O nome é usado para identificar o usuário, em telas, cadastros e outros.`,
    })
    NOME:string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: 'São Paulo',
        description: `A cidade é utilizada para identificar a localização do usuário.`,
    })
    CIDADE: string;

    @IsEmail(undefined,{message:"email é inválido"})
    @EmailUnico({message:"O email informado já existe"})
    @IsOptional()
    @ApiPropertyOptional({
        example: 'teste@teste.com',
        description: `O email é utilizado para o login e identificação do usuário. Deve ser único.`,
    })
    EMAIL: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: '(00)00000-0000',
        description: `O telefone pode ser usado para se comunicar com o usuário.`,
    })
    TELEFONE: string;

    @MinLength(6,{message: "Senha precisa de pelo menos 6 digitos"})
    @SenhaForte({message: "Senha muito fraca"})
    @IsOptional()
    @ApiPropertyOptional({
        example: 'Asd@444555666',
        description: `A senha deve conter pelo menos 6 caracteres, contar com letras minusculas e maiusculas, numeros e caracteres especiais.`,
    })
    SENHA: string; 

    @IsNumberString()
    @MinLength(8,{message:'CEP precisa ter 8 numeros'})
    @MaxLength(8,{message:'CEP precisa ter 8 numeros'})
    @IsOptional()
    @ApiPropertyOptional( {
        example: '17010150',
        description: `O CEP é utilizado para preencher o endereço.`,
    })
    CEP:string;    
}