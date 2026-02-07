import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IUser } from '../interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http: HttpClient = inject(HttpClient);
  private url = 'http://localhost:3000';
  private readonly STORAGE_KEY = 'quiz_current_user';

  // Signals per lo stato dell'autenticazione
  currentUserId: WritableSignal<number | null> = signal<number | null>(null);
  currentUser: WritableSignal<IUser | null> = signal<IUser | null>(null);
  isLoggedIn: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    // All'avvio del servizio, controlla se esistono dati utente salvati
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed: IUser = JSON.parse(raw);
        if (parsed && parsed.id) {
          this.currentUserId.set(parsed.id);
          this.currentUser.set(parsed);
          this.isLoggedIn.set(true);
        }
      }
    } catch (e) {
      console.warn('Failed to restore user from storage', e);
    }
  }

  // --------------------------
  // SIGNUP
  // --------------------------
  async signup(name: string, email: string, password: string): Promise<IUser | null> {
    try {
      const user = await firstValueFrom(
        this.http.post<IUser>(`${this.url}/register`, { name, email, password })
      );

      this.currentUserId.set(user.id);
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
      try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user)); } catch { }

      return user;

    } catch (error) {
      console.error('Signup failed:', error);
      return null;
    }
  }

  // --------------------------
  // LOGIN
  // --------------------------
  async login(email: string, password: string): Promise<IUser | null> {
  try {
    const user = await firstValueFrom(
      this.http.post<IUser>(`${this.url}/login`, { email, password })
    );

    this.currentUserId.set(user.id);
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user)); } catch { }

    return user;

  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
}

  // --------------------------
  // GET USER BY ID
  // --------------------------
  async getUserById(id: number): Promise<IUser> {
    return await firstValueFrom(this.http.get<IUser>(`${this.url}/users/${id}`));
  }

  // --------------------------
  // GET ALL USERS
  // --------------------------
  async getAllUsers(): Promise<IUser[]> {
    return await firstValueFrom(this.http.get<IUser[]>(`${this.url}/users`));
  }

  // --------------------------
  // LOGOUT
  // --------------------------
  logout() {
    this.currentUserId.set(null);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    try { localStorage.removeItem(this.STORAGE_KEY); } catch { }
  }

}
