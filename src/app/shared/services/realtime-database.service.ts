import { Injectable } from '@angular/core';
import { Database, ref, set, get, update, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeDatabaseService {
  constructor(private db: Database) {}

  // Schreibe Benutzerdaten in die Realtime Database
  writeUserData(userId: string, name: string, email: string, status: string): Promise<void> {
    const userRef = ref(this.db, `users/${userId}`);
    return set(userRef, {
      username: name,
      email: email,
      status: status
    });
  }

  // Lese Benutzerdaten aus der Realtime Database
  getUserData(userId: string): Observable<any> {
    const userRef = ref(this.db, `users/${userId}`);
    return new Observable(observer => {
      onValue(userRef, snapshot => {
        const data = snapshot.val();
        observer.next(data);
      });
    });
  }

  // Aktualisiere den Benutzerstatus
  updateUserStatus(userId: string, status: string): Promise<void> {
    const userRef = ref(this.db, `users/${userId}/status`);
    return update(userRef, { status });
  }
}
