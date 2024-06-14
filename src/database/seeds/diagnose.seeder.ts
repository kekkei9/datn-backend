import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DiagnoseEntity } from '../../prescriptions/entities/diagnose.entity';

export default class DiagnoseSeeder implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = true;

  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const diagnoseRepository = dataSource.getRepository(DiagnoseEntity);

    diagnoseRepository.save([
      {
        images: [],
        problem: 'test diagnose',
        prescription: {
          id: 1,
        },
      },
      {
        images: [],
        problem: 'test diagnose 2',
        prescription: {
          id: 1,
        },
      },
      {
        images: [],
        problem: 'test diagnose 3',
        prescription: {
          id: 1,
        },
      },
    ]);
  }
}
