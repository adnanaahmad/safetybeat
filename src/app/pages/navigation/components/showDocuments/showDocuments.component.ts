import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {ActivatedRoute} from '@angular/router';
import {Documents} from '../../../../models/navigation/documents.model';
import {NavigationService} from '../../services/navigation.service';
import {CompilerProvider} from '../../../../shared/compiler/compiler';

@Component({
  selector: 'app-show-documents',
  templateUrl: './showDocuments.component.html',
  styleUrls: ['./showDocuments.component.scss']
})
export class ShowDocumentsComponent implements OnInit {
  documentsData: Documents = <Documents>{};
  folderId: number;

  constructor(public helperService: HelperService,
              private route: ActivatedRoute,
              private navService: NavigationService,
              public compiler: CompilerProvider) {
    this.route.params.subscribe((data) => {
      this.folderId = data.data
    });
  }

  ngOnInit() {
    this.docsOfFolder(this.folderId);
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

}
