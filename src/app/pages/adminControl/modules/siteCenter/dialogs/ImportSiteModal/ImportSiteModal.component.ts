import {Component, OnInit} from '@angular/core';
import {ImportSite} from 'src/app/models/adminControl/importSite.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';

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
    private adminServices: AdminControlService,
    public dialogRef: MatDialogRef<ImportSiteModalComponent>
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

  onNoClick(): void {
    this.dialogRef.close();
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
    let entityId = this.importSiteModal.entityId.toString();
    console.log(this.importSiteModal.csvFile);
    let formData = new FormData();
    formData.append('file', blob, this.importSiteModal.csvFile.name);
    formData.append('entityId', entityId);

    this.adminServices.importSite(formData).subscribe((res) => {
      this.importSiteModal.importSiteResponse = res;
      if (this.importSiteModal.importSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.importSiteModal.loading = false;
        this.onNoClick();
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
          this.helperService.translated.MESSAGES.SITE_IMPORT_SUCCESS);
      } else if (this.importSiteModal.importSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.importSiteModal.loading = false;
        this.onNoClick();
        this.helperService.appLogger(this.helperService.constants.status.ERROR,
          this.helperService.translated.MESSAGES.SITE_IMPORT_FAILURE);
      }
    });

  }

}
