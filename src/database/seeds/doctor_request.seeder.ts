import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DoctorRequestEntity } from '../../users/entities/doctor-request.entity';
import * as doctorRequestData from './data/doctor_request.data.json';

export default class DoctorRequestSeeder implements Seeder {
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
    const doctorRequestRepository =
      dataSource.getRepository(DoctorRequestEntity);

    await doctorRequestRepository.upsert(doctorRequestData as any, {
      conflictPaths: ['id'],
    });
  }
}
