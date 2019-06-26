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
      // fileName: ['', Validators.required],
      doc: ['', Validators.required],
      folders: ['']
    });
    this.getAllFolders();
    // this.navService.selectedEntityData.subscribe((res) => {
    //   if (res !== 1) {
    //     this.newDoc.entityId = res.entityInfo.id;
    //   }
    // });
  }

  getAllFolders() {
    this.documentsData.folderLength = this.data.folders.length;
    if (this.documentsData.folderLength === 0) {
      this.documentsData.rootOnly = true;
    } else {
      // if (this.documentsData.folderLength === 1) {
      //   if (this.data.folders[0].name === 'root') {
      //     this.documentsData.rootOnly = true;
      //   }
      // }
    }
    this.newDoc.folderList = this.data.folders;
  }

  get formControls() {
    return this.newDoc.uploadDocForm.controls;
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
  folderFormSubmit({value}: { value: NewDoc }) {
    this.data.modalType ? this.uploadDoc(value) : this.uploadToFolder(value);
  }

  uploadDoc(value: NewDoc) {
    this.documentsData.loader = true;
      this.upload(value, value.folders);
  }

  uploadToFolder(value: NewDoc) {
    this.documentsData.loader = true;
    this.upload(value, this.data.folderId);
  }

  showFolderList() {
    this.isDisabled = !this.isDisabled;
    return;
  }
}

