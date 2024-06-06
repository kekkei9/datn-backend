import { FriendRequestStatus } from './../../users/entities/friend-request.interface';
import { setSeederFactory } from 'typeorm-extension';
import { FriendRequestEntity } from '../../users/entities/friend-request.entity';

export default setSeederFactory(FriendRequestEntity, async (faker) => {
  const friendRequest = new FriendRequestEntity();
  friendRequest.status = FriendRequestStatus.ACCEPTED;
  friendRequest.pinId = faker.string.uuid();

  return friendRequest;
});
