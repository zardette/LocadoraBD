import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmptyObject, IsString, MaxLength, MinLength } from "class-validator";
import { CriaPessoaDTO } from "src/pessoa/dto/criaPessoa.dto";
import { EmailUnico } from "../validacao/email-unico.validator";
import { SenhaForte } from "../validacao/strongpass.validator";

export class criaUsuarioDTO{
    
    @IsString()
    @ApiProperty({
        example: 'São Paulo',
        description: `A cidade é utilizada para identificar a localização do usuário.`,
    })
    CIDADE: string;

    @IsString()
    @ApiProperty({
        example: 'R. Antônio Garcia, 39 - Quadra 6 - Vila Santa Teresinha',
        description: `ENDEREÇO.`,
    })
    ENDERECO: string;

    @IsString()
    @ApiProperty({
        example: '',
        description: `ASSINATURA.`,
    })
    ASSINATURA: string;

    @IsString()
    @MinLength(8,{message:'CEP precisa ter 8 numeros'})
    @MaxLength(8,{message:'CEP precisa ter 8 numeros'})
    @ApiProperty( {
        example: '17010150',
        description: `O CEP é utilizado para preencher o endereço.`,
    })
    CEP:string;

    @IsEmail(undefined,{message:"email é inválido"})
    @EmailUnico({message:"O email informado já existe"})
    @ApiProperty({
        example: 'teste@teste.com',
        description: `O email é utilizado para o login e identificação do usuário. Deve ser único.`,
    })
    EMAIL: string;

    @IsString()
    @ApiProperty({
        example: '(00)00000-0000',
        description: `O telefone pode ser usado para se comunicar com o usuário.`,
        
    })
    TELEFONE: string;

    @MinLength(6,{message: "Senha precisa de pelo menos 6 digitos"})
    @SenhaForte({message: "Senha muito fraca"})
    @ApiProperty({
        example: 'Asd@444555666',
        description: `A senha deve conter pelo menos 6 caracteres, contar com letras minusculas e maiusculas, numeros e caracteres especiais.`,
    })
    SENHA: string; 

    @IsNotEmptyObject()
    dadosPessoa: CriaPessoaDTO;
}
