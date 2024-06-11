import { setSeederFactory } from 'typeorm-extension';
import { PrescriptionEntity } from '../../prescriptions/entities/prescription.entity';

export default setSeederFactory(PrescriptionEntity, async (faker) => {
  const notification = new PrescriptionEntity();
  notification.images = [faker.string.uuid(), faker.string.uuid()];

  return notification;
});
