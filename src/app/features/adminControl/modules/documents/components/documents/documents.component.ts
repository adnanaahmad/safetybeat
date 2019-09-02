import {Component, OnDestroy, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialog} from '@angular/material';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {Documents} from 'src/app/models/navigation/documents.model';
import {UploadDocComponent} from 'src/app/features/adminControl/modules/documents/dialogs/uploadDoc/uploadDoc.component';
import {CreateFolderComponent} from 'src/app/features/adminControl/modules/documents/dialogs/createFolder/createFolder.component';
import {PermissionsModel} from 'src/app/models/adminControl/permissions.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, OnDestroy {
  documentsData: Documents = <Documents>{};
  loadingBar = false;


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
    this.documentsData.folderList = [];
    this.documentsData.rootDocs = [];
  }

  ngOnInit() {
    this.documentsData.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.documentsData.entityID = res.entityInfo.id;
        this.refreshFiles(true);
        this.refreshFolders(true);
      }
    });
    this.navService.entityPermissions.subscribe((data: PermissionsModel) => {
      if (data) {
        this.documentsData.permissions = data;
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
    this.loadingBar = true;
    this.navService.allFolders({entityId: entityID}).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.folderList = res.data.length === 0 ? [] : res.data;
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.folderList = [];
        // this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      } else {
        this.documentsData.folderList = [];
      }
      this.loadingBar = false;
    }, (error) => {
      this.loadingBar = false;
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);

    });
  }

  /**
   * Get all root docs
   * @params entityId
   */
  getRootDocuments(entityId: number) {
    this.loadingBar = true;
    let data = {'entityId': entityId};
    this.navService.getRootDocuments(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.rootDocs = res.data.length === 0 ? [] : this.compiler.constructDocuments(res);
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.rootDocs = [];
        //this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      } else {
        this.documentsData.rootDocs = [];
        // this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
        //   this.helperService.constants.status.ERROR);
      }
      this.loadingBar = false;
    }, (error) => {
      this.loadingBar = false;
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
      if (res !== 'cancel') {
        this.refreshFiles(true);
      }
    });
  }

  /**
   * Create new folder
   */
  createFolder() {
    this.helperService.createDialog(CreateFolderComponent, {
      disableClose: true, data: {
        type: true, id: this.documentsData.entityID,
        folderList: this.documentsData.folderList
      }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res !== 'cancel') {
        this.getAllFolders(this.documentsData.entityID);
      }
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
