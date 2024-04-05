
import Datas from "src/utils/datas";

export class ListaUsuarioDTO{
    constructor(
        readonly id: string,
        readonly cidade: string,
        readonly email: string,
        readonly telefone: string,
        readonly senha: string,
        readonly assinatura: Date,
        readonly cep: string,
        ){}
}