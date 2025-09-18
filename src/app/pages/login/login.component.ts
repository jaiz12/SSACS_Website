import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../../shared/services/api.service';
import { ConfigService } from '../../shared/services/config.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginDetails: any = { email: '', password: '' };
  submitted = false;

  constructor(
    private router: Router,
    public api: APIService,
    private toastr: ToastrService,
    private configService: ConfigService
  ) {}
  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.submitted = true;

    if (form.invalid) return;

    const payload = this.loginDetails;

    this.api.post('Account/LoginOrSignUpWithEmailPassword', payload, false).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        const cmsUrl = this.configService.get("cmsUrl");
        // redirect once with token included
        window.location.href = `${cmsUrl}?token=${res.token}`;

        this.toastr.success('Login successful!', 'Welcome'); 
      },  
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login']).then(() => {
          this.toastr.error('Login Failed. Please check your credentials.', 'Error');
        });
      }
    });
  }

  // Custom password validation for template
  isPasswordInvalid(password: string | undefined): boolean {
    if (!password) return false; // empty password is handled by required validator
    const pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/;
    return !pattern.test(password); // always boolean
  }
}
