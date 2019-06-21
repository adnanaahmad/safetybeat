import {Component, OnInit, Inject} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Documents, NewDoc, UploadDocForm} from 'src/app/models/navigation/documents.model';
import {Validators, FormBuilder} from '@angular/forms';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-uploadFolderDoc',
  templateUrl: './uploadFolderDoc.component.html',
  styleUrls: ['./uploadFolderDoc.component.scss']
})
export class UploadFolderDocComponent implements OnInit {
  newDoc: UploadDocForm = <UploadDocForm>{};
  documentsData: Documents = <Documents>{};
  fileName: String;

  constructor(
    public helperService: HelperService,
    private formBuilder: FormBuilder,
    private navService: NavigationService,
    public dialogRef: MatDialogRef<UploadFolderDocComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
  }

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

  // uploadFile(event) {
  //   this.newDoc.file = <File>event.target.files[0];
  //   this.fileName = event.target.files[0].name.split('.')[0];
  // }

  uploadFile(event) {
    this.newDoc.file = <File>event.target.files[0];
  }

  upload(value, folderId) {
    let blob = new Blob([this.newDoc.file]);
    let formData = new FormData();
    formData.append('file', blob, this.newDoc.file.name);
    formData.append('title', value.fileName);
    formData.append('folder', folderId);

    this.navService.uploadDocuments(formData).subscribe((res) => {
      if (res.responseDetails.code === 100) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DOC_ADDED, this.helperService.constants.status.SUCCESS);
        this.documentsData.loader = false;
        this.dialogRef.close();
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DOC_UPLOAD_FAIL, this.helperService.constants.status.WARNING);
        this.documentsData.loader = false;
        this.dialogRef.close();
      }
    });
  }

  uploadToFolder({value, valid}: { value: NewDoc; valid: boolean; }) {
    this.documentsData.loader = true;
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.upload(value, this.data.folderId);
  }
}
