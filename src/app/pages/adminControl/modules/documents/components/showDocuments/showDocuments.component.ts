import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {ActivatedRoute} from '@angular/router';
import {Documents} from 'src/app/models/navigation/documents.model';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {Location} from '@angular/common';
import {UploadDocComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/uploadDoc/uploadDoc.component';
// import {CreateFolderComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/createFolder/createFolder.component';
import {ViewDocComponent} from 'src/app/pages/adminControl/modules/documents/dialogs/viewDoc/viewDoc.component';

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

  viewDoc(doc: any) {
    this.helperService.createDialog(ViewDocComponent, {data: doc, disableClose: true});
  }

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
    });
  }

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
