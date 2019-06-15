import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';
export interface Food {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-createQuestion',
  templateUrl: './createQuestion.component.html',
  styleUrls: ['./createQuestion.component.scss']
})
export class CreateQuestionComponent implements OnInit {
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  constructor(
    public helperService: HelperService
  ) {
    this.helperService.translated.LOGGER.MESSAGES.ENTITYCONTROL
  }

  ngOnInit() {
  }

}
