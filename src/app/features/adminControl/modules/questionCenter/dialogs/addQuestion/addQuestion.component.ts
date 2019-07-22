import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatAutocomplete, MatCheckboxChange, MatDialogRef} from '@angular/material';
import {GenerateQuestionData, QuestionCenter, Questions} from 'src/app/models/adminControl/questionCenter.model';
import {FormBuilder, Validators} from '@angular/forms';
import {QuestionCenterService} from 'src/app/features/adminControl/modules/questionCenter/services/questionCenter.service';

@Component({
  selector: 'app-addQuestion',
  templateUrl: './addQuestion.component.html',
  styleUrls: ['./addQuestion.component.scss']
})
export class AddQuestionComponent implements OnInit {
  QuestionObj: QuestionCenter = <QuestionCenter>{};
  @ViewChild('questionInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddQuestionComponent>,
    private questionCenterService: QuestionCenterService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.initialize();
    this.QuestionObj.parentQuestions = data.parentQuestions;
    this.QuestionObj.childQuestions = data.childQuestions;
    this.QuestionObj.edit = data.edit;
    this.QuestionObj.loading = false;
  }

  ngOnInit() {
    this.QuestionObj.addQuestionForm = this.formBuilder.group({
      parent: ['', Validators.required],
      childYes: [''],
      childNo: [''],
      childYesSafe: [''],
      childNoSafe: ['']
    });
    if (this.QuestionObj.edit) {
      this.QuestionObj.addQuestionForm = this.formBuilder.group({
        parent: this.data.questionData.parent,
        childYes: this.data.questionData.childYes,
        childNo: this.data.questionData.childNo,
        childYesSafe: this.data.questionData.childYesSafe,
        childNoSafe: this.data.questionData.childNoSafe,
      });
    }
  }

  initialize() {
    this.QuestionObj.filteredParentQuestion = this.data.parentQuestions;
    this.QuestionObj.filteredChildYesQuestion = this.data.childQuestions;
    this.QuestionObj.filteredChildNoQuestion = this.data.childQuestions;
    this.QuestionObj.childNo = false;
    this.QuestionObj.childYes = false;

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  questionFormSubmit(questionForm) {
    this.QuestionObj.edit ? this.editQuestion(questionForm) : this.addQuestion(questionForm);
  }

  generateQuestionData(questionForm) {
    let questionData: GenerateQuestionData = {
      parentQuestion: questionForm.value.parent.id,
      childYes: questionForm.value.childYes.id,
      childNo: questionForm.value.childNo.id,
      childYesSafe: questionForm.value.childYesSafe,
      childNoSafe: questionForm.value.childNoSafe,
    };
    if (!this.QuestionObj.edit) {
      questionData.entity = JSON.parse(this.helperService.decrypt
      (localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key));
    }
    return questionData;
  }

  editQuestion(questionForm) {
    this.QuestionObj.loading = true;
    this.questionCenterService.editQuestion(this.generateQuestionData(questionForm), this.data.questionData.id).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.QuestionObj.loading = false;
        this.onNoClick();
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
      } else {
        this.QuestionObj.loading = false;
        this.onNoClick();
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.QuestionObj.loading = false;
      this.onNoClick();
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  addQuestion(questionForm) {
    this.QuestionObj.loading = true;
    this.questionCenterService.addQuestion(this.generateQuestionData(questionForm)).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS)
        this.QuestionObj.loading = false;
        this.onNoClick();
      } else {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR)
        this.QuestionObj.loading = false;
        this.onNoClick();
      }

    }, (error) => {
      this.QuestionObj.loading = false;
      this.onNoClick();
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  filterParentQuestion(value) {
    let filterValue = value.toLowerCase();
    this.QuestionObj.filteredParentQuestion = this.QuestionObj.parentQuestions.filter(
      question => question.description.toLowerCase().indexOf(filterValue) === 0);
    let validation = this.QuestionObj.filteredParentQuestion.length === 0
    this.QuestionObj.addQuestionForm.controls.parent.setErrors({notValid: validation})
  }

  filterChildNoQuestion(value) {
    let filterValue = value.toLowerCase();
    this.QuestionObj.filteredChildNoQuestion = this.QuestionObj.childQuestions.filter(
      question => question.description.toLowerCase().indexOf(filterValue) === 0);
    let validation = this.QuestionObj.filteredChildNoQuestion.length === 0
    this.QuestionObj.addQuestionForm.controls.childNo.setErrors({notValid: validation})
  }

  filterChildYesQuestion(value) {
    let filterValue = value.toLowerCase();
    this.QuestionObj.filteredChildYesQuestion = this.QuestionObj.childQuestions.filter(
      question => question.description.toLowerCase().indexOf(filterValue) === 0);
    let validation = this.QuestionObj.filteredChildYesQuestion.length === 0
    this.QuestionObj.addQuestionForm.controls.childYes.setErrors({notValid: validation})
  }

  get formValidation() {
    return this.QuestionObj.addQuestionForm.controls;
  }

  displayQuestion(question?: Questions): string | undefined {
    return question ? question.description : undefined;
  }

  /**
   * this function is used to enable and the child yes options
   * @params event
   */

  childYesEnable(event: MatCheckboxChange | Event) {
    if (!(event instanceof MatCheckboxChange) || event.checked) {
      this.QuestionObj.childYes = true;
    } else {
      this.QuestionObj.childYes = false;
    }
  }

  /**
   * this function is used to enable and disable child no options
   * @params event
   */

  childNoEnable(event: MatCheckboxChange | Event) {
    if (!(event instanceof MatCheckboxChange) || event.checked) {
      this.QuestionObj.childNo = true;
    } else {
      this.QuestionObj.childNo = false;
    }
  }
}
