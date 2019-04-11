import {Component, OnInit} from '@angular/core';
import {ImportSite} from '../../../../models/adminControl/importSite.model';
import {MatDialogRef} from '@angular/material';
import {HelperService} from '../../../../shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from '../../../navigation/services/navigation.service';
import {AdminControlService} from '../../services/adminControl.service';

@Component({
  selector: 'app-ImportSiteModal',
  templateUrl: './ImportSiteModal.component.html',
  styleUrls: ['./ImportSiteModal.component.scss']
})
export class ImportSiteModalComponent implements OnInit {

  importSiteModal: ImportSite = <ImportSite>{};

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    private adminServices: AdminControlService
  ) {
    this.initialize();
    this.navService.selectedEntityData.subscribe((res) => {
      this.importSiteModal.entityData = res;
      this.importSiteModal.entityId = this.importSiteModal.entityData.entityInfo.id;
    });
  }

  ngOnInit() {
    this.importSiteModal.importSiteForm = this.formBuilder.group({
      importSite: ['', Validators.required]
    });
  }

  initialize() {
    this.importSiteModal.csvFile = null;
  }

  onFileSelected(event) {
    this.importSiteModal.csvFile = event.target.files[0];
  }

  importSite({value}: { value: any }) {
    let data = {
      'entityId': this.importSiteModal.entityId,
      'csvFile': this.importSiteModal.csvFile
    };

    this.adminServices.importSite(data).subscribe((res) => {
        console.log('i am called');
    });
    console.log('i am done');

  }

}
