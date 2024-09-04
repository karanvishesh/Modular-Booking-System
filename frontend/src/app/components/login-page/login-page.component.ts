import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe(
      (next) => {
        this.authService.authStatus$.subscribe((res: any) => {
          this.loading = false;
          if (res) this.router.navigate(['/home']);
        });
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  routeToSignUp(): void {
    this.router.navigate(['/register']);
  }
}
