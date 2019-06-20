import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { ActivatedRoute } from '@angular/router';
import { Documents } from '../../../../models/navigation/documents.model';
import { NavigationService } from '../../services/navigation.service';
import { CompilerProvider } from '../../../../shared/compiler/compiler';
import { Location } from '@angular/common'
import { UploadFolderDocComponent } from '../../dialogs/uploadFolderDoc/uploadFolderDoc.component';
import { ViewDocComponent } from '../../dialogs/viewDoc/viewDoc.component';
@Component({
  selector: 'app-showDocuments',
  templateUrl: './showDocuments.component.html',
  styleUrls: ['./showDocuments.component.scss']
})
export class ShowDocumentsComponent implements OnInit {
  documentsData: Documents = <Documents>{};
  folderId: number;

  constructor(public helperService: HelperService,
    private route: ActivatedRoute,
    private navService: NavigationService,
    public compiler: CompilerProvider,
    private location: Location) {
    this.route.params.subscribe((data) => {
      this.folderId = data.data
    });
  }

  ngOnInit() {
    this.docsOfFolder(this.folderId);
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
        this.documentsData.docList = this.compiler.constructAllDocumentsData(res);
        this.helperService.iterations(this.documentsData.docList,function(obj){
          // https//docs.google.com/gview?url=" + obj.file + "&embedded=true
          obj.sourceUrl =obj.file 
          console.log(obj)
        })
        this.navService.updateDocument(this.documentsData.docList);
      } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[3]) {
        this.documentsData.folderDoc = false;
      } else {
        this.documentsData.folderDoc = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.GET_DOCUMENT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    });
  }

  uploadDoc() {
    this.helperService.createDialog(UploadFolderDocComponent, {
      disableClose: true, 
    });
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      debugger
    });
  }
}
