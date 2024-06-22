import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DiagnoseEntity } from '../../prescriptions/entities/diagnose.entity';
import * as diagnoseData from './data/diagnose.data.json';

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

    diagnoseRepository.upsert(diagnoseData, {
      conflictPaths: ['id'],
    });
  }
}
