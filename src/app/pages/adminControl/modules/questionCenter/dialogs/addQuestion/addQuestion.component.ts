import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('questionInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddQuestionComponent>,
    private questionCenterService: QuestionCenterService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.QuestionObj.questionCtrl = new FormControl();
    this.QuestionObj.parentQuestions = data.parentQuestions;
    this.QuestionObj.childQuestions = data.childQuestions;
    this.QuestionObj.loading = false;
  }

  ngOnInit() {
    this.QuestionObj.addQuestionForm = this.formBuilder.group({
      parent: ['', Validators.required],
      childYes: [''],
      childNo: [''],
    });
    this.intialize();
  }

  intialize() {
    this.QuestionObj.filteredParentQuestion = this.data.parentQuestions;
    this.QuestionObj.filteredChildYesQuestion = this.data.childQuestions;
    this.QuestionObj.filteredChildNoQuestion = this.data.childQuestions;

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

  filterParentQuestion(value) {
    let filterValue = value.toLowerCase();
    this.QuestionObj.filteredParentQuestion = this.QuestionObj.parentQuestions.filter(
      question => question.description.toLowerCase().indexOf(filterValue) === 0);
  }

  filterChildNoQuestion(value) {
    let filterValue = value.toLowerCase();
    this.QuestionObj.filteredChildNoQuestion = this.QuestionObj.childQuestions.filter(
      question => question.description.toLowerCase().indexOf(filterValue) === 0);
  }

  filterChildYesQuestion(value) {
    let filterValue = value.toLowerCase();
    this.QuestionObj.filteredChildYesQuestion = this.QuestionObj.childQuestions.filter(
      question => question.description.toLowerCase().indexOf(filterValue) === 0);
  }

  get formValidation() {
    return this.QuestionObj.addQuestionForm.controls;
  }

}
