export class ListaUsuarioDTO{
    constructor(
        readonly ID: string,
        readonly CIDADE: string,
        readonly EMAIL: string,
        readonly PESSOA: object,
        readonly ASSINATURA: string,
        readonly SENHA: string,
        ){}
}