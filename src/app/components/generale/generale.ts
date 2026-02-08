import { Component, signal, WritableSignal, computed, inject } from '@angular/core';
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
  styleUrls: ['./generale.css'],
})
export class Generale {

  allQuestions: WritableSignal<IData> = signal<IData>(data as IData);
  questions: WritableSignal<QuizQuestion[]> = signal<QuizQuestion[]>([]);
  userAnswers: WritableSignal<(boolean | null)[]> = signal<(boolean | null)[]>([]);
  counter = signal(0);
  score = signal(0);
  showResults = signal(false);

  quizService: Quiz = inject(Quiz);

  currentQuestion = computed(() => this.questions()[this.counter()] ?? null);
  currentAnswer = computed(() => this.userAnswers()[this.counter()] ?? null);

  ngOnInit(): void {
    this.generateQuiz();
  }

  generateQuiz() {
    const blocks = Object.values(this.allQuestions());
    const allDomande: QuizQuestion[] = blocks.flatMap(block =>
      block.domande.map((el: any) => ({
        text: el[0],
        answer: el[1],
        fig: block.fig
      }))
    );

    const shuffled = [...allDomande].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 30);

    this.questions.set(selected);
    this.userAnswers.set(new Array(selected.length).fill(null));
    this.counter.set(0);
    this.score.set(0);
    this.showResults.set(false);
  }

  answer(userChoice: boolean) {
    // Aggiorna la risposta corrente senza bloccare la selezione
    const answers = [...this.userAnswers()];
    answers[this.counter()] = userChoice;
    this.userAnswers.set(answers);
    this.nextQuestion();
  }

  prevQuestion() {
    if (this.counter() > 0) this.counter.set(this.counter() - 1);
  }

  nextQuestion() {
    if (this.counter() < this.questions().length - 1) this.counter.set(this.counter() + 1);
  }

  submitQuiz() {

    console.log("Risposte utente:", this.userAnswers());
    // Calcola lo score corretto
    const questions = this.questions();
    const userAnswers = this.userAnswers();
    let calculatedScore = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === questions[index].answer) calculatedScore++;
    });

    this.score.set(calculatedScore);
    this.showResults.set(true);

    // Invia al server
    this.quizService.postQuizResult(calculatedScore, questions.length)
      .catch(err => console.error("Errore salvataggio quiz:", err));
  }

  resetQuiz() {
    this.generateQuiz();
  }
}
