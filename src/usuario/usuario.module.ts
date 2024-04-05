import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { ArquivoValidoValidator } from "src/files/validacao/arquivo-valido.validator";
import { pessoaProviders } from "src/pessoa/pessoa.providers";
import { PessoaService } from "src/pessoa/pessoa.service";
import Datas from "src/utils/datas";
import { UsuarioController } from "./usuario.controller";
import { usuarioProviders } from "./usuario.providers";
import { UsuarioService } from "./usuario.service";
import { EmailUnicoValidator } from "./validacao/email-unico.validator";

@Module({
    imports:[HttpModule,DatabaseModule],
    controllers:[UsuarioController],
    providers: [
        ...pessoaProviders,
        PessoaService,
        ...usuarioProviders,
        UsuarioService,
        Datas,
        EmailUnicoValidator,
        ArquivoValidoValidator
      ],
})

export class UsuarioModule{}