import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { authState } from '@angular/fire/auth';
import { RealtimeDatabaseService } from './realtime-database.service';
import { getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private realtimeDbService: RealtimeDatabaseService
  ) {}

  register(name: string, email: string, password: string, avatarUrl: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(
        (userCredential: UserCredential) => {
          const user = userCredential.user;

          // Update profile with avatar URL
          return updateProfile(user, {
            displayName: name,
            photoURL: avatarUrl,
          }).then(() => {
            // Create a User object
            const newUser: User = {
              id: user.uid,
              username: name,
              email: user.email!,
              avatarUrl: avatarUrl,
              status: 'online', // Set status to online upon registration
              channels: [],
              directMessageIds: [],
            };

            const userRef = doc(this.firestore, `users/${user.uid}`);
            return setDoc(userRef, newUser).then(() => {
              // Set status in Realtime Database
              this.realtimeDbService.writeUserData(user.uid, name, email, 'online');
            });
          });
        }
      )
    );
  }


  login(email: string, password: string) {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        const userRef = doc(this.firestore, `users/${user.uid}`);

        // Setze den Status in Firestore und Realtime Database auf "online"
        return updateDoc(userRef, { status: 'online' }).then(() => {
          this.realtimeDbService.updateUserStatus(user.uid, 'online');
        });
      })
    );
  }

  logout() {
    const user = this.auth.currentUser;
    if (user) {
      const userRef = doc(this.firestore, `users/${user.uid}`);

      // Setze den Status in Firestore und Realtime Database auf "offline"
      return from(updateDoc(userRef, { status: 'offline' }).then(() => {
        this.realtimeDbService.updateUserStatus(user.uid, 'offline').then(() => {
          return signOut(this.auth);
        });
      }));
    } else {
      return from(Promise.reject('No user is currently logged in'));
    }
  }

  getCurrentUser(): Observable<any> {
    return authState(this.auth);
  }

  getAllUsers(): Observable<User[]> {
    const usersCollection = collection(this.firestore, 'users');
    return collectionData(usersCollection, { idField: 'id' }) as Observable<User[]>;
  }


}
