import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {FileRenameComponent} from 'src/app/features/adminControl/modules/documents/dialogs/fileRename/fileRename.component';
import {DocumentObj} from 'src/app/models/navigation/documents.model';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  showLoader: boolean;
  @Input() docData: DocumentObj;
  @Output() processAction: EventEmitter<any> = new EventEmitter<any>();

  constructor( public dialog: MatDialog,
              public helperService: HelperService,
              public navService: NavigationService) { }

  ngOnInit() {
    this.showLoader = false;
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
        this.showLoader = true;
        this.helperService.toggleLoader(true);
        this.navService.deleteDoc(id).subscribe((res: Object) => {
          this.showLoader = false;
          this.processAction.emit(true);
        });
      } else {
        this.showLoader = false;
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
    this.helperService.createDialog(FileRenameComponent, {disableClose: true, data : {docInfo: doc}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res !== 'cancel') {
        this.processAction.emit(true);
      } else {
        this.showLoader = false;
      }
    });
  }


}
