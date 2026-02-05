import { Routes } from '@angular/router';
import { Quiz } from './components/quiz/quiz';
import { Home } from './components/home/home';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'quiz/:id', component: Quiz}
];
