import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Documents, NewDoc} from 'src/app/models/navigation/documents.model';

@Component({
  selector: 'app-file-rename',
  templateUrl: './fileRename.component.html',
  styleUrls: ['./fileRename.component.scss']
})
export class FileRenameComponent implements OnInit {
  documentsData: Documents = <Documents>{};

  constructor(public helperService: HelperService,
              public formBuilder: FormBuilder,
  public dialogRef: MatDialogRef<FileRenameComponent>,
  @Inject(MAT_DIALOG_DATA) public data, public navService: NavigationService) { }

  ngOnInit() {
    this.documentsData.fileRenameForm = this.formBuilder.group({
      fileName: ['', Validators.required],
    });
    this.fileNameControls['fileName'].setValue(this.data.docInfo.title.split('.')[0]);
  }

  fileRenameSubmit({value}: { value: NewDoc}) {
    this.documentsData.loader = true;
      let newName = value.fileName + '.' + this.data.docInfo.title.split('.')[1];
      let blob = new Blob([this.data.docInfo.file]);
      let formData = new FormData();
      formData.append('title' , newName);
      formData.append('file', blob);
      formData.append('uploadedBy', this.data.docInfo.uploadedBy);
      this.navService.renameDocument(this.data.docInfo.id, formData).subscribe((res) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.DOCUMENT_RENAMED,
          this.helperService.constants.status.SUCCESS);
        this.dialogRef.close();
      }, (error) => {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.DOC_RENAME_FAIL);
        this.dialogRef.close();
      });

  }

  get fileNameControls() {
    return this.documentsData.fileRenameForm.controls;
  }
}
