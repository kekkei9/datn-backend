import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role, UserEntity } from '../../users/entities/user.entity';
import * as userData from './data/user.data.json';

export default class UserSeeder implements Seeder {
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
    const repository = dataSource.getRepository(UserEntity);

    await repository.upsert(
      await Promise.all(
        userData.map(async (user) => ({
          ...user,
          password: await bcrypt.hashSync(user.password, 10),
          role: user.role as Role,
        })),
      ),
      {
        conflictPaths: ['id'],
      },
    );
  }
}
