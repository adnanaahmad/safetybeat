import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {FileRenameComponent} from 'src/app/features/adminControl/modules/documents/dialogs/fileRename/fileRename.component';
import {DocumentObj} from 'src/app/models/navigation/documents.model';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnDestroy {
  showLoader: boolean;
  @Input() docData: DocumentObj;
  @Output() processAction: EventEmitter<any> = new EventEmitter<any>();
  private subs = new SubSink();

  constructor(public dialog: MatDialog,
              public helperService: HelperService,
              public navService: NavigationService) {
  }

  ngOnInit() {
    this.showLoader = false;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Delete Document
   * @params id
   */
  deleteDoc(id: number) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_DOCUMENT}});
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        if (res === this.helperService.appConstants.yes) {
          this.showLoader = true;
          this.helperService.toggleLoader(true);
          this.subs.add(
            this.navService.deleteDoc(id).subscribe((res: Object) => {
              this.showLoader = false;
              this.processAction.emit(true);
            }, (error) => {
              this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
            }));
        } else {
          this.showLoader = false;
          this.processAction.emit(false);
        }
      }));
  }

  /**
   * Rename Document
   * @params doc
   */
  renameDoc(doc) {
    this.helperService.createDialog(FileRenameComponent, {disableClose: true, data: {docInfo: doc}});
    this.subs.add(
      this.helperService.dialogRef.afterClosed().subscribe(res => {
        if (res !== 'cancel') {
          this.processAction.emit(true);
        } else {
          this.showLoader = false;
        }
      }));
  }
}
