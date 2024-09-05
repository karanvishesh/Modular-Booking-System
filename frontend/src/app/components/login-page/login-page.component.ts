import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup | undefined;
  showPassword: boolean = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm?.valid) {
      this.loading = true;
      this.authService
        .login(this.loginForm?.value.username, this.loginForm?.value.password)
        .subscribe({
          next: () => {
            this.authService.authStatus$.subscribe({
              next: (res: any) => {
                this.loading = false;
                if (res) this.router.navigate(['/home']);
              },
              error: (error: any) => {
                this.loading = false;
                this.toastService.show(error.message, 6000);
              },
            });
          },
          error: (error: any) => {
            this.loading = false;
            this.toastService.show(error.message, 6000);
          },
        });
    }
  }

  routeToSignUp(): void {
    this.router.navigate(['/register']);
  }
}
