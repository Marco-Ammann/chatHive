import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockFirebaseService {

  private mockDataUrl = 'assets/mock/firebase_mock.json';

  constructor(private http: HttpClient) {}

  getMockData(): Observable<any> {
    return this.http.get<any>(this.mockDataUrl);
  }

  getCurrentUser(data: any): any {
    return data.users['user_123'];
  }

  getMessages(data: any): any {
    return data.messages;
  }
}
