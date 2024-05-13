import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../../users/entities/user.entity';
import { Role } from '../../auth/models/roles.model';

export default setSeederFactory(UserEntity, async (faker) => {
  const user = new UserEntity();
  user.firstName = faker.person.firstName('male');
  user.lastName = faker.person.lastName('male');
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.role = Role.PATIENT;
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.password = 'samplePassword';

  return user;
});
