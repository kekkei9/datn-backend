import { setSeederFactory } from 'typeorm-extension';
import {
  NotificationEntity,
  NotificationType,
} from '../../notifications/entities/notification.entity';

export default setSeederFactory(NotificationEntity, async (faker) => {
  const notification = new NotificationEntity();
  notification.type = faker.helpers.enumValue(NotificationType);

  return notification;
});
