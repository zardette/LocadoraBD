import { Inject, Injectable } from "@nestjs/common";
import { IsUUID } from "class-validator";
import { RetornoCadastroDTO, RetornoObjDTO } from "src/dto/retorno.dto";
import Datas from "src/utils/datas";
import { Repository } from "typeorm";
import { v4 as uuid } from 'uuid';
import { AlteraUsuarioDTO } from "./dto/atualizaUsuario.dto";
import { ListaUsuarioDTO } from "./dto/listaUsuario.dto";
import { criaUsuarioDTO } from "./dto/usuario.dto";
import {USUARIO} from "./usuario.entity"
import { PESSOA } from "src/pessoa/pessoa.entity";
import { PessoaService } from "src/pessoa/pessoa.service";

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<USUARIO>,

    @Inject('PESSOA_REPOSITORY')
    private generoRepository: Repository<PESSOA>,  
    private readonly generoService: PessoaService,
  ) {}

  async listar(): Promise<ListaUsuarioDTO[]> {
    var usuarioListados = await this.usuarioRepository.find();
    return usuarioListados.map(
      (usuario) =>
        new ListaUsuarioDTO(
          usuario.ID,
          usuario.CIDADE,
          usuario.EMAIL,
          usuario.TELEFONE,
          usuario.SENHA,
          usuario.ASSINATURA,
          usuario.CEP,
        ),
    );
  }

  async inserir(dados: criaUsuarioDTO): Promise<RetornoCadastroDTO> {
    let usuario = new USUARIO();
    usuario.ID = uuid();
    usuario.CIDADE = dados.cidade;
    usuario.EMAIL = dados.email;
    usuario.TELEFONE = dados.telefone;
    usuario.SENHA = dados.senha;
    usuario.ASSINATURA = dados.assinatura;
    usuario.CEP = dados.cep;

    

    return this.usuarioRepository
      .save(usuario)
      .then((result) => {
        return <RetornoCadastroDTO>{
          id: usuario.ID,
          message: 'usuario cadastrado!',
        };
      })
      .catch((error) => {
        return <RetornoCadastroDTO>{
          id: '',
          message: 'Houve um erro ao cadastrar.' + error.message,
        };
      });
  }

  async remover(id: string): Promise<RetornoObjDTO> {
    const usuario = await this.localizarID(id);

    return this.usuarioRepository
      .remove(usuario)
      .then((result) => {
        return <RetornoObjDTO>{
          return: usuario,
          message: 'usuario  excluido!',
        };
      })
      .catch((error) => {
        return <RetornoObjDTO>{
          return: usuario,
          message: 'Houve um erro ao excluir.' + error.message,
        };
      });
  }

  async alterar(
    id: string,
    dados: AlteraUsuarioDTO,
  ): Promise<RetornoCadastroDTO> {
    const usuario = await this.localizarID(id);

    Object.entries(dados).forEach(([chave, valor]) => {
      if (chave === 'id') {
        return;
      }

      if (valor) {
        usuario[chave] = valor;
      }
    });

    return this.usuarioRepository
      .save(usuario)
      .then((result) => {
        return <RetornoCadastroDTO>{
          id: usuario.ID,
          message: 'usuario alterado!',
        };
      })
      .catch((error) => {
        return <RetornoCadastroDTO>{
          id: '',
          message: 'Houve um erro ao alterar: ' + error.message,
        };
      });
  }

  
  localizarID(ID: string): Promise<USUARIO> {
    return this.usuarioRepository.findOne({
      where: {
        ID,
      },
    });
  }

  async validaEmail(EMAIL: string) {
    const possivelUsuario = await this.usuarioRepository.findOne({
      where: {
        EMAIL,
      },
    });
    return (possivelUsuario !== null);
  }

  

  async validaLogin(email: string, senha: string): Promise<RetornoObjDTO> {
    const usuario = await this.localizarEmail (email);
    var objRetorno;
    if (usuario) {
      objRetorno = [usuario, usuario.login(senha)]
    }
    return <RetornoObjDTO>{
      message: objRetorno[1] ? "login efetuado com sucesso" : "usuario ou senha inválidos",
      return: objRetorno[1] ? objRetorno [0] : null
    };

  }

  async localizarEmail(EMAIL: string) {
    const usuariovalido = await this.usuarioRepository.findOne({
      where: {
        EMAIL,
      },
    });
    return usuariovalido;
}

async trocaSenha(EMAIL: string, SENHA: string) {
    const usuario = this.localizarEmail(EMAIL);
  if (usuario) {
      (await usuario).trocaSenha(SENHA); 
      return true; 
  } else {
      return false; 
  }}}