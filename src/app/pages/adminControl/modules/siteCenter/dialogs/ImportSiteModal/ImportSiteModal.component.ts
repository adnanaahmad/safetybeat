import {Component, OnInit} from '@angular/core';
import {ImportSite} from 'src/app/models/adminControl/importSite.model';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';

@Component({
  selector: 'app-ImportSiteModal',
  templateUrl: './ImportSiteModal.component.html',
  styleUrls: ['./ImportSiteModal.component.scss']
})
export class ImportSiteModalComponent implements OnInit {

  importSiteModal: ImportSite = <ImportSite>{};
  private fileName: string;

  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    private navService: NavigationService,
    private adminServices: AdminControlService,
    public dialogRef: MatDialogRef<ImportSiteModalComponent>,
    public compiler: CompilerProvider,
  ) {
    this.initialize();
    this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        this.importSiteModal.entityData = res;
        this.importSiteModal.entityId = this.importSiteModal.entityData.entityInfo.id;
      }
    });
  }

  /**
   * this function is called on the initialization of the component and this function is used to create importSiteForm input
   * fields and also attach the validations with this form.
   */

  ngOnInit() {
    this.importSiteModal.importSiteForm = this.formBuilder.group({
      importSite: ['', Validators.required]
    });
  }

  /**
   * this function is used to close the modal dialog on clicking on the cancel button.
   */

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used to give the initial values to the global variables that we have made in the models.
   */

  initialize() {
    this.importSiteModal.csvFile = null;
  }

  /**
   * this function is used to read the csv file on selection from the pc storage.
   * @params event
   */

  onFileSelected(event) {
    this.importSiteModal.csvFile = <File>event.target.files[0];
    this.fileName = event.target.files[0].name;
  }

  /**
   * this function is used to importing site and send that file data in the api and get responses from the api call
   * @params value
   */

  importSite({value}: { value: any }) {
    let blob = new Blob([this.importSiteModal.csvFile], {type: 'application/csv'});
    let entityId = this.importSiteModal.entityId.toString();
    let formData = new FormData();
    formData.append('file', blob, this.importSiteModal.csvFile.name);
    formData.append('entityId', entityId);
    this.importSiteModal.loading = true;
    this.adminServices.importSite(formData).subscribe((res) => {
        this.importSiteModal.importSiteResponse = res;
        if (this.importSiteModal.importSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.importSiteModal.loading = false;
          this.onNoClick();
          this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
            this.helperService.translated.MESSAGES.SITE_IMPORT_SUCCESS);
        } else if (this.importSiteModal.importSiteResponse.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.importSiteModal.loading = false;
          this.helperService.appLogger(this.helperService.constants.status.ERROR,
            this.helperService.translated.MESSAGES.SITE_IMPORT_FAILURE);
        }
      }
    );

  }
}
