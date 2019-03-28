import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ViewChild,
  ViewChildren
} from "@angular/core";
import { Translation } from "src/app/models/translate.model";
import { LoggingService } from "src/app/shared/logging/logging.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Verification } from "src/app/models/user.model";
import { LoginRegistrationService } from "../../services/LoginRegistrationService";
import { HelperService } from "src/app/shared/helperService/helper.service";

@Component({
  selector: "app-verification",
  templateUrl: "./verification.component.html",
  styleUrls: ["./verification.component.scss"]
})
export class VerificationComponent implements OnInit, OnDestroy {
  translated: Translation;
  verifyForm: FormGroup;
  emaill: any;
  data: any;
  success: any;
  res: any;
  appConstants: any;
  code: string = "";
  codeNumber: number;
  registrationData: any;
  constructor(
    private logging: LoggingService,
    private router: Router,
    public formBuilder: FormBuilder,
    private render: Renderer2,
    private loginRegService: LoginRegistrationService,
    private route: ActivatedRoute,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.render.addClass(
      document.body,
      this.helperService.constants.config.theme.modalClass
    );
    this.logging.appLoggerForDev(
      this.helperService.constants.status.SUCCESS,
      this.translated.LOGGER.MESSAGES.VERIFICATION_COMPONENT
    );
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.emaill = data;
    });
  }

  ngOnDestroy() {
    this.render.removeClass(
      document.body,
      this.helperService.constants.config.theme.background
    );
    this.logging.hideAllAppLoggers();
  }
  @ViewChildren("input") inputs;
  keyTab($event, value) {
    if (this.code == "") {
      this.code = value;
    } else {
      this.code = this.code + value;
    }

    let element = $event.srcElement.nextElementSibling;
    if (element == null) {
      this.codeNumber = parseInt(this.code);
      this.validateUser(this.codeNumber);
      return;
    } else {
      element.focus();
    }
  }

  get formValidation() {
    return this.verifyForm.controls;
  }

  validateUser(data: any) {
    this.loginRegService.verifyCode(data).subscribe(res => {
      debugger
    });
  }

  resendVerification() {
    this.loginRegService.validateUser(this.emaill).subscribe(
      data => {
        debugger
        this.helperService.creatLogger(
          this.helperService.constants.status.SUCCESS,
          this.translated.LOGGER.MESSAGES.REGISTRATION_SUCCESS,
          false
        );
        this.helperService.creatLogger(
          this.helperService.constants.status.SUCCESS,
          this.translated.MESSAGES.RESET_SUCCESS,
          false
        );
        this.router.navigate(["/signup"]);
      },
      error => {
          this.helperService.creatLogger(this.helperService.constants.status.ERROR, error.error, false);
          this.helperService.creatLogger(this.helperService.constants.status.ERROR,this.translated.MESSAGES.BACKEND_ERROR,false);
      }
    );
  }
}
