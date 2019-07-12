import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {ConfirmationModalComponent} from 'src/app/shared/dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @Input() docData: Object;
  @Output() processAction: EventEmitter<any> = new EventEmitter<any>();
  private fileName: string;
  editable: boolean;


  constructor( public dialog: MatDialog,
              public helperService: HelperService,
              public navService: NavigationService) { }

  ngOnInit() {
  }

  /**
   * Delete Document
   * @params id
   */
  deleteDoc(id: number) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_DOCUMENT}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteDoc(id).subscribe((res: Object) => {
          this.processAction.emit(true);
        });
      } else {
        this.processAction.emit(false);
      }
    });
  }

  /**
   * View Document
   * @params doc
   */
  // viewDoc(doc: any) {
  //   this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
  // }
  renameDoc (doc) {
    this.editable = true;
    this.fileName = doc.title.split('.')[0];
  }

  editedValue(value, doc) {
    this.editable = false;
    value = value + '.' + (doc.title.split('.'))[1];
    let blob = new Blob([doc.file]);
    let formData = new FormData();
    formData.append('title' , value);
    formData.append('file', blob);
    formData.append('uploadedBy', doc.uploadedBy);
    this.navService.renameDocument(doc.id, formData).subscribe((res) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.DOCUMENT_RENAMED, this.helperService.constants.status.SUCCESS);
      this.processAction.emit(true);
    }, (error) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.helperService.translated.MESSAGES.DOC_RENAME_FAIL);
      this.processAction.emit(false);
    });
  }

}
