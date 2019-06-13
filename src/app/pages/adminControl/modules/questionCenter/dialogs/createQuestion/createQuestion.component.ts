import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-createQuestion',
  templateUrl: './createQuestion.component.html',
  styleUrls: ['./createQuestion.component.scss']
})
export class CreateQuestionComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) {
    this.helperService.translated.LOGGER.MESSAGES.ENTITYCONTROL
  }

  ngOnInit() {
  }

}
