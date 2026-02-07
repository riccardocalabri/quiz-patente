import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Quiz } from '../../services/quiz';
import { IStats } from '../../interfaces/stats';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-home',
  imports: [RouterLink, BaseChartDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  quizService: Quiz = inject(Quiz);
  allQuiz: WritableSignal<IStats[]> = signal<IStats[]>([]);

  superati = 0;
  bocciati = 0;
  avg = 0;
  threshold = 27;

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Superato', 'Bocciato'],
    datasets: [
      { data: [],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: '#fff',
        borderWidth: 1
       }
    ]
  };

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Punteggio ottenuto',
        data: [],
        fill: false,
        tension: 0,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33,150,243,0.2)',
        pointBackgroundColor: '#2196F3',
        pointRadius: 5,
      },
      {
        label: 'Media generale',
        data: [],
        borderColor: '#FF9800',
        borderDash: [5,5],
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Soglia di superamento dell\'esame',
        data: [],
        borderColor: '#FF5722',
        borderDash: [5,5],
        fill: false,
        pointRadius: 0
      }
    ]
  };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 30
      }
    }
  };

  ngOnInit(): void {
    this.quizService.getQuizByUserId(1)
      .subscribe((response: IStats[]) => {      
        this.allQuiz.set(response);
        this.loadPieChartData();
        this.loadLineChartData();
      });
  }

  loadPieChartData() {
      this.superati = this.allQuiz().filter(quiz => quiz.punteggio_ottenuto >= 27).length;
      this.bocciati = this.allQuiz().length - this.superati;
      this.pieChartData.datasets[0].data = [this.superati, this.bocciati];
  }

  loadLineChartData() {
    const labels = this.allQuiz().map(quiz => `Quiz ${quiz.id}`);
    const data = this.allQuiz().map(quiz => quiz.punteggio_ottenuto);

    // Punteggio reale
    this.lineChartData.labels = labels;
    this.lineChartData.datasets[0].data = data;

    // Media generale
    const totalScore = data.reduce((sum, val) => sum + val, 0);
    const avgScore = totalScore / data.length;
    this.lineChartData.datasets[1].data = Array(data.length).fill(avgScore);

    // Soglia superamento
    this.lineChartData.datasets[2].data = Array(data.length).fill(this.threshold);
  }

}
