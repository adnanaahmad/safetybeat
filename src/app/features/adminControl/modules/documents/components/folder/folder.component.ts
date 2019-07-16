import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {ConfirmationModalComponent} from 'src/app/dialogs/conformationModal/confirmationModal.component';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {Router} from '@angular/router';
import {CreateFolderComponent} from 'src/app/features/adminControl/modules/documents/dialogs/createFolder/createFolder.component';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {

  @Input() folderData: any;
  @Input() documentsData: any;
  @Input() folderList: any[];
  folders: Array<string>;
  loader: boolean = false;
  @Output() processAction: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialog: MatDialog,
              public helperService: HelperService,
              public navService: NavigationService,
              public compiler: CompilerProvider,
              private router: Router) {
  }

  ngOnInit() {
    let id = this.folderData.id;
    this.folders = this.folderList.filter(folder => {
      return folder.id !== id;
    });
  }

  /**
   * Delete folder
   * @params id
   */
  deleteFolder(id: number) {
    this.loader = true;
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_FOLDER}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteFolder(id).subscribe((res) => {
          this.processAction.emit(true);
          this.loader = false;
        });
      } else {
        this.loader = false;
        this.processAction.emit(false);
      }
    });
  }

  /**
   * This is to rename folder
   * @params folderInfo
   */
  renameFolder(folderInfo: any) {
    this.helperService.createDialog(CreateFolderComponent, {
      disableClose: true,
      data: {type: false, folderId: folderInfo.id, name: folderInfo.name, folderList: this.folders}
    });
    this.helperService.dialogRef.afterClosed().subscribe((res) => {
      this.processAction.emit(true);
    });
  }

  /**
   * This is to show docs of a particular folder
   * @params folderId
   */
  showDocs(folderId: number) {
    this.router.navigate(['/home/adminControl/documents/viewDocs', {
      folderId: JSON.stringify(folderId),
      entityId: JSON.stringify(this.documentsData.entityID)
    }], {skipLocationChange: false});
  }


}
