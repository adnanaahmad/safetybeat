import { Component, OnInit } from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {NavigationService} from '../../services/navigation.service';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './uploadDoc.component.html',
  styleUrls: ['./uploadDoc.component.scss']
})
export class UploadDocComponent implements OnInit {
  folderList: any[];
  constructor(public helperService: HelperService,
              private navService: NavigationService) { }

  ngOnInit() {

    let entityId = JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
      this.helperService.appConstants.key));
    this.navService.allFolders({entityId: entityId}).subscribe((res) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ORG_DETAILS, this.helperService.constants.status.SUCCESS);
      this.folderList = res.data;
    });
  }

}
