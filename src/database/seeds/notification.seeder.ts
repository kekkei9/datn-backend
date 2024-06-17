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

    await notificationRepository.save(
      Object.values(NotificationType).reduce(
        (acc, curr) =>
          acc.concat(
            Array(5).fill({
              message: `Test notification`,
              belongTo: {
                id: 3,
              },
              createdBy: {
                id: 2,
              },
              type: curr,
              referenceId: 1,
            }),
          ),
        [],
      ),
    );
  }
}
