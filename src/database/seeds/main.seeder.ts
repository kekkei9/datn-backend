import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import FriendRequestSeeder from './friend_request.seeder';
import UserSeeder from './user.seeder';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userSeeder = new UserSeeder();
    await userSeeder.run(dataSource, factoryManager);
    const friendRequestSeeder = new FriendRequestSeeder();
    await friendRequestSeeder.run(dataSource);
  }
}
