import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import {
  AppointmentEntity,
  AppointmentStatus,
} from '../../appointments/entities/appointment.entity';

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

    await appointmentRepository.save([
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(1, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.COMPLETED,
      },
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(2, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.DECLINED,
      },
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(3, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.ONGOING,
      },
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(4, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.ONGOING,
      },
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(5, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.PENDING,
      },
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(5, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.PENDING,
      },
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(6, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.COMPLETED,
      },
      {
        beginTimestamp: 0,
        // beginTimestamp: dayjs().add(7, 'day').unix(),
        requestUser: {
          id: 2,
        },
        confirmUser: {
          id: 3,
        },
        status: AppointmentStatus.COMPLETED,
      },
    ]);
  }
}
