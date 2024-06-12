import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import {
  NotificationEntity,
  NotificationType,
} from '../../notifications/entities/notification.entity';
import { UserEntity } from '../../users/entities/user.entity';

export default class NotificationSeeder implements Seeder {
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
    const notificationRepository = dataSource.getRepository(NotificationEntity);

    const userRepository = dataSource.getRepository(UserEntity);

    const patientUser = await userRepository.findOne({
      where: {
        phoneNumber: 'patient',
      },
    });

    const doctorUser = await userRepository.findOne({
      where: {
        phoneNumber: 'doctor',
      },
    });

    await notificationRepository.save([
      {
        message: 'Test notification 1',
        belongTo: {
          id: patientUser.id,
        },
        createdBy: {
          id: doctorUser.id,
        },
        type: NotificationType.APPOINTMENT,
      },
      {
        message: 'Test notification 1',
        belongTo: {
          id: patientUser.id,
        },
        createdBy: {
          id: doctorUser.id,
        },
        type: NotificationType.DIARY,
      },
      {
        message: 'Test notification 1',
        belongTo: {
          id: patientUser.id,
        },
        createdBy: {
          id: doctorUser.id,
        },
        type: NotificationType.FRIEND,
      },
      {
        message: 'Test notification 1',
        belongTo: {
          id: patientUser.id,
        },
        createdBy: {
          id: doctorUser.id,
        },
        type: NotificationType.PRESCRIPTION,
      },
    ]);
  }
}
