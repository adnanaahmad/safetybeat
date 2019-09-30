import {Component, OnInit, NgZone, AfterViewInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {entityData} from 'src/app/models/entity.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {MatDialogRef} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CreateEntity} from 'src/app/models/adminControl/createEntity.model';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit, AfterViewInit, OnDestroy {
  createEntity: CreateEntity = <CreateEntity>{};
  @ViewChild('gmap') gMapElement: ElementRef;
  private role: string;

  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private navService: NavigationService,
    public dialogRef: MatDialogRef<CreateEntityComponent>
  ) {
  }

  ngOnInit() {
    this.createEntity.loading = false;
    this.helperService.createMap(this.gMapElement);
    this.createEntity.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required]
    });
    this.navService.currentRole.subscribe((data) => {
      if (data) {
        this.role = data;
      }
    });
  }

  /**
   * this function is used to get the role of the user in the current entity.
   */
  ngAfterViewInit() {
    this.createEntity.subscription = this.navService.currentRoleId.subscribe((res) => {
      this.createEntity.roleId = res;
    });
  }

  ngOnDestroy(): void {
    this.onNoClick();
    if (this.createEntity.subscription !== null && this.createEntity.subscription !== undefined) {
      this.createEntity.subscription.unsubscribe();
    }
  }

  /**
   * this function is used for validation of createEntity form and shows errors if the
   * form field is invalid
   */
  get formValidation() {
    return this.createEntity.createEntityForm.controls;
  }

  /**
   * this function is used to close the dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used for creating entities and get the values for adding entites from
   * createEntity form and if the values are valid then proceeds otherwise throws error in the
   * snackbar
   * @params value
   * @params valid
   */
  entityCreation({value, valid}: { value: entityData; valid: boolean }): void {
    value.headOffice = this.helperService.address;
    this.createEntity.entityDetails = {
      moduleName: this.helperService.translated.BUTTONS.SAFETYBEAT,
      name: value.name,
      headOffice: value.headOffice,
      status: value.status,
      role: this.role,
      active: false
    };
    if (!valid) {
      this.helperService.createSnack(
        this.helperService.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR, this.helperService.constants.status.ERROR);
      return;
    }
    this.createEntity.loading = true;
    this.adminServices.createEntity(this.createEntity.entityDetails).subscribe((result) => {
        if (result && result.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.createEntity.loading = false;
          this.onNoClick();
        } else if (result && result.responseDetails.code === this.helperService.appConstants.codeValidations[3] ||
          this.helperService.appConstants.codeValidations[4]) {
          this.createEntity.loading = false;
          this.onNoClick();
          this.helperService.createSnack(result.responseDetails.message, this.helperService.constants.status.ERROR);
        } else if (result && result.responseDetails.code === this.helperService.appConstants.codeValidations[1]) {
          this.createEntity.loading = false;
          this.onNoClick();
          this.helperService.createSnack(result.responseDetails.message, this.helperService.constants.status.ERROR);
        } else {
          this.createEntity.loading = false;
          this.onNoClick();
          this.helperService.createSnack(result.responseDetails.message, this.helperService.constants.status.ERROR);
        }
      }, ((error) => {
        this.createEntity.loading = false;
        this.onNoClick();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      })
    );
  }


}
