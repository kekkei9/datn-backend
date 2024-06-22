import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { DoctorSpecialtyEntity } from '../../doctorSpecialties/entities/doctor-specialty.entity';
import * as doctorSpecialtyData from './data/doctor_specialties.data.json';

export default class DoctorSpecialtySeeder implements Seeder {
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
    const diaryRepository = dataSource.getRepository(DoctorSpecialtyEntity);

    await diaryRepository.upsert(doctorSpecialtyData, {
      conflictPaths: ['id'],
    });
  }
}
