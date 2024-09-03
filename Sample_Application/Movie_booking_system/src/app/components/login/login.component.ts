import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService
      .login(this.credentials.username, this.credentials.password)
      .subscribe(() => {
        this.authService.authStatus$.subscribe((res: any) => {
          if (res) this.router.navigate(['/dashboard']);
        });
      });
  }

  routeToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }
}
