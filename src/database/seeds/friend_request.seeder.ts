import { DataSource, DeepPartial } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { FriendRequestEntity } from '../../users/entities/friend-request.entity';
import * as friendRequestData from './data/friend_request.data.json';

export default class FriendRequestSeeder implements Seeder {
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
    const friendRequestrepository =
      dataSource.getRepository(FriendRequestEntity);

    await friendRequestrepository.upsert(
      friendRequestData as DeepPartial<FriendRequestEntity>[],
      {
        conflictPaths: ['id'],
      },
    );
  }
}
