import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  authService: Auth = inject(Auth);
  router: Router = inject(Router);

  email: string = '';
  password: string = '';

  async login(): Promise<void> {
    if (!this.email || !this.password) {
      alert('All fields are mandatory!');
      return;
    }

    const user = await this.authService.login(this.email, this.password);

    if (user) {
      console.log('Login successful:', user);
      this.router.navigate(['/']);
    } else {
      alert('Login failed. Please check your credentials and try again.');
    }
  }

}