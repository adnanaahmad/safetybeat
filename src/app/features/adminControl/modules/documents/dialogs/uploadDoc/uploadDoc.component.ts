import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
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

  constructor(public helperService: HelperService,
              private formBuilder: FormBuilder,
              private navService: NavigationService,
              public dialogRef: MatDialogRef<UploadDocComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.documentsData.folderExist = false;
    this.newDoc.entityId = this.data.entityID;
    this.newDoc.isEnabled = false;
    this.newDoc.disableButton = false;
    this.documentsData.loader = false;
  }

  ngOnInit() {
    this.newDoc.fileName = this.helperService.translated.STRINGS.UPLOAD_DOC;
    this.newDoc.uploadDocForm = this.formBuilder.group({
      doc: ['', Validators.required],
      folders: ['']
    });
    this.getAllFolders();
  }
// this function saves the folders taken from passed data
  getAllFolders() {
    this.documentsData.folderLength = (this.data && this.data.folders && this.data.folders.length) ? this.data.folders.length : 0;
    if (this.documentsData.folderLength === 0) {
      this.documentsData.folderExist = false;
    } else {
      this.documentsData.folderExist = true;
    }
    this.newDoc.folderList = this.data.folders;
  }

  get formControls() {
    return this.newDoc.uploadDocForm.controls;
  }
// this function saves the file when its chosen
  uploadFile(event) {
    this.newDoc.file = <File>event.target.files[0];
    this.newDoc.fileName = event.target.files[0] ? event.target.files[0].name : "";
  }
// this function takes file and folder and uploads it accordingly
  upload(value, folderId) {
    this.documentsData.loader = true;
    let blob = new Blob([this.newDoc.file]);
    let formData = new FormData();
    formData.append('file', blob, this.newDoc.file.name);
    formData.append('folder', folderId);
    formData.append('entityId', this.data.entityID);
    this.navService.uploadDocuments(formData).subscribe((res) => {
      if (res.responseDetails.code === 100) {
        this.documentsData.loader = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DOC_ADDED, this.helperService.constants.status.SUCCESS);
      } else {
        this.documentsData.loader = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DOC_UPLOAD_FAIL, this.helperService.constants.status.WARNING);
      }
      this.documentsData.loader = false;
      this.dialogRef.close();
    }, error => {
      this.documentsData.loader = false;
      this.dialogRef.close();
    });
  }

  folderFormSubmit({value}: { value: NewDoc }) {
    this.data.modalType && this.newDoc.isEnabled ? this.uploadDoc(value) : this.uploadToFolder(value);
  }
// to upload file to root folder
  uploadDoc(value: NewDoc) {
    this.documentsData.loader = true;
    this.newDoc.disableButton = true;
    if (!this.newDoc.isEnabled) {
      this.upload(value, '');
    } else {
      this.upload(value, value.folders);
    }
  }
// to upload a file to a folder
  uploadToFolder(value: NewDoc) {
    this.documentsData.loader = true;
    this.newDoc.disableButton = true;
    this.upload(value, this.data.folderId);
  }
// to enable or disable folderList
  showFolderList() {
    this.newDoc.isEnabled = !this.newDoc.isEnabled;
    return;
  }
}

