import {Component, OnInit} from '@angular/core';
import {ImportSite} from '../../../../../../models/adminControl/importSite.model';
import {MatDialogRef} from '@angular/material';
import {HelperService} from '../../../../../../shared/helperService/helper.service';

@Component({
  selector: 'app-ImportSiteModal',
  templateUrl: './ImportSiteModal.component.html',
  styleUrls: ['./ImportSiteModal.component.scss']
})
export class ImportSiteModalComponent implements OnInit {

  importSiteModal: ImportSite = <ImportSite>{};

  constructor(
    public helperService: HelperService,
    public dialogRef: MatDialogRef<ImportSiteModalComponent>,
  ) {
    this.importSiteModal.translated = this.helperService.translated;
  }

  ngOnInit() {
  }

}
