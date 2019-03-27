import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { VerificationComponent } from '../verification/verification.component';

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"]
})
export class LandingComponent implements OnInit {
  constructor(
    public router: Router,
    private helperService : HelperService
  ) {}

  ngOnInit() {}

  start() {
    this.helperService.createModal(VerificationComponent);
  }
}
