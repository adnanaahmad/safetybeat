import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {AddQuestionData, QuestionCenter} from 'src/app/models/adminCOntrol/questionCenter.model';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';
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
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.QuestionObj.translated = this.helperService.translated;
    this.QuestionObj.questionTypes = this.data.questionTypes;
    let index = this.helperService.findIndex(this.QuestionObj.questionTypes, function (type) {
      return type;
    });
    this.QuestionObj.selectedType =
      index !== -1 ? this.QuestionObj.questionTypes[index] : this.QuestionObj.questionTypes[0];
    this.changeSelection(this.QuestionObj.selectedType);
  }

  ngOnInit() {
    this.QuestionObj.addQuestionForm = this.formBuilder.group({
      questionDescription: ['', Validators.required],
      questionWarning: [''],
      questionType: ['', Validators.required],
      safeQuestion: [''],
      canProceed: [''],
    });
    this.formValidation['questionType'].setValue(this.QuestionObj.selectedType);
  }

  get formValidation() {
    return this.QuestionObj.addQuestionForm.controls;
  }

  changeSelection(value: any) {
    let obj = this.helperService.find(this.QuestionObj.questionTypes, {'id': value.id});
    obj.type === this.compiler.insertSpaces(this.helperService.appConstants.questionTypeValues.openEnded) ?
      this.QuestionObj.openEnded = true : this.QuestionObj.openEnded = false;
  }

  generateQuestionData(value) {
    debugger;
    let questionData: any = {
      description: value.questionDescription,
      type: value.questionType.id,
      warning: value.questionWarning,
      canProceed:  value.canProceed === 'Yes',
      safe: value.safeQuestion,
      entityId: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
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
    debugger;
    this.QuestionObj.loading = true;
    console.log(value);
    this.questionCenterService.addQuestion(this.generateQuestionData(value)).subscribe((res) => {
      debugger;
      this.QuestionObj.addQuestionResponse = res;
      if (this.QuestionObj.addQuestionResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.loading = false;
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.QUESTION_CREATED);
      } else if (this.QuestionObj.addQuestionResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.loading = false;
        this.helperService.appLogger(this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.QUESTION_CREATION_FAILURE);
      }
    });
  }


}
