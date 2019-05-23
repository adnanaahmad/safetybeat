import { Component, OnInit } from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material';
import {NewDoc, UploadDocForm} from 'src/app/models/navigation/documents.model';
@Component({
  selector: 'app-upload-doc',
  templateUrl: './uploadDoc.component.html',
  styleUrls: ['./uploadDoc.component.scss']
})
export class UploadDocComponent implements OnInit {
  newDoc: UploadDocForm = <UploadDocForm>{};
  docResponse: any;

  constructor(public helperService: HelperService,
              private formBuilder: FormBuilder,
              private navService: NavigationService,
              public dialogRef: MatDialogRef<UploadDocComponent>) { }

  ngOnInit() {

    this.newDoc.uploadDocForm = this.formBuilder.group({
      fileName: ['', Validators.required],
      doc: ['', Validators.required],
      folders: ['']
    });

    this.newDoc.entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem
      (this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.getAllFolders(this.newDoc.entityId);
  }

  getAllFolders(entityId) {
    this.navService.allFolders({entityId: entityId}).subscribe((res) => {
      if (res.responseDetails.code === 104) {
        this.formControls.folders.disable();
        this.newDoc.folderList = [];
      } else {
        this.newDoc.folderList = res.data;
      }
    });
  }

  checkRoot(data): any {
    if (data !== []) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === 'root' ) {
          return data[i].id;
        }
      }
    } return null;
  }

  get formControls() {
    return this.newDoc.uploadDocForm.controls;
  }

  uploadFile(event) {
    this.newDoc.file = <File>event.target.files[0];
  }

  upload(value, folderName) {
    let blob = new Blob([this.newDoc.file]);
    let formData = new FormData();
    formData.append('file', blob, this.newDoc.file.name);
    formData.append('title', value.fileName);
    formData.append('folder', folderName);

    this.navService.uploadDocuments(formData).subscribe((res) => {
      if (res.responseDetails.code === 100) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DOC_ADDED, this.helperService.constants.status.SUCCESS);
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DOC_FAIL, this.helperService.constants.status.WARNING);
      }
    });
  }

  uploadDoc({value, valid}: { value: NewDoc; valid: boolean; }) {
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    if (this.formControls.folders.value === '' ) {
      if (!this.checkRoot(this.newDoc.folderList)) {
        let data = {name: 'root', entity: this.newDoc.entityId};
        this.navService.createFolder(data).subscribe((res) => {
        }); } else {
        this.upload(value, this.checkRoot(this.newDoc.folderList));
      }
    } else {
      this.upload(value, value.folders);
    }
    this.dialogRef.close();
  }
}

