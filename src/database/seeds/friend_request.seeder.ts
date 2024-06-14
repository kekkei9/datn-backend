import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { FriendRequestEntity } from '../../users/entities/friend-request.entity';
import { FriendRequestStatus } from '../../users/entities/friend-request.interface';

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
      {
        id: 1,
        creator: {
          id: 2,
        },
        receiver: {
          id: 3,
        },
        status: FriendRequestStatus.ACCEPTED,
      },
      {
        conflictPaths: ['id'],
      },
    );
  }
}
