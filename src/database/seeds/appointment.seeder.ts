import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import {
  AppointmentEntity,
  AppointmentStatus,
} from '../../appointments/entities/appointment.entity';
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
      appointmentData.map((appointment, index) => ({
        ...appointment,
        beginTimestamp: dayjs().add(index, 'day').unix(),
        status: appointment.status as AppointmentStatus,
      })),
      {
        conflictPaths: ['id'],
      },
    );
  }
}
