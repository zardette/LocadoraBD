
import Datas from "src/utils/datas";

export class ListaUsuarioDTO{
    constructor(
        readonly id: string,
        readonly nome: string,
        readonly idade: number,
        readonly cidade: string,
        readonly email: string,
        readonly telefone: string,
        readonly senha: string,
        readonly assinatura: Date,
        readonly cep: string,
        readonly logradouro: string,
        readonly complemento: string,
        readonly foto: string,
        ){}
}