import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.model'; // Adjust the path as necessary
import { authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  register(name: string, email: string, password: string, avatarUrl: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then((userCredential: UserCredential) => {
        const user = userCredential.user;

        // Update profile with avatar URL
        return updateProfile(user, { displayName: name, photoURL: avatarUrl }).then(() => {
          // Create a User object
          const newUser: User = {
            id: user.uid,
            username: name,
            email: user.email!,
            avatarUrl: avatarUrl,
            status: 'online',
            channels: [],
            directMessageIds: []
          };

          const userRef = doc(this.firestore, `users/${user.uid}`);
          console.log('User created successfully');
          console.log(newUser);
          return setDoc(userRef, newUser);
        });
      })
    );
  }

  login(email: string, password: string) {
    console.log('Logging in...');
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    console.log('Logging out...');
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<any> {
    return authState(this.auth);
  }
}
