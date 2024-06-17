import { setSeederFactory } from 'typeorm-extension';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';

export default setSeederFactory(AppointmentEntity, async (faker) => {
  const appointment = new AppointmentEntity();
  appointment.beginTimestamp = faker.number.int();

  return appointment;
});
