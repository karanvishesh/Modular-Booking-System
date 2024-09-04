import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule],
  providers: [HttpClient],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  constructor(private router: Router, private authService: AuthService) {}
  username: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loading = true;
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(
        (res: any) => {
          this.loading = false;
          this.routeToLogin();
        },
        (error) => {
          this.loading = false; // Stop the loader in case of error
          console.error('Registration failed', error);
        }
      );
  }

  routeToLogin(): void {
    this.router.navigate(['/login']);
  }
}
