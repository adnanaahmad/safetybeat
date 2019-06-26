import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Documents, NewDoc, UploadDocForm} from 'src/app/models/navigation/documents.model';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './uploadDoc.component.html',
  styleUrls: ['./uploadDoc.component.scss']
})
export class UploadDocComponent implements OnInit {
  newDoc: UploadDocForm = <UploadDocForm>{};
  documentsData: Documents = <Documents>{};
  private isDisabled: boolean;
  private fileName: any;

  constructor(public helperService: HelperService,
              private formBuilder: FormBuilder,
              private navService: NavigationService,
              public dialogRef: MatDialogRef<UploadDocComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.documentsData.rootOnly = false;
    this.newDoc.entityId = this.data.entityID;
    this.isDisabled = false;
  }

  ngOnInit() {
    this.newDoc.uploadDocForm = this.formBuilder.group({
      doc: ['', Validators.required],
      folders: ['']
    });
    this.getAllFolders();
  }

  getAllFolders() {
    this.documentsData.folderLength = this.data.folders.length;
    if (this.documentsData.folderLength === 0) {
      this.documentsData.rootOnly = true;
    }
    this.newDoc.folderList = this.data.folders;
  }

  uploadFile(event) {
    this.newDoc.file = <File>event.target.files[0];
    this.fileName = event.target.files[0].name;
  }

  upload(value, folderId) {
    let blob = new Blob([this.newDoc.file]);
    let formData = new FormData();
    formData.append('file', blob, this.newDoc.file.name);
    formData.append('folder', folderId);
    formData.append('entityId', this.data.entityID);

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

  uploadDoc({value, valid}: { value: NewDoc; valid: boolean; }) {
    this.documentsData.loader = true;
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.upload(value, value.folders);
  }

  showFolderList() {
    this.isDisabled = !this.isDisabled;
    return;
  }
}

