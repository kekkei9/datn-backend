import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { DeactivateUserDto } from '../dto/deactivate-user.dto';
import { RegisterDoctorRequestDto } from '../dto/doctor-request.dto';
import {
  ResponseFriendRequestDto,
  SendFriendRequestDto,
} from '../dto/friend-request.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users') // put the name of the controller in swagger
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) //  makes the all routes as private by default
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'create a user with patient role' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    const { token, refererToken, ...restProps } = createUserDto;
    if (!this.jwtService.decode(token)) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    const phoneNumber = '+' + this.jwtService.decode(token)['phoneNumber'];

    const createdUser = await this.usersService.create({
      phoneNumber,
      ...restProps,
    });

    if (refererToken) {
      const refererId = this.jwtService.decode(refererToken)['id'];
      return this.usersService.createFriendRequest({
        status: 'accepted',
        creator: {
          id: refererId,
        },
        receiver: {
          id: createdUser.id,
        },
      });
    }

    return createdUser;
  }

  @ApiTags('cms')
  @ApiOperation({ summary: 'create a user with admin role' })
  @ApiResponse({
    status: 201,
    type: DefaultColumnsResponse,
  })
  @ApiBearerAuth('access-token') // in the swagger documentation, a bearer token is required to access this endpoint
  @Roles(Role.ADMIN) // makes the endpoint accessible only by the admin
  @Post('admin')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.create(createAdminDto);
  }

  @ApiTags('cms')
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
  @Get('search')
  findUserByPhoneNumber(@Query() query: SearchUserDto) {
    return this.usersService.findUserByPhoneNumber(query.text);
  }

  @ApiBearerAuth('access-token')
  @Get(':userId')
  findUserById(@Param('userId') userStringId: string) {
    const userId = parseInt(userStringId);
    //filter unessary data
    return this.usersService.findUserById(userId);
  }

  @ApiTags('cms')
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

  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiTags('friend-request')
  @ApiBearerAuth('access-token')
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
    @Body() sendFriendRequestDto: SendFriendRequestDto,
  ) {
    const receiverId = parseInt(receiverStringId);
    return this.usersService.sendFriendRequest(
      receiverId,
      req.user,
      sendFriendRequestDto.method,
    );
  }

  @ApiTags('friend-request')
  @ApiBearerAuth('access-token')
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ) {
    const receiverId = parseInt(receiverStringId);
    return this.usersService.getFriendRequestStatus(receiverId, req.user);
  }

  @ApiTags('friend-request')
  @ApiBearerAuth('access-token')
  @Put('friend-request/response/:friendRequestId')
  respondToFriendRequest(
    @Param('friendRequestId') friendRequestStringId: string,
    @Body() responseFriendRequestDto: ResponseFriendRequestDto,
  ) {
    const friendRequestId = parseInt(friendRequestStringId);
    return this.usersService.respondToFriendRequest(
      responseFriendRequestDto,
      friendRequestId,
    );
  }

  @ApiTags('friend-request')
  @ApiBearerAuth('access-token')
  @Get('friend-request/me/received-requests')
  getFriendRequestsFromRecipients(@Request() req) {
    return this.usersService.getFriendRequestsFromRecipients(req.user);
  }

  @ApiTags('friend-request')
  @ApiBearerAuth('access-token')
  @Get('friends/my')
  getFriends(@Request() req) {
    return this.usersService.getFriends(req.user);
  }

  @ApiTags('doctor-register')
  @ApiBearerAuth('access-token')
  @Roles(Role.PATIENT)
  @Post('doctor-register')
  registerToBeADoctor(@Request() req, @Body() body: RegisterDoctorRequestDto) {
    return this.usersService.registerToBeADoctor(req.user, body);
  }

  @ApiTags('doctor-register', 'cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Get('doctor-register/requests')
  getDoctorRequests() {
    return this.usersService.getDoctorRequests();
  }

  @ApiTags('doctor-register', 'cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Post('doctor-register/accept/:doctorRequestId')
  async acceptDoctorRegistration(
    @Param('doctorRequestId') doctorRequestStringId: string,
  ) {
    return this.usersService.acceptDoctorRegistration(
      parseInt(doctorRequestStringId),
    );
  }

  @Get('/check-phone-availability/:phoneNumber')
  @Public()
  checkPhoneAvailability(@Param('phoneNumber') phoneNumber: string) {
    return this.usersService.checkPhoneAvailability(phoneNumber);
  }

  @ApiTags('cms')
  @Post('deactivate/:userId')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  deactivateUser(
    @Param('userId') userStringId: string,
    @Body() deactivateUserDto: DeactivateUserDto,
  ) {
    return this.usersService.deactivateUser(
      parseInt(userStringId),
      deactivateUserDto,
    );
  }

  @Post('upload-avatar')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
    @Request() req,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.usersService.uploadAvatar(req.user, file);
  }
}
