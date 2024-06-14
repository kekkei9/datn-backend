import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import {
  NotificationEntity,
  NotificationType,
} from '../../notifications/entities/notification.entity';

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

    await notificationRepository.save([
      {
        message: 'Test notification 1',
        belongTo: {
          id: 3,
        },
        createdBy: {
          id: 2,
        },
        type: NotificationType.APPOINTMENT,
        referenceId: 1,
      },
      {
        message: 'Test notification 1',
        belongTo: {
          id: 3,
        },
        createdBy: {
          id: 2,
        },
        type: NotificationType.DIARY,
        referenceId: 1,
      },
      {
        message: 'Test notification 1',
        belongTo: {
          id: 3,
        },
        createdBy: {
          id: 2,
        },
        type: NotificationType.FRIEND,
        referenceId: 1,
      },
      {
        message: 'Test notification 1',
        belongTo: {
          id: 3,
        },
        createdBy: {
          id: 2,
        },
        type: NotificationType.PRESCRIPTION,
        referenceId: 1,
      },
    ]);
  }
}
