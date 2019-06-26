import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MAT_DIALOG_DATA, MatAutocomplete, MatDialogRef} from '@angular/material';
import {QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {QuestionCenterService} from 'src/app/pages/adminControl/modules/questionCenter/services/questionCenter.service';

@Component({
  selector: 'app-addQuestion',
  templateUrl: './addQuestion.component.html',
  styleUrls: ['./addQuestion.component.scss']
})
export class AddQuestionComponent implements OnInit {
  QuestionObj: QuestionCenter = <QuestionCenter>{};
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddQuestionComponent>,
    private questionCenterService: QuestionCenterService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.QuestionObj.parentQuestions = data.parentQuestions;
    this.QuestionObj.childQuestions = data.childQuestions;
    this.QuestionObj.loading = false;
    this.QuestionObj.questionCtrl = new FormControl();
  }

  ngOnInit() {
    this.QuestionObj.addQuestionForm = this.formBuilder.group({
      parent: ['', Validators.required],
      childYes: ['', Validators.required],
      childNo: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  questionFormSubmit(questionForm) {
    this.QuestionObj.loading = true;
    let data = {
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
      parentQuestion: questionForm.value.parent,
      childYes: questionForm.value.childYes,
      childNo: questionForm.value.childNo
    }
    this.questionCenterService.addQuestion(data).subscribe((res) => {
      this.QuestionObj.loading = false;
      this.onNoClick();
    });
  }

  filterResult(event) {
    console.log(event)
  }

}
