import { UserInfo } from './../shared/user-info';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable()
export class UserFirebaseService {
  usersCollection: AngularFirestoreCollection<UserInfo>;
  users: Observable<UserInfo[]>;
  userDoc: AngularFirestoreDocument<UserInfo>;

  constructor(public afs: AngularFirestore) {
    this.usersCollection = afs.collection<UserInfo>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getUsers() {
    return this.users;
  }
  addUsers(user :UserInfo) {
    const id = this.afs.createId();
    user.userId = id;
    this.usersCollection.doc(id).set(user);
  }

  updateUsers(user) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.userDoc.update(user);
  }
}
