import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IData } from '../../interfaces/data';
import data from '../../json/data.json';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categorie',
  imports: [RouterLink],
  templateUrl: './categorie.html',
  styleUrl: './categorie.css',
})
export class Categorie {

  // array di tuple [chiave, valore]
  quiz: WritableSignal<[keyof IData, IData[keyof IData]][] | null> = signal<[keyof IData, IData[keyof IData]][] | null>(null);

  ngOnInit(): void {
    // Object.entries trasforma l'oggetto JSON in array iterabile
    this.quiz.set(Object.entries(data as IData) as [keyof IData, IData[keyof IData]][]);
    console.log(this.quiz());
  }

}
