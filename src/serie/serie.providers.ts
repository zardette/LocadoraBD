import { DataSource } from 'typeorm';
import { SERIE } from './serie.entity';


export const serieProviders = [
  {
    provide: 'SERIE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(SERIE),
    inject: ['DATA_SOURCE'],
  },
];