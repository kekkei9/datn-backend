import { Module } from '@nestjs/common';
import { DrugsController } from './controllers/drugs.controller';
import { DrugsService } from './services/drugs.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [DrugsController],
  providers: [DrugsService],
  exports: [DrugsService],
})
export class DrugsModule {}
