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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
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
import {
  CreateAdminDto,
  CreateUserDto,
  DefaultColumnsResponse,
  UpdateUserDto,
} from '../dto/create-user.dto';
import { DeactivateUserDto } from '../dto/deactivate-user.dto';
import { ResponseDoctorRequestDto } from '../dto/doctor-request.dto';
import {
  ResponseFriendRequestDto,
  SendFriendRequestDto,
} from '../dto/friend-request.dto';
import { SearchUserDto } from '../dto/search-user.dto';
import { FriendRequestStatus } from '../entities/friend-request.interface';
import { Role } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { DefaultPaginationDto } from '../../utils/dto/default.dto';

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
        status: FriendRequestStatus.ACCEPTED,
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
  findAll(@Query() query: DefaultPaginationDto) {
    return this.usersService.findAll(query);
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
    return this.usersService.findUserById(userId, {
      specialties: true,
    });
  }

  @Patch('')
  @ApiBearerAuth('access-token')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idCardFront: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        idCardBack: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        metadata: {
          type: 'object',
        },
        specialties: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'idCardFront', maxCount: 1 },
      { name: 'idCardBack', maxCount: 1 },
      { name: 'files', maxCount: 10 },
    ]),
  )
  registerToBeADoctor(
    @Request() req,
    @Body() body,
    @UploadedFiles()
    files,
  ) {
    return this.usersService.registerToBeADoctor(
      req.user,
      {
        metadata: JSON.parse(body.metadata),
        specialties: body.specialties.split(',').map((id) => parseInt(id)),
      },
      files,
    );
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
  @Post('doctor-register/response/:doctorRequestId')
  responseDoctorRegistration(
    @Param('doctorRequestId') doctorRequestStringId: string,
    @Body() body: ResponseDoctorRequestDto,
    @Request() req,
  ) {
    return this.usersService.responseDoctorRegistration(
      parseInt(doctorRequestStringId),
      req.user,
      body,
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
