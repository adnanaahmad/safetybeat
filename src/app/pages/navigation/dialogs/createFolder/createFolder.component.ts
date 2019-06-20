import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Documents, Folders} from 'src/app/models/navigation/documents.model';

@Component({
  selector: 'app-create-folder',
  templateUrl: './createFolder.component.html',
  styleUrls: ['./createFolder.component.scss']
})
export class CreateFolderComponent implements OnInit {
  documentsData: Documents = <Documents>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CreateFolderComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private navService: NavigationService) {

  }

  ngOnInit() {
    this.documentsData.folderForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
    this.documentsData.modalType = this.data.type;
    if (!this.documentsData.modalType) {
      this.folderFormControls['title'].setValue(this.data.name);
    }
  }

  get folderFormControls() {
    return this.documentsData.folderForm.controls;
  }

  folderFormSubmit({value}: { value: Folders }) {
    this.documentsData.modalType ? this.createFolder(value) : this.renameFolder(value);
  }

  createFolder(value: Folders) {
    if (value.title === this.helperService.appConstants.Root ) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.CANT_CREATE_ROOT, this.helperService.constants.status.WARNING);
    } else {
      let data = {name: value.title, entity: this.data.id};
      this.navService.createFolder(data).subscribe((res) => {
        if (res.responseDetails.code === 100) {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.NEW_FOLDER, this.helperService.constants.status.SUCCESS);
          this.dialogRef.close();
        } else {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_FAIL, this.helperService.constants.status.WARNING);
          this.dialogRef.close();
        }
      });
    }
  }

  renameFolder(value: Folders) {
    let data = {name: value.title, entity: this.data.id};
    this.navService.renameFolder(this.data.folderId, data).subscribe((res) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_RENAMED, this.helperService.constants.status.SUCCESS);
      this.dialogRef.close();
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.RENAME_FAIL);
    });
  }
}
