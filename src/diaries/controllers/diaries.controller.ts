import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetAllDiariesDto } from '../dto/find-diaries.dto';
import { DiariesService } from '../services/diaries.service';
import { Role } from '../../users/entities/user.entity';
import { DiaryType } from '../entities/diary.entity';

@ApiTags('diaries')
@Controller('diaries')
@UseGuards(JwtAuthGuard)
export class DiariesController {
  constructor(private readonly diariesService: DiariesService) {}

  @Get()
  @ApiBearerAuth('access-token')
  @ApiTags('cms')
  findAll(@Query() query: GetAllDiariesDto, @Request() req) {
    return this.diariesService.findAll({ ...query, currentUser: req.user });
  }

  @Delete('/:diaryId')
  @ApiTags('cms')
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  deleteADiary(@Param('diaryId') diaryStringId: string) {
    return this.diariesService.delete(Number(diaryStringId));
  }

  @Post()
  @ApiBearerAuth('access-token')
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
        type: {
          type: 'string',
          enum: Object.values(DiaryType),
        },
        data: {
          type: 'object',
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
