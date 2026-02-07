import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  authService: Auth = inject(Auth);
  router: Router = inject(Router);

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  async signup(): Promise<void> {
    // Validazioni
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      alert('All fields are mandatory!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords must be the same!');
      console.log('Passwords must be the same!');
      return;
    }

    try {
      // Chiama il servizio Auth
      const user = await this.authService.signup(this.name, this.email, this.password);

      if (user) {
        console.log('Signup successful:', user);
        this.router.navigate(['/']); // Reindirizza alla home
      } else {
        alert('Signup failed. Please try again.');
      }

    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    }
  }

}
