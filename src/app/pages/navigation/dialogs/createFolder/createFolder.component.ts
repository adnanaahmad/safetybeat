import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Folders} from 'src/app/models/navigation/documents.model';

@Component({
  selector: 'app-create-folder',
  templateUrl: './createFolder.component.html',
  styleUrls: ['./createFolder.component.scss']
})
export class CreateFolderComponent implements OnInit {
  folderForm: any;
  modalType: boolean;

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CreateFolderComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private navService: NavigationService) {
  }

  ngOnInit() {
    this.folderForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
    this.modalType = this.data.type;
    if (!this.modalType) {
      this.folderFormControls['title'].setValue(this.data.name);
    }
  }

  get folderFormControls() {
    return this.folderForm.controls;
  }

  folderFormSubmit({value}: { value: Folders }) {
    this.modalType ? this.createFolder(value) : this.renameFolder(value);
  }

  createFolder(value: Folders) {
    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    let data = {name: value.title, entity: entityId};
    this.navService.createFolder(data).subscribe((res) => {
      if (res.responseDetails.code === 100) {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.NEW_FOLDER, this.helperService.constants.status.SUCCESS);
      } else {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_FAIL, this.helperService.constants.status.WARNING);
      }
    });
    this.dialogRef.close();
  }

   renameFolder(value: Folders) {
    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem
      (this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    let data = {name: value.title, entity: entityId};
    this.navService.renameFolder(this.data.id, data).subscribe((res) => {
    });
    this.dialogRef.close();
  }
}
