import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {AddQuestionData, QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {QuestionCenterService} from 'src/app/pages/adminControl/modules/questionCenter/services/questionCenter.service';

@Component({
  selector: 'app-addQuestion',
  templateUrl: './addQuestion.component.html',
  styleUrls: ['./addQuestion.component.scss']
})
export class AddQuestionComponent implements OnInit {
  QuestionObj: QuestionCenter = <QuestionCenter>{};

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    private compiler: CompilerProvider,
    private questionCenterService: QuestionCenterService,
    public dialogRef: MatDialogRef<AddQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.QuestionObj.translated = this.helperService.translated;
    this.QuestionObj.canProceed = true;
    this.QuestionObj.parent = true;
    this.QuestionObj.canSafe = this.helperService.appConstants.safeQuestionYes;
  }

  ngOnInit() {
    this.QuestionObj.addQuestionForm = this.formBuilder.group({
      questionDescription: ['', Validators.required],
      questionWarning: [''],
      safeQuestion: [''],
      canProceed: [''],
      parent: [''],
    });
  }

  get formValidation() {
    return this.QuestionObj.addQuestionForm.controls;
  }


  generateQuestionData(value) {
    let questionData: any = {
      description: value.questionDescription,
      parent:  this.QuestionObj.parent,
      warning: value.questionWarning,
      canProceed: this.QuestionObj.canProceed,
      safe: this.QuestionObj.canSafe,
      default: false,
      entity: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key)),
    };
    return questionData;
  }

  questionFormSubmit({value, valid}: { value: AddQuestionData; valid: boolean; }) {
    if (!valid) {
      this.helperService.appLoggerDev(
        this.helperService.constants.status.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.helperService.translated.LOGGER.MESSAGES.QUESTION_DATA_REQ
      );
      return;
    }
    this.QuestionObj.loading = true;
    this.questionCenterService.addQuestion(this.generateQuestionData(value)).subscribe((res) => {
      this.QuestionObj.addQuestionResponse = res;
      if (this.QuestionObj.addQuestionResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.QUESTION_CREATED,
          this.helperService.constants.status.SUCCESS);
        this.dialogRef.close();
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.QUESTION_CREATED);
      } else if (this.QuestionObj.addQuestionResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.QUESTION_CREATION_FAILURE,
          res.responseDetails.message);
        this.dialogRef.close();
        this.helperService.appLogger(this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.QUESTION_CREATION_FAILURE);
      }
    });
  }

  changeSafeOption(event) {
    this.QuestionObj.canSafe = event.value;
  }

}
