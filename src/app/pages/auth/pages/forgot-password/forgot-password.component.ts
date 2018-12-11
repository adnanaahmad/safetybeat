
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// services
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  error = '';
  email: string;
  email_req: string;
  reset: string;
  cancel: string;
  reset_msg: string;
  constructor(
    public auth: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    public translate: TranslateService
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
      this.email = values.AUTH.EMAIL;
      this.email_req = values.MESSAGES.EMAIL_MSG;
      this.reset_msg = values.MESSAGES.RESET_MSG;
      this.cancel = values.BUTTONS.CANCEL;
      this.reset = values.BUTTONS.RESET;
    });
  }
  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  get f() { return this.forgotPassForm.controls; }
  onSubmit() {
    if (this.forgotPassForm.invalid) {
      return;
    }
    this.auth.forgotPassword(this.forgotPassForm.value).subscribe(
      data => {
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
      }
    );

  }

}

