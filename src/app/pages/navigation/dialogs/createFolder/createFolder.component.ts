import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {NavigationService} from '../../services/navigation.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Folders} from '../../../../models/welcomeScreen/folders.model';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-create-folder',
  templateUrl: './createFolder.component.html',
  styleUrls: ['./createFolder.component.scss']
})
export class CreateFolderComponent implements OnInit {
  folderForm: any;

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<CreateFolderComponent>,
              private navService: NavigationService) {
  }

  ngOnInit() {
    this.folderForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  get formValidation() {
    return this.folderForm.controls;
  }

  createFolder({value, valid}: { value: Folders; valid: boolean; }) {
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    let data = {name: value.title, entity: entityId};
    this.navService.createFolder(data).subscribe((res) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.NEW_FOLDER, this.helperService.constants.status.SUCCESS);
    });
    this.dialogRef.close();
  }
}
