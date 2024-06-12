import { setSeederFactory } from 'typeorm-extension';
import { Role, UserEntity } from '../../users/entities/user.entity';

export default setSeederFactory(UserEntity, async (faker) => {
  const user = new UserEntity();
  user.firstName = faker.person.firstName('male');
  user.lastName = faker.person.lastName('male');
  user.email = faker.internet.email({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  user.role = faker.helpers.enumValue(Role);
  user.phoneNumber = faker.phone.number();
  user.password = 'samplePassword';

  return user;
});
