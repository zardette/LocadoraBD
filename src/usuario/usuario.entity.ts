import { Column, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import Datas from "../utils/datas";
import * as bcrypt from 'bcrypt';
import { PESSOA } from "src/pessoa/pessoa.entity";

export class USUARIO{
    @PrimaryColumn()
    ID: string;

    @Column()
    CIDADE: string

    @Column()
    EMAIL: string;

    @Column()
    TELEFONE: string;

    @Column()
    SENHA: string;
   
    @Column()
    ASSINATURA: Date;

    @Column()
    CEP: string;

    @OneToOne(() => PESSOA)
    @JoinColumn({ name: 'IDPESSOA', referencedColumnName:'ID'})
    pessoa: PESSOA;

    login(SENHA){
        return bcrypt.compareSync(SENHA,this.SENHA);}

        trocaSenha(SENHA){
            const saltOrRounds = 10;
            this.SENHA = bcrypt.hashSync(SENHA,saltOrRounds);}
    
}