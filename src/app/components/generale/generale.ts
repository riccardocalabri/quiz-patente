import { Component, signal, WritableSignal, computed, OnInit, inject } from '@angular/core';
import { IData } from '../../interfaces/data';
import data from '../../json/data.json';
import { RouterLink } from '@angular/router';
import { Quiz } from '../../services/quiz';

export interface QuizQuestion {
  text: string;
  answer: boolean;
  fig?: string;
}

@Component({
  selector: 'app-generale',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './generale.html',
  styleUrl: './generale.css',
})
export class Generale implements OnInit {

  // Tutte le domande estratte dal json
  allQuestions: WritableSignal<IData> = signal<IData>(data as IData);

  // Domande del quiz
  questions: WritableSignal<QuizQuestion[]> = signal([]);

  counter = signal(0);
  score = signal(0);

  quizService: Quiz = inject(Quiz);

  currentQuestion = computed(() => {
    return this.questions()[this.counter()] ?? null;
  });

  ngOnInit(): void {
    this.generateQuiz();
  }

  generateQuiz() {
    const dataObj = this.allQuestions();

    // 1️⃣ Oggetto -> array
    const blocks = Object.values(dataObj);

    // 2️⃣ Flatten con fig
    const allDomande: QuizQuestion[] = blocks.flatMap(block =>
      block.domande.map((element: any) => ({
        text: element[0],
        answer: element[1],
        fig: block.fig
      }))
    );

    // 3️⃣ Shuffle
    const shuffled = [...allDomande].sort(() => Math.random() - 0.5);

    // 4️⃣ Slice 30
    const selected = shuffled.slice(0, 30);

    this.questions.set(selected);
    console.log('Domande generate:', this.questions());

    this.counter.set(0);
    this.score.set(0);
  }

  async answer(userChoice: boolean) {
    const question = this.currentQuestion();
    if (!question) return;

    if (userChoice === question.answer) {
      this.score.set(this.score() + 1);
    }

    this.counter.set(this.counter() + 1);

    if (this.counter() >= this.questions().length) {
      try {
        await this.quizService.postQuizResult(this.score(), this.questions().length);
      } catch (err) {
        console.error("Errore salvataggio quiz:", err);
      }
    }
  }

  resetQuiz() {
    this.generateQuiz();
  }
}
