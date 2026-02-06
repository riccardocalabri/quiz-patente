import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  http: HttpClient = inject(HttpClient);
  url = 'http://localhost:3000';

  currentUserId: WritableSignal<number | null> = signal<number | null>(1);
  isLoggedIn: WritableSignal<boolean> = signal<boolean>(true);

  signup(username: string, password: string) {
    return this.http.post(`${this.url}/signup`, { username, password })
      .subscribe((response: any) => {        
        this.currentUserId.set(response.id);
      });
  }

  login(username: string, password: string) {
    return this.http.post(`${this.url}/login`, { username, password })
      .subscribe((response: any) => {        
        this.currentUserId.set(response.id);
      });
  }

  getUserById(id: number) {
    return this.http.get<IUser>(`${this.url}/users/${this.currentUserId()}`);
  }

  getAllUsers() {
    return this.http.get<IUser[]>(`${this.url}/users`);
  }
  
}
