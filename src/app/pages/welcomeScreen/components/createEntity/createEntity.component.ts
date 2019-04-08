import {Component, OnInit, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ConstantService} from 'src/app/shared/constant/constant.service';
import {Translation} from 'src/app/models/translate.model';
import {entityData} from '../../../../models/entity.model';
import {AdminControlService} from '../../../adminControl/services/adminControl.service';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {Router} from '@angular/router';
import {WelcomeScreenService} from '../../services/welcome-screen.service';

@Component({
  selector: 'app-createEntity',
  templateUrl: './createEntity.component.html',
  styleUrls: ['./createEntity.component.scss']
})
export class CreateEntityComponent implements OnInit {
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
  entites: any;
  roleId: any;
  entitiesList: any;
  entityUserData: any;
  loading: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private zone: NgZone,
    private adminServices: AdminControlService,
    public helperService: HelperService,
    private compiler: CompilerProvider,
    private navService: NavigationService,
    private router: Router,
    private welcomeService: WelcomeScreenService
  ) {
    this.translated = this.helperService.translation;
    this.helperService.appLoggerDev(
      this.translated.LOGGER.STATUS.SUCCESS,
      this.translated.LOGGER.MESSAGES.CREATEENTITY
    );
    this.appConstants = ConstantService.appConstant;
  }

  ngOnInit() {
    this.createEntityForm = this.formBuilder.group({
      name: ['', Validators.required],
      headOffice: ['', Validators.required],
      status: ['']
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

  get formValidation() {
    return this.createEntityForm.controls;
  }

  entityCreation({
                   value,
                   valid
                 }: {
    value: entityData;
    valid: boolean;
  }): void {
    this.loading = true;
    this.entityDetails = {
      moduleName: this.translated.BUTTONS.SAFETYBEAT,
      entityData: value,
      active: value.status,
      roleId: 2
    };
    var data = {
      moduleName: 'Safetybeat'
    };

    if (!valid) {
      this.helperService.appLoggerDev(
        this.helperService.constants.status.WARNING,
        valid
      );
      this.helperService.appLogger(
        this.helperService.constants.status.ERROR,
        this.translated.LOGGER.MESSAGES.CREATEENTITY_ERROR
      );
      this.loading = false;
      return;
    }
    this.helperService.appLoggerDev(
      this.helperService.constants.status.INFO,
      valid
    );
    this.helperService.appLogger(
      this.helperService.constants.status.INFO,
      JSON.stringify(value)
    );
    this.adminServices.createEntity(this.entityDetails).subscribe(
      result => {
        this.entityResponse = result;
        if (this.entityResponse.responseDetails.code == '0012') {
          this.adminServices.viewEntities(data).subscribe(res => {
            this.entitiesList = res;
            this.entityUserData = this.compiler.constructUserEntityData(this.entitiesList.data);
            this.navService.changeEntites(this.entityUserData);
            this.loading = false;
            this.helperService.appLogger(
              this.helperService.constants.status.SUCCESS,
              this.entityResponse.responseDetails.message
            );
            this.router.navigate(['/home']);
          });
        } else if (this.entityResponse.responseDetails.code == '0013') {
          this.loading = false;
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.entityResponse.responseDetails.message
          );
        } else if (this.entityResponse.responseDetails.code == '0017') {
          this.loading = false;
          this.helperService.appLogger(
            this.helperService.constants.status.ERROR,
            this.entityResponse.responseDetails.message
          );
        }
      },
      error => {
        this.helperService.appLogger(
          this.helperService.constants.status.ERROR,
          this.translated.LOGGER.MESSAGES.ENTITYNOTCREATED
        );
        this.loading = false;
      }
    );
  }
}
