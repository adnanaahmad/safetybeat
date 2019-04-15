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
    let reader = new FileReader();
    this.importSiteModal.csvFile = <File>event.target.files[0];
    console.log(reader.readAsText(this.importSiteModal.csvFile));
  }

  importSite({value}: { value: any }) {
    let blob = new Blob([this.importSiteModal.csvFile], {type: 'application/csv'});
    console.log(this.importSiteModal.csvFile);
    let formData = new FormData();
    formData.append('file', blob, this.importSiteModal.csvFile.name)
    formData.append('entityId', this.importSiteModal.entityId.toString(), this.importSiteModal.entityId.toString())

    this.adminServices.importSite(formData).subscribe((res) => {
      console.log('i am called');
    });
    console.log('i am done');

  }

}
