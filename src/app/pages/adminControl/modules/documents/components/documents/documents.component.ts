import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Documents} from 'src/app/models/navigation/documents.model';
import {CompilerProvider} from 'src/app//shared/compiler/compiler';
import {UploadDocComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/uploadDoc/uploadDoc.component';
import {CreateFolderComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/createFolder/createFolder.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentsData: Documents = <Documents>{};

  constructor(
    public dialog: MatDialog,
    public helperService: HelperService,
    private navService: NavigationService,
    public compiler: CompilerProvider,
  ) {
    this.initialize();
  }

  initialize() {
    this.documentsData.documentExist = false;
    this.documentsData.folderExist = false;
    this.documentsData.panelOpenState = false;
  }

  ngOnInit() {
    this.documentsData.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.documentsData.entityID = res.entityInfo.id;
        this.refreshFiles(true);
        this.refreshFolders(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.documentsData.subscription.unsubscribe();
  }

  /**
   * Get and refresh all folders from DB
   * @params entityID
   */
  getAllFolders(entityID: number) {
    this.documentsData.folderList = [];
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        if (res.data.length === 0) {
          this.documentsData.folderExist = false;
        } else {
          this.documentsData.folderExist = true;
          this.documentsData.folderList = res.data;
        }
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.folderExist = false;
      } else {
        this.documentsData.folderExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_FOLDER_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    });
  }

  /**
   * Get all root docs
   * @params entityId
   */
  getRootDocuments(entityId: number) {
    this.documentsData.rootDocs = [];
    let data = {'entityId': entityId};
    this.navService.getRootDocuments(data).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.documentExist = true;
        this.documentsData.rootDocs = this.compiler.constructDocuments(res);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.documentExist = false;
      } else {
        this.documentsData.documentExist = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
        this.helperService.constants.status.ERROR);
    });
  }

  /**
   * Upload new document at root folder
   */
  uploadDoc() {
    this.helperService.createDialog(UploadDocComponent, {
      disableClose: true, data: {
        folders: this.documentsData.folderList,
        entityID: this.documentsData.entityID,
        modalType: true
      }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.refreshFiles(true);
    });
  }

  /**
   * Create new folder
   */
  createFolder() {
    this.helperService.createDialog(CreateFolderComponent, {disableClose: true, data: {type: true, id: this.documentsData.entityID}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.getAllFolders(this.documentsData.entityID);
    });
  }

  /**
   * Refresh Folders data after renaming or removing
   * @params status
   */
  refreshFolders(status: boolean) {
    if (status) {
      this.getAllFolders(this.documentsData.entityID);
    }
  }

  /**
   * Refresh Files data after renaming or removing
   * @params status
   */
  refreshFiles(status: boolean) {
    if (status) {
      this.getRootDocuments(this.documentsData.entityID);
    }
  }
}
