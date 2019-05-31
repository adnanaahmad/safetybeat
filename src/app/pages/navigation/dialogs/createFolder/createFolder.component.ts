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
  private folderExist: boolean = false;
  folderList: any;
  private entityId: number;
  private folderCreated: boolean;

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CreateFolderComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private navService: NavigationService) {
    this.folderCreated = false;
  }

  ngOnInit() {
    this.folderForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
    this.modalType = this.data.type;
    if (!this.modalType) {
      this.folderFormControls['title'].setValue(this.data.name);
    }
    this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.entityId = res.entityInfo.id;
      }
    });
  }

  get folderFormControls() {
    return this.folderForm.controls;
  }

  folderFormSubmit({value}: { value: Folders }) {
    this.modalType ? this.createFolder(value) : this.renameFolder(value);
  }

  createFolder(value: Folders) {
    let data = {name: value.title, entity: this.data.id};
    this.navService.createFolder(data).subscribe((res) => {
      if (res.responseDetails.code === 100) {
        this.getAllFolders(this.entityId);
        this.folderCreated = true;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.NEW_FOLDER, this.helperService.constants.status.SUCCESS);
        this.dialogRef.close(this.folderCreated);
      } else {
        this.folderCreated = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.FOLDER_FAIL, this.helperService.constants.status.WARNING);
        this.dialogRef.close(this.folderCreated);
      }
    });
  }

  getAllFolders(entityID: number) {
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
      if (res.responseDetails.code === 104) {
        this.folderExist = false;
      } else {
        this.folderList = res.data;
        this.navService.updateFolder(this.folderList);
        if (this.folderList.length === 0) {
          this.folderExist = false;
        }
      }
    });
  }

  renameFolder(value: Folders) {
    let data = {name: value.title, entity: this.data.id};
    this.navService.renameFolder(this.data.folderId, data).subscribe((res) => {
    });
    this.dialogRef.close();
  }
}
