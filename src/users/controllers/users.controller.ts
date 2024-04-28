import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/models/roles.model';
import {
  CreateAdminDto,
  CreateUserDto,
  DefaultColumnsResponse,
  UpdateUserDto,
} from '../dto/create-user.dto';
import { ResponseFriendRequestDto } from '../dto/friend-request.dto';
import { FriendRequestStatus } from '../entities/friend-request.interface';
import { UsersService } from '../services/users.service';

@ApiTags('users') // put the name of the controller in swagger
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routs as private by default
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create a user with patient role' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @Public() // makes the endpoint accessible to all
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'create a user with admin role' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token') // in the swagger documentation, a bearer token is required to access this endpoint
  @Roles(Role.ADMIN) // makes the endpoint accessible only by the admin
  @Post('admin')
  createAdmin(@Body() creatAdminDto: CreateAdminDto) {
    return this.usersService.create(creatAdminDto);
  }

  @ApiResponse({
    status: 200,
    isArray: true,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth('access-token')
  @Get(':userId')
  findUserById(@Param('userId') userStringId: string) {
    const userId = parseInt(userStringId);
    return this.usersService.findUserById(userId);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    type: DefaultColumnsResponse,
  })
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiBearerAuth('access-token')
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ) {
    const receiverId = parseInt(receiverStringId);
    return this.usersService.sendFriendRequest(receiverId, req.user);
  }

  @ApiBearerAuth('access-token')
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ) {
    const receiverId = parseInt(receiverStringId);
    return this.usersService.getFriendRequestStatus(receiverId, req.user);
  }

  @ApiBody({ type: ResponseFriendRequestDto })
  @ApiBearerAuth('access-token')
  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId') friendRequestStringId: string,
    @Body() statusResponse: FriendRequestStatus,
  ) {
    const friendRequestId = parseInt(friendRequestStringId);
    return this.usersService.respondToFriendRequest(
      statusResponse.status,
      friendRequestId,
    );
  }

  @ApiBearerAuth('access-token')
  @Get('friend-request/me/received-requests')
  getFriendRequestsFromRecipients(@Request() req) {
    return this.usersService.getFriendRequestsFromRecipients(req.user);
  }

  @ApiBearerAuth('access-token')
  @Get('friends/my')
  async getFriends(@Request() req) {
    return await this.usersService.getFriends(req.user);
  }
}
