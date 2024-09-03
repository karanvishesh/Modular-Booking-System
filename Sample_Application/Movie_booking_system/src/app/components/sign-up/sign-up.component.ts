import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class SignupComponent {
  username: string = "";
  password: string = "";
  email: string = "";

  constructor(private authService: AuthService, private router: Router) {}

  signUp() {
    console.log(this.username, this.password, this.email, "user");
    this.authService
      .register(this.username, this.email, this.password)
      .subscribe(() => {
        this.routeToLogin();
      });
  }

  routeToLogin(): void {
    this.router.navigate(['/login']);
  }
}
