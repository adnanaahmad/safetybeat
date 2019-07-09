import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {ViewDocComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/viewDoc/viewDoc.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CreateFolderComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/createFolder/createFolder.component';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @Input() docData: Object;
  @Output() processAction:EventEmitter<any> = new EventEmitter<any>();


  constructor( public dialog: MatDialog,
              public helperService: HelperService,
              public navService: NavigationService) { }

  ngOnInit() {
    // console.log(this.docData)
  }

  /**
   * Delete Document
   * @param id 
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
   * This is to rename the file
   * @param fileInfo 
   */
  renameFile(fileInfo: any) {
    this.helperService.createDialog(CreateFolderComponent, {
      disableClose: true,
      data: {type: false, folderId: fileInfo.id, name: fileInfo.title}
    });
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.processAction.emit(true);
    }, (error) => {
      this.processAction.emit(false);
    });
  }

  /**
   * View Document
   * @param doc 
   */
  viewDoc(doc: any) {
    this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
  }

}
