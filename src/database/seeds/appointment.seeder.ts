import { DataSource, DeepPartial } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import * as appointmentData from './data/appointment.data.json';

export default class AppointmentSeeder implements Seeder {
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
    const appointmentRepository = dataSource.getRepository(AppointmentEntity);

    await appointmentRepository.upsert(
      appointmentData as DeepPartial<AppointmentEntity>[],
      {
        conflictPaths: ['id'],
      },
    );
  }
}
