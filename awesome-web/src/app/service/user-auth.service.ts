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
export class UserAuthService {
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
    this.auth.authState.subscribe(user => {
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
        // localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user'));
      }
    }, );
  }

  getUsers() {
    return this.users;
  }
  addUsers(user: UserInfo) {
    const id = this.afs.createId();
    user.userId = id;
    this.usersCollection.doc(id).set(user);
  }

  updateUsers(user) {
    this.userDoc = this.afs.doc(`users/${user.userId}`);
    this.userDoc.update(user);
  }

  onLogin(email, password) {
    return this.auth
      .signInWithEmailAndPassword(email, password)
      .then(()=> {
        this.router.navigate(['/home']);
      });
  }

  // onLogin(email, password)  {
  //   return this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
  //     return this.auth.signInWithEmailAndPassword(email, password).then((user) => {
  //       const tempUID = user.user.uid;
  //       this.getUsers().pipe(
  //         map(users => users.filter(user => user.userUID === tempUID ))
  //       ).subscribe(results => {
  //         this.currentUser = results[0];
  //         this.router.navigate(['/home']);
  //       });
  //     },(error) => {
  //       if (error.code === 'auth/user-not-found') {
  //         this.notificationService.showError('User is not found. Please check your email, password or create a new user account');
  //       }
  //     });
  //   });
  // }

  isAuthenticated(): boolean {
    // const user = JSON.parse(localStorage.getItem('user'));
    // return(user !== null) ? true : false;
    return !!this.currentUser;
  }

  getUser(): Promise<firebase.User> {
    return this.auth.authState.pipe(first()).toPromise();
  }
  // onLogin (
  //   email: string,
  //   password: string
  // ): Promise<firebase.auth.UserCredential> {
  //   return this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
  //     return this.auth.signInWithEmailAndPassword(email, password);
  //   })
  // }
  onLogOut() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        this.auth.signOut();
        this.currentUser = null;
        // localStorage.removeItem('user');
        this.notificationService.showSuccess('You have successfully logged out');
        resolve();
      } else {
        reject();
      }
    });
  }
}

