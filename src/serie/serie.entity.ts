import { FILME } from "src/filme/filme.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class SERIE{

    @PrimaryColumn()    
    ID:string;

    @Column({length: 255})
    NOMESERIE: string;

    @Column({length: 255})
    TEMPORADA: string;    

    @Column({length: 255})
    EPISODIO: string;
    

    @OneToOne(() => FILME)
    @JoinColumn({ name: 'IDFILME', referencedColumnName:'ID'})
    filme: FILME;
    
}