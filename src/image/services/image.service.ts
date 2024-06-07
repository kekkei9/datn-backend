import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/services/firebase.service';

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ imagePath: string; name: string }> {
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', () => {
        resolve({
          imagePath: fileUpload.name,
          name: fileName,
        });
      });

      stream.end(file.buffer);
    });
  }

  async uploadImages(
    files: Express.Multer.File[],
  ): Promise<{ imagePath: string; name: string }[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }
}
