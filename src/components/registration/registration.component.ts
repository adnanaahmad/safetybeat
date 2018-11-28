import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../services/registration/registration.service'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private regService: RegistrationService,
  ) {

  }
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_no: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]]
    }, { validator: this.checkPasswords });
  }
  checkPasswords(group: FormGroup) {
    let pass = group.controls.password1.value;
    let confirmPass = group.controls.password2.value
    return pass === confirmPass ? null : group.controls.password2.setErrors({ notSame: true })
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    } else {

      this.loading = true;
      this.registerForm.value.mobile_no = this.registerForm.value.mobile_no.toString()
      this.regService.registerUser(this.registerForm.value)
        .subscribe(
          data => {
            // this.router.navigate(['/login']);
          },
          error => {
            this.loading = false;
          });
    }
  }

}
