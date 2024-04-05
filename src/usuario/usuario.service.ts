import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { RetornoCadastroDTO, RetornoObjDTO } from 'src/dto/retorno.dto';
import { Usuario } from './usuario.entity';
import { criaUsuarioDTO } from './dto/usuario.dto';
import { PessoaService } from 'src/pessoa/pessoa.service';
import { AlteraUsuarioDTO } from './dto/atualizaUsuario.dto';
import { PESSOA } from 'src/pessoa/pessoa.entity';
import { HttpService } from '@nestjs/axios';
import Datas from 'src/utils/datas';


@Injectable()
export class UsuarioService {
  #usuarios = [];

  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<Usuario>,
    private httpService: HttpService,
    private datas: Datas,
    @Inject('PESSOA_REPOSITORY')
    private pessoaRepository: Repository<PESSOA>,
    private readonly pessoaService: PessoaService,

  ) { }

  async listar(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async inserir(dados: criaUsuarioDTO): Promise<RetornoCadastroDTO> {
    let usuario = new Usuario();
    let retornoPessoa = await this.pessoaService.inserir(dados.dadosPessoa);
    usuario.ID = uuid();
    usuario.PESSOA = await this.pessoaService.localizarID(retornoPessoa.id)
    usuario.EMAIL = dados.EMAIL;
    usuario.SENHA = dados.SENHA;
    usuario.TELEFONE = dados.TELEFONE;
    usuario.CIDADE = dados.CIDADE;
    usuario.ENDERECO = dados.ENDERECO;
    usuario.CEP = dados.CEP;
    usuario.adicionarAssinatura(dados.ASSINATURA)
    usuario.trocaSenha(dados.SENHA)


    return this.usuarioRepository.save(usuario)
      .then((result) => {
        return <RetornoCadastroDTO>{
          id: usuario.ID,
          message: "Pessoa cadastrado!"
        };
      })
      .catch((error) => {
        return <RetornoCadastroDTO>{
          id: "",
          message: "Houve um erro ao cadastrar." + error.message
        };
      })
  }

  localizarID(ID: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({
      where: {
        ID,
      },
    });
  }

  private buscaPorID(ID: string) {
    const possivelUsuario = this.#usuarios.find(
      usuarioSalvo => usuarioSalvo.ID === ID
    )

    if (!possivelUsuario) {
      throw new Error('Usuario nao encontrado')
    }

    return possivelUsuario;
  }

  localizarNome(NOME: string): Promise<PESSOA> {
    return this.pessoaRepository.findOne({
      where: {
        NOME,
      },
    });
  }

  localizarEmail(EMAIL: string): Promise<Usuario> {
    return this.usuarioRepository.findOne({
      where: {
        EMAIL,
      },
    });
  }

  async remover(id: string): Promise<RetornoObjDTO> {
    const usuario = await this.localizarID(id);

    return this.usuarioRepository.remove(usuario)
      .then((result) => {
        return <RetornoObjDTO>{
          return: usuario,
          message: "Pessoa excluido!"
        };
      })
      .catch((error) => {
        return <RetornoObjDTO>{
          return: usuario,
          message: "Houve um erro ao excluir." + error.message
        };
      });
  }

  async alterar(id: string, dados: AlteraUsuarioDTO): Promise<RetornoCadastroDTO> {
    const pessoa = await this.localizarID(id);

    Object.entries(dados).forEach(
      ([chave, valor]) => {
        if (chave === 'id') {
          return;
        }

        pessoa[chave] = valor;
      }
    )

    return this.usuarioRepository.save(pessoa)
      .then((result) => {
        return <RetornoCadastroDTO>{
          id: pessoa.ID,
          message: "Pessoa alterado!"
        };
      })
      .catch((error) => {
        return <RetornoCadastroDTO>{
          id: "",
          message: "Houve um erro ao alterar." + error.message
        };
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

  async removeUsuario(ID: string): Promise<RetornoObjDTO> {
    const usuario = await this.localizarID(ID);

    return this.usuarioRepository.remove(usuario)
      .then((result) => {
        return <RetornoObjDTO>{
          return: usuario,
          message: "Pessoa excluido!"
        };
      })
      .catch((error) => {
        return <RetornoObjDTO>{
          return: usuario,
          message: "Houve um erro ao excluir." + error.message
        };
      });
  }

  async validarLogin(EMAIL: string, SENHA: string) {
    const usuario = await this.localizarEmail(EMAIL);
    var objRetorno;
    if (usuario) {
      objRetorno = [usuario, await usuario.login(SENHA)];
    }

    return <RetornoObjDTO>{
      message: objRetorno[1] ? 'Login Efetuado' : 'Usuario ou senha invalidos',
      return: objRetorno[1] ? objRetorno[0] : null
    }

  }

  adicionarAssinatura(id: string, dias: BigInteger) {
    const usuario = this.buscaPorID(id);

    usuario.adicionarAssinatura(dias);

    return usuario.retornaAssinatura();
  }

  validaAssinatura(id: string) {
    const usuario = this.buscaPorID(id);

    return {
      valida: usuario.validarAssinatura(),
      vencimento: usuario.retornaAssinatura()
    };
  }


  atualizaUSuario(id: string, dadosAtualizacao: Partial<Usuario>) {
    const usuario = this.buscaPorID(id);

    Object.entries(dadosAtualizacao).forEach(
      ([chave, valor]) => {
        if (chave === 'ID') {
          return
        } else if (chave === 'SENHA') {
          usuario.trocaSenha(valor);
          return
        }

        usuario[chave] = valor;
      }
    )

    return usuario;
  }
}