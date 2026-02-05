import { Component, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IData } from '../../interfaces/data';
import data from '../../json/data.json';

@Component({
  selector: 'app-quiz',
  imports: [RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz {

  route: ActivatedRoute = inject(ActivatedRoute);
  id!: string;

  counter: WritableSignal<number> = signal(0);
  score: WritableSignal<number> = signal(0);

  quiz: WritableSignal<[keyof IData, IData[keyof IData]][] | null> = signal(null);

  ngOnInit() {
    // Initialization logic here
    this.id = this.route.snapshot.paramMap.get('id')!;
    console.log('Quiz component initialized with id:', this.id);

    const allEntries = Object.entries(data as IData) as [keyof IData, IData[keyof IData]][];

    // Filtrare solo quella corrispondente all'ID
    const filtered = allEntries.filter(([key, _]) => key === this.id);

    // Settare il segnale
    this.quiz.set(filtered);
    console.log('Dati filtrati:', this.quiz());
  }

  answer(choice: boolean) {
    const currentQuiz = this.quiz();
    if (currentQuiz && currentQuiz.length > 0) {
        const item = currentQuiz[0];
        const correctAnswer = item[1].domande[this.counter()][1];
        console.log('Risposta corretta:', correctAnswer);
        if (choice === correctAnswer) {
          this.counter.update(value => value + 1);
          this.score.update(value => value + 1);
        } else {
          console.log('Risposta errata. Riprova!');
        this.counter.set(this.counter()+1);
      }
    }
  }

  resetQuiz() {
    this.counter.set(0);
    this.score.set(0);
  }

}
