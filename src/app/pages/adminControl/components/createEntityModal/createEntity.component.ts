import { Component, OnInit, NgZone, Input, AfterViewInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { entity, entityData } from 'src/app/models/entity.model';
import { AdminControlService } from '../../services/adminControl.service';
import { MatDialogRef } from '@angular/material';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { NavigationService } from 'src/app/pages/navigation/services/navigation.service';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit,AfterViewInit {
  translated: Translation;
  appConstants: any;
  public title = 'Places';
  public addrKeys: string[];
  public addr: object;
  city: string;
  country: string;
  zipCode: string;
  appIcons: any;
  createEntityForm: FormGroup;
  entityDetails: any;
  entityResponse: any;
  roleId: number;
  entites: any;
  constructor(
    public dialogRef: MatDialogRef<CreateEntityComponent>,
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private navService:NavigationService,
    private compiler: CompilerProvider
  ) {
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;
    this.helperService.appLoggerDev(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.CREATEENTITY);
  }

  ngOnInit() {
    this.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required],
      status : false
    });
  }

  ngAfterViewInit(){
    this.navService.currentRoleId.subscribe((res)=>{
      this.roleId = res;
    });
  }

  setAddress(addrObj) {
    this.city = addrObj.locality;
    this.country = addrObj.country;
    this.zipCode = addrObj.zipCode;
    this.zone.run(() => {
      this.addr = addrObj;
      this.addrKeys = Object.keys(addrObj);
    });
  }

  get formValidation() { return this.createEntityForm.controls; }
  onNoClick(): void {
    this.dialogRef.close();
  }
  entityCreation({ value, valid }: { value: entityData; valid: boolean }): void {
    this.entityDetails = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityData: value,
      active: value.status,
      roleId : this.roleId
    }
    if (!valid) {
      
      this.helperService.appLoggerDev(this.helperService.constants.status.WARNING, valid);
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR);
      return;
    }
    this.helperService.appLoggerDev(this.helperService.constants.status.INFO, valid);
    this.helperService.appLogger(this.helperService.constants.status.INFO, JSON.stringify(value));
    this.adminServices.createEntity(this.entityDetails).subscribe((result) => {
      this.entityResponse = result;
      this.onNoClick();
      if(this.entityResponse.responseDetails.code=='0012'){
        var data = {
          'moduleName': 'Safetybeat'
        }
        this.adminServices.viewEntities(data).subscribe(res=>{
          this.entites = res;
          let entityUserData = this.compiler.constructUserEntityData(this.entites.data);
          this.navService.changeEntites(entityUserData);
        })
        this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.entityResponse.responseDetails.message);
      }
      else if (this.entityResponse.responseDetails.code == '0013') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.entityResponse.responseDetails.message)
      }
      else if (this.entityResponse.responseDetails.code == '0017') {
        this.helperService.appLogger(this.helperService.constants.status.ERROR, this.entityResponse.responseDetails.message)
      }
    }, (error => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.ENTITYNOTCREATED);
      this.onNoClick()
      this.helperService.logoutError(error.status)
    })
    );
  }


}
