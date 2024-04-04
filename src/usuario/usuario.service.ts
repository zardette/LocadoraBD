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

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<USUARIO>,
  ) {}

  async listar(): Promise<ListaUsuarioDTO[]> {
    var usuarioListados = await this.usuarioRepository.find();
    return usuarioListados.map(
      (usuario) =>
        new ListaUsuarioDTO(
          usuario.id,
          usuario.nome,
          usuario.idade,
          usuario.cidade,
          usuario.email,
          usuario.telefone,
          usuario.senha,
          usuario.assinatura,
          usuario.cep,
          usuario.logradouro,
          usuario.complemento,
          usuario.foto
        ),
    );
  }

  async inserir(dados: criaUsuarioDTO): Promise<RetornoCadastroDTO> {
    let usuario = new USUARIO();
    usuario.id = uuid();
    usuario.nome = dados.nome;
    usuario.idade = dados.idade;
    usuario.cidade = dados.cidade;
    usuario.email = dados.email;
    usuario.telefone = dados.telefone;
    usuario.senha = dados.senha;
    usuario.assinatura = dados.assinatura;
    usuario.cep = dados.cep;
    usuario.logradouro = dados.logradouro;
    usuario.complemento = dados.complemento;
    usuario.foto = dados.foto;

    

    return this.usuarioRepository
      .save(usuario)
      .then((result) => {
        return <RetornoCadastroDTO>{
          id: usuario.id,
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
          message: 'Interesse excluido!',
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
          id: usuario.id,
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

  
  localizarID(id: string): Promise<USUARIO> {
    return this.usuarioRepository.findOne({
      where: {
        id,
      },
    });
  }

  async validaEmail(email: string) {
    const possivelUsuario = await this.usuarioRepository.findOne({
      where: {
        email,
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

  async localizarEmail(email: string) {
    const usuariovalido = await this.usuarioRepository.findOne({
      where: {
        email,
      },
    });
    return usuariovalido;
}

async trocaSenha(email: string, senha: string) {
    const usuario = this.localizarEmail(email);
  if (usuario) {
      (await usuario).trocaSenha(senha); 
      return true; 
  } else {
      return false; 
  }}}