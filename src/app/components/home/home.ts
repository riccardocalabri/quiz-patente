import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Quiz } from '../../services/quiz';
import { IStats } from '../../interfaces/stats';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  quizService: Quiz = inject(Quiz);
  allQuiz: WritableSignal<IStats[]> = signal<IStats[]>([]);

  ngOnInit(): void {
    this.quizService.getQuizByUserId(1)
      .subscribe((response: IStats[]) => {      
        this.allQuiz.set(response);
        console.log(this.allQuiz());
      });
  }

}
