import { setSeederFactory } from 'typeorm-extension';
import { DoctorRequestEntity } from '../../users/entities/doctor-request.entity';

export default setSeederFactory(DoctorRequestEntity, async (faker) => {
  const doctorRequest = new DoctorRequestEntity();
  doctorRequest.metadata = {
    mockKey: faker.string.alpha(),
  };

  return doctorRequest;
});
