import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {AddQuestionData, QuestionCenter} from 'src/app/models/adminControl/questionCenter.model';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {QuestionCenterService} from 'src/app/features/adminControl/modules/questionCenter/services/questionCenter.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


@Component({
  selector: 'app-createQuestion',
  templateUrl: './createQuestion.component.html',
  styleUrls: ['./createQuestion.component.scss']
})
export class CreateQuestionComponent implements OnInit {
  QuestionObj: QuestionCenter = <QuestionCenter>{};

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    private compiler: CompilerProvider,
    private questionCenterService: QuestionCenterService,
    public dialogRef: MatDialogRef<CreateQuestionComponent>,
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
      canProceed: [false],
      parent: [false],
    });
    if (this.data.edit) {
      this.QuestionObj.addQuestionForm = this.formBuilder.group({
        questionDescription: this.data.questionData.description,
        questionWarning: this.data.questionData.warning,
        safeQuestion: this.data.questionData.safe,
        canProceed: this.data.questionData.canProceed,
        parent: this.data.questionData.parent,
      });
    }
  }

  get formValidation() {
    return this.QuestionObj.addQuestionForm.controls;
  }


  generateQuestionData(value) {
    let questionData: any = {
      description: value.questionDescription,
      parent: value.parent,
      warning: value.questionWarning,
      canProceed: value.canProceed,
      default: false,
      entity: this.helperService.getEntityId()
    };
    return questionData;
  }

  addQuestion(value) {
    this.QuestionObj.loading = true;
    this.questionCenterService.createQuestion(this.generateQuestionData(value)).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.QUESTION_CREATED,
          this.helperService.constants.status.SUCCESS);
        this.dialogRef.close();
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.helperService.translated.MESSAGES.QUESTION_CREATED);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.QuestionObj.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.QUESTION_CREATION_FAILURE,
          res.responseDetails.message);
        this.dialogRef.close();
        this.helperService.appLogger(this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.QUESTION_CREATION_FAILURE);
      }
    }, (error) => {
      this.QuestionObj.loading = false;
      this.dialogRef.close();
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  editQuestion(value) {
    this.QuestionObj.loading = true;
    this.questionCenterService.editQuestionOfQuestionBank(this.generateQuestionData(value), this.data.questionData.id).subscribe((res) => {
      this.QuestionObj.loading = false;
      this.dialogRef.close();
    }, (error) => {
      this.QuestionObj.loading = false;
      this.dialogRef.close();
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });

  }

  questionFormSubmit({value, valid}: { value: AddQuestionData; valid: boolean; }) {
    this.data.edit ? this.editQuestion(value) : this.addQuestion(value);
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

  }

}
