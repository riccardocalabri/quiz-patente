import { Routes } from '@angular/router';
import { Quiz } from './components/quiz/quiz';
import { Home } from './components/home/home';
import { Generale } from './components/generale/generale';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'quiz/:id', component: Quiz},
    {path: 'generale', component: Generale}
];
