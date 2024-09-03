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
  constructor(private router: Router, private authService: AuthService) {}

  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(() => {
      this.authService.authStatus$.subscribe((res: any) => {
        console.log(res);
        if (res) this.router.navigate(['/home']);
      });
    });
  }


  routeToSignUp(): void {
    this.router.navigate(['/register']);
  }
}
