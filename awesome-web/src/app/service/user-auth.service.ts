import { NotificationService } from './notification.service';
import { filter, map } from 'rxjs/operators';
import { UserInfo } from '../shared/user-info';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable()
export class UserAuthService {
  usersCollection: AngularFirestoreCollection<UserInfo>;
  users: Observable<UserInfo[]>;
  userDoc: AngularFirestoreDocument<UserInfo>;

  currentUser: UserInfo;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private notificationService: NotificationService) {
    this.usersCollection = afs.collection<UserInfo>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getUsers() {
    return this.users;
  }
  addUsers(user :UserInfo) {
    console.log(user.userUID);
    console.log(user)
    const id = this.afs.createId();
    user.userId = id;
    this.usersCollection.doc(id).set(user);
  }

  updateUsers(user) {
    console.log(user.userId)
    this.userDoc = this.afs.doc(`users/${user.userId}`);
    this.userDoc.update(user);
  }

  onLogin(email, password) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
          const tempUID = user.user.uid;
          this.getUsers().pipe(
          map(users => users.filter(user => user.userUID === tempUID ))
        ).subscribe(results => {
          this.currentUser = results[0];
          this.router.navigate(['/home']);
        })
      }, (error) => {
        console.log(error);
        if(error.code === "auth/user-not-found") {
          this.notificationService.showError("User is not found. Please check your email, password or create a new user account");
        }
      }
      );
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  onLogOut() {
    return new Promise((resolve, reject) => {
      if(this.currentUser) {
        this.auth.signOut();
        this.currentUser = null;
        this.notificationService.showSuccess("You have successfully logged out")
        resolve();
      } else {
        reject();
      }
    })
  }
}

