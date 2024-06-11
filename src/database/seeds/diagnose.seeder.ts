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
    dataSource.getRepository(DiagnoseEntity);
  }
}
