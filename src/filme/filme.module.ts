import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { filme_pessoaProviders } from "src/filme_pessoa/filme_pessoa.providers";
import { FILME_PESSOAService } from "src/filme_pessoa/filme_pessoa.service";
import { generoProviders } from "src/genero/genero.providers";
import { GeneroService } from "src/genero/genero.service";
import { pessoaProviders } from "src/pessoa/pessoa.providers";
import { PessoaService } from "src/pessoa/pessoa.service";
import { FilmeController } from "./filme.controller";
import { filmeProviders } from "./filme.providers";
import { FilmeService } from "./filme.service";

@Module({
    imports: [DatabaseModule],
    controllers:[FilmeController],
    providers: [
    ...filmeProviders,
    FilmeService,
    ...generoProviders,
    GeneroService,
    ...pessoaProviders,
    PessoaService,
    ...filme_pessoaProviders,
    FILME_PESSOAService,
    ],
})


export class FilmeModule{
    
}