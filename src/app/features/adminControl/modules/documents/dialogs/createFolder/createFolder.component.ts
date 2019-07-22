import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
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
    this.documentsData.loader = false;
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

// this function opens a dialog to create new folder
  createFolder(value: Folders) {
    this.documentsData.loader = true;
    if (value.title === this.helperService.appConstants.Root) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.CANT_CREATE_ROOT, this.helperService.constants.status.WARNING);
    } else if (this.data.folderList && this.checkFolderName(value.title)) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.SAME_FOLDER_NAME,
        this.helperService.constants.status.WARNING);
      this.dialogRef.close();
    } else {
      let data = {name: value.title, entity: this.data.id};
      this.documentsData.loader = true;
      this.navService.createFolder(data).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.documentsData.loader = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.NEW_FOLDER, this.helperService.constants.status.SUCCESS);
          this.dialogRef.close();
        } else {
          this.documentsData.loader = false;
          this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_FAIL, this.helperService.constants.status.WARNING);
          this.dialogRef.close();
        }
      }, (error) => {
        this.documentsData.loader = false;
        this.dialogRef.close();
      });
    }
  }

  /**
   * this function opens a dialog to rename existing folder
   * @params value
   */
  renameFolder(value: Folders) {
    this.documentsData.loader = true;
    if (this.checkFolderName(value.title)) {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.SAME_FOLDER_NAME,
        this.helperService.constants.status.WARNING);
      this.documentsData.loader = false;
      this.dialogRef.close();
    } else {
      let data = {name: value.title, entity: this.data.id};
      this.navService.renameFolder(this.data.folderId, data).subscribe((res) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_RENAMED, this.helperService.constants.status.SUCCESS);
        this.documentsData.loader = false;
        this.dialogRef.close();
      }, (error) => {
        this.documentsData.loader = false;
        this.dialogRef.close();
        this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
      });
    }
  }

  /**
   * this function checks if the new folder name already exists or not
   * @params title
   */
  checkFolderName(title: string) {
    let length = this.data.folderList.length;
    for (let i = 0; i < length; i++) {
      if (this.data.folderList[i].name === title) {
        return true;
      }
    }
    return false;
  }
}
