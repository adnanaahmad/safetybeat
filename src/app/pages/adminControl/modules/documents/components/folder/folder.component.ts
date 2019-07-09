import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Router} from '@angular/router';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';
import {CreateFolderComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/createFolder/createFolder.component';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  @Input() folderData: any;
  @Input() documentsData: any;
  @Output() processAction:EventEmitter<any> = new EventEmitter<any>();


  constructor( public dialog: MatDialog,
              public helperService: HelperService,
              public navService: NavigationService,
              public compiler: CompilerProvider,
              private router: Router) { }

  ngOnInit() {
    // console.log(this.documentsData)
  }

  /**
   * Delete folder
   * @param id 
   */
  deleteFolder(id: number) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_FOLDER}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteFolder(id).subscribe((res) => {
          this.processAction.emit(true);
        });
      } else {
        this.processAction.emit(false);
      }
    });
  }

  /**
   * This is to rename folder
   * @param folderInfo 
   */
  renameFolder(folderInfo: any) {
    this.helperService.createDialog(CreateFolderComponent, {
      disableClose: true,
      data: {type: false, folderId: folderInfo.id, name: folderInfo.name}
    });
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.processAction.emit(true);
    }, (error) => {
      this.processAction.emit(false);
    });
  }

  /**
   * This is to show docs of a particular folder
   * @param folderId 
   */
  showDocs(folderId: number) {
    this.router.navigate(['/home/adminControl/documents/viewDocs', {folderId: JSON.stringify(folderId),
      entityId: JSON.stringify(this.documentsData.entityID)}], {skipLocationChange: false});
  }


}
