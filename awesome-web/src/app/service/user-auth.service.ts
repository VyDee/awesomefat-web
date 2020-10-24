import { NotificationService } from './notification.service';
import { filter, map, first } from 'rxjs/operators';
import { UserInfo } from '../shared/user-info';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable()
export class UserAuthService{
  usersCollection: AngularFirestoreCollection<UserInfo>;
  users: Observable<UserInfo[]>;
  userDoc: AngularFirestoreDocument<UserInfo>;

  userData: any;
  currentUser: UserInfo;
  isLogIn = 'false';

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private router: Router,
    private notificationService: NotificationService
    ) {
    this.usersCollection = afs.collection<UserInfo>('users');
    this.users = this.usersCollection.valueChanges();
    this.auth.authState.subscribe(
      user => {
        if (user){
          this.userData = user;
          const tempUID = this.userData.uid;
          this.getUsers().pipe(
            map(users => users.filter(user => user.userUID === tempUID ))
          ).subscribe(results => {
            this.currentUser = results[0];
          }, (error) => {
              if (error.code === 'auth/user-not-found') {
                this.notificationService.showError('User is not found. Please check your email, password or create a new user account');
              }
        });
        }
      },
    );
  }

  getUsers() {
    return this.users;
  }
  addUsers(user: UserInfo) {
    const id = this.afs.createId();
    user.userId = id;
    user.role = null;
    this.usersCollection.doc(id).set(user);
  }

  updateUsers(user: UserInfo) {
    this.userDoc = this.afs.doc(`users/${user.userId}`);
    this.userDoc.update(user);
  }

  onLogin(email, password) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userUID', user.user.uid);
          this.router.navigate(['/home']);
          this.getUsers().subscribe((results) => {
            results = results.filter(x => x.userUID === user.user.uid);
            this.currentUser = results[0];
          });
        }
      }, (error) => {
        if (error.code === 'auth/user-not-found') {
          this.notificationService.showError('User is not found. Please check your email, password or create a new user account');
        } else if (error.code === 'auth/wrong-password') {
          this.notificationService.showError('The password is invalid. Please check your password');
        } else if (error.code ==='auth/user-not-found') {
          this.notificationService.showError('User is not found. Please check your email, password or create a new user account');
        }
      });
  }

  isAuthenticated(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true'){
      return true;
    }
    else {
      return false;
    }
  }

  getUser(): Promise<firebase.User> {
    return this.auth.authState.pipe(first()).toPromise();
  }

  onLogOut() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        this.auth.signOut();
        this.currentUser = null;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userUID');
        this.notificationService.showSuccess('You have successfully logged out');
        resolve();
      } else {
        reject();
      }
    });
  }
}

