import { Component, OnInit, Inject } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UploadDocForm } from 'src/app/models/navigation/documents.model';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-uploadFolderDoc',
  templateUrl: './uploadFolderDoc.component.html',
  styleUrls: ['./uploadFolderDoc.component.scss']
})
export class UploadFolderDocComponent implements OnInit {
  newDoc: UploadDocForm = <UploadDocForm>{};
  fileName:String;
  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() {
    this.newDoc.uploadDocForm = this.formBuilder.group({
      fileName: ['', Validators.required],
      doc: ['', Validators.required],
      folders: ['']
    });
  }
  get formControls() {
    return this.newDoc.uploadDocForm.controls;
  }
  uploadFile(event) {
    this.newDoc.file = <File>event.target.files[0];
    this.fileName = event.target.files[0].name.split('.')[0];
  }
}
