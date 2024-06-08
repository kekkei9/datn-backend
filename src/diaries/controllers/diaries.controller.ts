import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '../../auth/models/roles.model';
import { DiariesService } from '../services/diaries.service';

@ApiTags('diaries')
@Controller('diaries')
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  getAll() {
    return this.diariesService.findAll();
  }

  @Delete('/:diaryId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  deleteADiary(@Param('diaryId') diaryStringId: string) {
    return this.diariesService.delete(Number(diaryStringId));
  }

  @Get('/my-diaries')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getMyDiaries(@Request() req) {
    return this.diariesService.getMyDiaries(req.user);
  }

  @Get('/user-diaries/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.DOCTOR, Role.ADMIN)
  getUserMyDiaries(@Request() req, @Param('userId') userStringId: string) {
    return this.diariesService.getUserDiaries(req.user, Number(userStringId));
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          type: 'object',
        },
        belongTo: {
          type: 'number',
        },
      },
    },
  })
  @Roles(Role.DOCTOR, Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files'))
  createADiary(
    @Request() req,
    @Body() body,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.diariesService.create(body, files, req.user);
  }

  @Patch('/:diaryId')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          type: 'object',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(Role.DOCTOR, Role.ADMIN)
  patchDiary(
    @Request() req,
    @Body() body,
    @Param('diaryId') diaryStringId: string,
    @UploadedFiles()
    files: Express.Multer.File[],
  ) {
    return this.diariesService.patch(
      body,
      files,
      Number(diaryStringId),
      req.user,
    );
  }
}
