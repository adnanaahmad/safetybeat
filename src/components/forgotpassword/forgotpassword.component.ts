import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// services
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;
  constructor(
    public auth: AuthService,
    private router: Router,
    public formBuilder: FormBuilder

  ) { }
  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  get f() { return this.forgotPassForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.forgotPassForm.invalid) {
      return;
    }
    this.auth.forgotPassword(this.forgotPassForm.value).subscribe(
      data => {
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );

  }

}
