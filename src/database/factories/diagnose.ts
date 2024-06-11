import { setSeederFactory } from 'typeorm-extension';
import { DiagnoseEntity } from '../../prescriptions/entities/diagnose.entity';

export default setSeederFactory(DiagnoseEntity, async (faker) => {
  const diagnose = new DiagnoseEntity();
  diagnose.images = [faker.string.uuid(), faker.string.uuid()];

  return diagnose;
});
