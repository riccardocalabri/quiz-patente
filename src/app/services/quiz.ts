import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Auth } from './auth';
import { IStats } from '../interfaces/stats';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Quiz {

  http: HttpClient = inject(HttpClient);
  auth: Auth = inject(Auth);
  url = 'http://localhost:3000';

  getQuizByUserId(fkuser: number) {
    return this.http.get<IStats[]>(`${this.url}/statistics/${fkuser}`);
  }

  async postQuizResult(punteggio_ottenuto: number, punteggio_totale: number) {
    const fkuser = this.auth.currentUserId();
    if (!fkuser) throw new Error("User ID non impostato");

    const result = await firstValueFrom(
      this.http.post(`${this.url}/statistics`, { fkuser, punteggio_ottenuto, punteggio_totale })
    );

    console.log('Quiz result saved:', result);
    return result;
  }

}
