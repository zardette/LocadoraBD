import Datas from "../utils/datas";
import * as bcrypt from 'bcrypt';

export class USUARIO{
    
    id: string;
    nome: string;
    idade: number;
    cidade: string;
    email: string;
    telefone: string;
    senha: string; 
    assinatura: Date;
    cep: string;
    logradouro: string;
    complemento: string;
    foto: string;

    
    constructor(id: string,nome: string,idade: number,cidade: string,email: string,telefone: string,senha: string,foto: string,cep: string, logradouro: string, complemento:string){
        const saltOrRounds = 10;

   
        this.id = id;
        this.nome = nome;
        this.idade = idade;
        this.cidade = cidade;
        this.cep = cep;
        this.logradouro = logradouro;
        this.complemento = complemento;
        this.email = email;
        this.telefone = telefone;
        this.senha = bcrypt.hashSync(senha, saltOrRounds);
        this.assinatura = this.assinatura
        this.foto = foto;
    }


    login(senha){
        return bcrypt.compareSync(senha,this.senha);
    }

    trocaSenha(senha){
        const saltOrRounds = 10;
        this.senha = bcrypt.hashSync(senha, saltOrRounds);
    }

    retornaAssinatura(){
        return this.assinatura;
    }

}