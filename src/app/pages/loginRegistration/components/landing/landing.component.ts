import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HelperService } from "src/app/shared/helperService/helper.service";
import { VerificationComponent } from "../verification/verification.component";
import { validateUser } from "src/app/models/user.model";
import { LoginRegistrationService } from "../../services/LoginRegistrationService";
import {
  FormArrayName,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"]
})
export class LandingComponent implements OnInit {
  validateForm: FormGroup;
  validationResponse: any;
  devMode: boolean = false;
  translated: any;
  appConstants: any;
  appIcons: any;
  city: any;
  country: any;
  zipCode: any;
  zone: any;
  addr: any;
  addrKeys: string[];
  constructor(
    public router: Router,
    private helperService: HelperService,
    private loginService: LoginRegistrationService,
    private formBuilder: FormBuilder
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.appIcons = this.helperService.constants.appIcons;
    this.devMode = this.helperService.constants.config.devMode;
  }

  ngOnInit() {
    this.validateForm = this.formBuilder.group({
      email: ["", Validators.email]
    });
  }

  get formValidation() {
    return this.validateForm.controls;
  }
  setAddress(addrObj) {
    this.city = addrObj.locality;
    this.country = addrObj.country;
    this.zipCode = addrObj.zipCode;
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  validateUser({
    value,
    valid
  }: {
    value: validateUser;
    valid: boolean;
  }): void {
    if (!valid) {
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.translated.MESSAGES.EMAIL_MSG
      );
      return;
    }
    this.loginService.validateUser(value).subscribe(
      result => {
        this.validationResponse = result;
        if (this.validationResponse.responseDetails.code === "0034") {
          this.helperService.appLogger(
            this.helperService.constants.status.SUCCESS,
            this.translated.MESSAGES.VERIFICATIONCODEEMAIL
          );
          this.helperService.createModal(VerificationComponent, {
            data: { email: value.email }
          });
        }
      },
      error => {
        this.helperService.appLogger(
          this.helperService.constants.status.ERROR,
          `${error.error +
            this.translated.LOGGER.MESSAGES.STATUS +
            error.status}`
        );
      }
    );
  }
}
