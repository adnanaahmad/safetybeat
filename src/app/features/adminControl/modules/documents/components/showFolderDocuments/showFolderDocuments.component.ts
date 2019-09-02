import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {ActivatedRoute} from '@angular/router';
import {Documents} from 'src/app/models/navigation/documents.model';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {Location} from '@angular/common';
import {UploadDocComponent} from 'src/app/features/adminControl/modules/documents/dialogs/uploadDoc/uploadDoc.component';

@Component({
  selector: 'app-showDocuments',
  templateUrl: './showFolderDocuments.component.html',
  styleUrls: ['./showFolderDocuments.component.scss']
})
export class ShowFolderDocumentsComponent implements OnInit {
  documentsData: Documents = <Documents>{};

  constructor(public helperService: HelperService,
              public compiler: CompilerProvider,
              private route: ActivatedRoute,
              private navService: NavigationService,
              private location: Location) {
    this.route.params.subscribe((data) => {
      this.documentsData.folderId = data.folderId;
      this.documentsData.entityID = data.entityId;
    });
  }

  ngOnInit() {
    // this.documentsData.docList = [];
    this.docsOfFolder(this.documentsData.folderId);
  }

  goBack() {
    this.location.back();
  }

  /**
   * Get folder docs and refresh variables
   * @params folderID
   */
  docsOfFolder(folderID: number) {
    // this.documentsData.docList = [];
    this.documentsData.panelOpenState = true;
    let data = {
      'folderId': folderID
    };
    this.navService.getDocuments(data).subscribe((res) => {
      if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.documentsData.folderDoc = true;
        this.documentsData.docList = this.compiler.constructDocuments(res);
        this.helperService.iterations(this.documentsData.docList, function (obj) {
          obj.sourceUrl = 'https//docs.google.com/gview?url=' + obj.file + '&embedded=true';
        });
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4] ||
        res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.documentsData.docList = [];
        this.documentsData.folderDoc = false;
      } else {
        this.documentsData.docList = [];
        this.documentsData.folderDoc = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * Upload new doc within a folder
   */
  uploadDoc() {
    this.helperService.createDialog(UploadDocComponent, {
      disableClose: true, data: {
        folderId: this.documentsData.folderId,
        entityID: this.documentsData.entityID,
        modalType: false
      }
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      this.docsOfFolder(this.documentsData.folderId);
    });
  }

  /**
   * Refresh Files data after renaming or removing
   * @params status
   */
  refreshFiles(status: boolean){
    if(status) {
      this.docsOfFolder(this.documentsData.folderId);
    }
  }
}
