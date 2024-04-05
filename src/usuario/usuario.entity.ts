import Datas from "../utils/datas";
import * as bcrypt from 'bcrypt';
import { Column, Entity, JoinColumn, JoinTable, OneToOne, PrimaryColumn } from "typeorm";
import { PESSOA } from "src/pessoa/pessoa.entity";

@Entity()
export class Usuario{

    #datas: Datas;
    
    @PrimaryColumn()
    ID:string;

    @Column({length: 255})
    CIDADE: string;

    @Column({length: 255})
    ENDERECO: string;

    @Column({length: 255})
    ASSINATURA: string;

    @Column({length: 255})
    CEP: string;

    @Column({length: 255})
    EMAIL: string;

    @Column({length: 255})
    TELEFONE: string;

    @Column({length: 255})
    SENHA: string;

    @OneToOne(() => Usuario)
    @JoinColumn({ name: 'IDPESSOA', referencedColumnName:'ID'})
    PESSOA: PESSOA

    login(SENHA){
        return bcrypt.compareSync(SENHA,this.SENHA)
    }

    trocaSenha(SENHA){
        const salt0rRounds=10
        this.SENHA = bcrypt.hashSync(SENHA, salt0rRounds)
    }

    adicionarAssinatura(dias){
        this.ASSINATURA = this.#datas.adicionarDias(this.ASSINATURA,dias)
    }

    retornaAssinatura(){
        return this.#datas.formatar(this.ASSINATURA)
    }

    // @Column({length: 255})
    // NOME: string;

    // @Column()
    // IDADE: number;

    // @Column({length: 255})
    // FOTO: string;




}