import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { PrescriptionEntity } from '../../prescriptions/entities/prescription.entity';
import * as prescriptionData from './data/prescription.data.json';

export default class PrescriptionSeeder implements Seeder {
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
    const prescriptionRepository = dataSource.getRepository(PrescriptionEntity);

    await prescriptionRepository.upsert(prescriptionData, {
      conflictPaths: ['id'],
    });
  }
}
