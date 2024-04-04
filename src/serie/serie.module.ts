import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { filmeProviders } from "src/filme/filme.providers";
import { FilmeService } from "src/filme/filme.service";
import { filme_pessoaProviders } from "src/filme_pessoa/filme_pessoa.providers";
import { FILME_PESSOAService } from "src/filme_pessoa/filme_pessoa.service";
import { generoProviders } from "src/genero/genero.providers";
import { GeneroService } from "src/genero/genero.service";
import { pessoaProviders } from "src/pessoa/pessoa.providers";
import { PessoaService } from "src/pessoa/pessoa.service";
import { SerieController } from "./serie.controller";
import { serieProviders } from "./serie.providers";
import { SerieService } from "./serie.service";


@Module({
    imports: [DatabaseModule],
    controllers:[SerieController],
    providers: [
        ...serieProviders,
    SerieService,
        ...filmeProviders,
    FilmeService,
        ...generoProviders,
    GeneroService,
    ...pessoaProviders,
    PessoaService,
    ...filme_pessoaProviders,
    FILME_PESSOAService
    ],
})

export class SerieModule{
    
}
