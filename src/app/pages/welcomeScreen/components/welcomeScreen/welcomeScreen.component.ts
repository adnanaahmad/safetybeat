import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-welcomeScreen',
  templateUrl: './welcomeScreen.component.html',
  styleUrls: ['./welcomeScreen.component.scss']
})
export class WelcomeScreenComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) {
  }

  ngOnInit() {
  }

}
