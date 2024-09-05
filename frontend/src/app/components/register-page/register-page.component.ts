import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [HttpClient],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
  ) {}
  registerForm: FormGroup | undefined;
  showPassword: boolean = false;
  loading: boolean = false;
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.loading = true;
    this.authService
      .register(
        this.registerForm!.value.username,
        this.registerForm!.value.email,
        this.registerForm!.value.password
      )
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.routeToLogin();
        },
        error: (error : any) => {
          this.loading = false;
          this.toastService.show(error.message, 6000);
        },
      });
  }

  routeToLogin(): void {
    this.router.navigate(['/login']);
  }
}
