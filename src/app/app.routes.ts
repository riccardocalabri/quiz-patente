import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Generale } from './components/generale/generale';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'generale', component: Generale},
    {path: 'login', component: Login},
    {path: 'signup', component: Signup}
];
