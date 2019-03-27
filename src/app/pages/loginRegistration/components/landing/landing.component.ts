import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HelperService } from "src/app/shared/helperService/helper.service";
import { VerificationComponent } from "../verification/verification.component";
import { validateUser } from 'src/app/models/user.model';
import { LoginRegistrationService } from '../../services/LoginRegistrationService';
import { FormArrayName, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"]
})
export class LandingComponent implements OnInit {
  validateForm: FormGroup;
  constructor(
    public router: Router, 
    private helperService: HelperService,
    private loginService:LoginRegistrationService,
    private formBuilder:FormBuilder
    ) {}

  ngOnInit() {
    this.validateForm = this.formBuilder.group({
      email: ['', Validators.email]
    });
  }

  get formValidation() {
    return this.validateForm.controls;
  }

  start() {
    this.helperService.createModal(VerificationComponent);
  }
  validateUser({ value, valid }: { value: validateUser; valid: boolean }):void{
    if(!valid){
      this.helperService.creatLogger(this.helperService.constants.status.ERROR,'User data is invalid',false);
      return;
    }

    this.loginService.validateUser(value).subscribe((result)=>{
      debugger
    })



  }
}
