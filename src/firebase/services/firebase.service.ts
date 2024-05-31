import admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as serviceAccount from '../../assets/firebaseServiceAccountKey.json';

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: 'gs://datn-aac07.appspot.com',
    });

    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
