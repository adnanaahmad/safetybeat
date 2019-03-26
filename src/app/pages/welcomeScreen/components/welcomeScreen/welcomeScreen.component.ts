import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { Translation } from 'src/app/models/translate.model';

@Component({
  selector: 'app-welcomeScreen',
  templateUrl: './welcomeScreen.component.html',
  styleUrls: ['./welcomeScreen.component.scss']
})
export class WelcomeScreenComponent implements OnInit {
  translated: Translation;

  constructor(
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
  }

  ngOnInit() {
  }

}
