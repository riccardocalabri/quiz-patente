import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { IData } from '../../interfaces/data';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  http: HttpClient = inject(HttpClient);
  data: WritableSignal<IData | null> = signal<IData | null>(null);

  ngOnInit(): void {

  }

}
