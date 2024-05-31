import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { ImageService } from './services/image.service';

@Module({
  imports: [FirebaseModule],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule {}
