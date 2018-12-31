
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPassword } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassForm: FormGroup;
  error = '';
  translated: object;
  selectedTheme: String;
  constructor(
    public forgotService: LoginRegistrationService,
    private router: Router,
    public formBuilder: FormBuilder,
    public translate: TranslateService
  )
  /**
   *in this translate.get function i have subscribed the en.json AUTH,BUTTONS and MESSAGES strings and have used in the html
   *file
   */
  // tslint:disable-next-line:one-line
  {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES']).subscribe((values) => {
      this.translated = values;
    });
  }
  ngOnInit()
  /**
   *here we are checking the validity of email
   */
  // tslint:disable-next-line:one-line
  {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  /**
   * in this function loginform controls are checked whether they are valid or not and this is basically builtin fucntionality
   */
  get formValidation() { return this.forgotPassForm.controls; }
  /**
   * in this function when the user clicks on the reset button on the forgot password page then the reset password email is
   * sent to the user.and then navigates to the login page
   */
  onSubmit({ value, valid }: { value: ForgotPassword; valid: boolean }): void {
    if (!valid) {
      return;
    }
    this.forgotService.forgotPassword(value).subscribe(
      data => {
        this.router.navigate(['/login']);
      },
      error => {
        this.error = error;
      }
    );

  }

}

