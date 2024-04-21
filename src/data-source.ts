import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, createDatabase, runSeeders } from 'typeorm-extension';

(async () => {
  const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    database: 'template_postgres',
    seeds: ['src/database/seeds/**/*{.ts,.js}'],
    seedTracking: false,
    factories: ['src/database/factories/**/*{.ts,.js}'],
  };

  // Create the database with specification of the DataSource options
  await createDatabase({
    options,
  });

  const dataSource = new DataSource(options);
  await dataSource.initialize();

  runSeeders(dataSource, {
    seeds: ['src/database/seeds/**/*{.ts,.js}'],
    factories: ['src/database/factories/**/*{.ts,.js}'],
  });
})();
