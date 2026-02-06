import { Component, signal, WritableSignal, computed, OnInit } from '@angular/core';
import { IData } from '../../interfaces/data';
import data from '../../json/data.json';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-generale',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './generale.html',
  styleUrl: './generale.css',
})
export class Generale implements OnInit {
  
  // Signal per le 30 domande selezionate per il quiz corrente
  // Ogni domanda è una tupla: [testo della domanda, risposta corretta]
  questions: WritableSignal<[string, boolean][]> = signal([]);
  
  counter = signal(0);
  score = signal(0);

  // Selector derivato per la domanda corrente
  currentQuestion = computed(() => this.questions()[this.counter()]);

  ngOnInit(): void {
    this.generateQuiz();
  }

  generateQuiz() {
    const typedData = data as unknown as IData;
    
    // 1. Estraiamo tutte le domande da tutte le categorie (N11001, N11002, ecc.)
    // Usiamo Object.values per scorrere i valori del JSON
    const allQuestions: [string, boolean][] = Object.values(typedData)
      .filter(item => item && item.domande) // Sicurezza: controlla che esista la prop domande
      .flatMap(item => item.domande);

    // 2. Mischiamo l'array (Fisher-Yates shuffle semplificato)
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);

    // 3. Prendiamo le prime 30 e aggiorniamo il segnale
    this.questions.set(shuffled.slice(0, 30));
    
    // Reset dello stato
    this.counter.set(0);
    this.score.set(0);
  }

  answer(userChoice: boolean) {
    const question = this.currentQuestion();
    
    if (!question) return;

    const correctAnswer = question[1];

    if (userChoice === correctAnswer) {
      this.score.set(this.score() + 1)
    }

    this.counter.set(this.counter() + 1)

  }

  resetQuiz() {
    this.generateQuiz();
  }
}
