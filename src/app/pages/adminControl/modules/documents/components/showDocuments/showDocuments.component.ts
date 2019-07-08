import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {ActivatedRoute} from '@angular/router';
import {Documents} from 'src/app/models/navigation/documents.model';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {Location} from '@angular/common';
import {ViewDocComponent} from 'src/app/pages/navigation/dialogs/viewDoc/viewDoc.component';
import {UploadDocComponent} from 'src/app/pages/navigation/dialogs/uploadDoc/uploadDoc.component';
import {ConfirmationModalComponent} from 'src/app/Dialogs/conformationModal/confirmationModal.component';

@Component({
  selector: 'app-showDocuments',
  templateUrl: './showDocuments.component.html',
  styleUrls: ['./showDocuments.component.scss']
})
export class ShowDocumentsComponent implements OnInit {
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
    this.docsOfFolder(this.documentsData.folderId);
  }

  goBack() {
    this.location.back();
  }
// this function opens dialog to show document
  viewDoc(doc: any) {
    this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
  }
// this function gets documents by a folder ID and displays
  docsOfFolder(folderID: number) {
    this.documentsData.docList = [];
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
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.documentsData.folderDoc = false;
      } else {
        this.documentsData.folderDoc = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    }, (error) => {
          // some code here
    });
  }

  // this function first asks for confirmation and then deletes a document
  deleteDoc(id) {
    this.helperService.createDialog(ConfirmationModalComponent,
      {data: {message: this.helperService.translated.CONFIRMATION.DELETE_DOCUMENT}});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res === this.helperService.appConstants.yes) {
        this.helperService.toggleLoader(true);
        this.navService.deleteDoc(id).subscribe((res) => {
          this.docsOfFolder(this.documentsData.folderId);
        }, (error) => {
          // some code here
        });
      }
    });
  }
// this function opens a dialog to upload file
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
}
