import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ElementOptions, Elements, ElementsOptions, StripeCardComponent, StripeService} from 'ngx-stripe';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {EntityUserData} from 'src/app/models/userEntityData.model';

@Component({
  selector: 'app-updatepackgae',
  templateUrl: './updatepackgae.component.html',
  styleUrls: ['./updatepackgae.component.scss']
})
export class UpdatepackgaeComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  elements: Elements;
  loading: boolean = false;
  stripeForm: FormGroup;
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };
  entityUserData: EntityUserData;
  selectedEntity: any;

  constructor(
    public helperService: HelperService,
    private stripeService: StripeService,
    private formBuilder: FormBuilder,
    private loginService: LoginRegistrationService,
    private navService: NavigationService,
    private adminServices: AdminControlService,
    private compiler: CompilerProvider,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<UpdatepackgaeComponent>
  ) {
  }

  ngOnInit() {
    this.stripeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get formValidation() {
    return this.stripeForm.controls;
  }

  buy(stripeForm: FormGroup) {
    this.loading = true;
    this.stripeService.createToken(this.card.getCard(), stripeForm.value.email).subscribe((res) => {
      if (res.token) {
        let data = {
          stripeToken: res.token.id,
          amount: parseInt(this.data.cost, 10),
          email: stripeForm.value.email
        };
        this.loginService.updateAmount(data).subscribe((res) => {
          if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
            this.updatePackage();
          } else {
            this.dialogRef.close('NO');
            this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
            this.loading = false;
          }
        }, (error) => {
          this.dialogRef.close('NO');
          this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
          this.loading = false;
        });

      }

    }, (error) => {
      this.dialogRef.close('NO');
      this.helperService.createSnack(error.message, this.helperService.constants.status.ERROR);
    })
  }

  updatePackage() {
    let data = {
      'packageId': this.data.id
    };
    this.loginService.updatePackage(data).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
          this.navService.updatePackageInfo(res.data);
          this.loading = false;
          this.dialogRef.close('YES');
        } else {
          this.loading = false;
          this.dialogRef.close('NO');
        }
      }, (error) => {
        this.dialogRef.close('NO');
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
        this.loading = false;
      }
    );
  }

  // getAllEntities() {
  //   let moduleData = {
  //     moduleName: 'Safetybeat'
  //   };
  //
  //   this.adminServices
  //     .viewEntities(moduleData)
  //     .subscribe(entitesData => {
  //       if (entitesData && entitesData.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
  //         this.entityUserData = this.compiler.constructUserEntityData(entitesData.data.allEntities);
  //         this.navService.changeEntites(this.entityUserData);
  //         let index = this.helperService.findIndex(this.entityUserData.entities, function (entity) {
  //           return entity.active === true;
  //         });
  //         this.selectedEntity =
  //           index !== -1 ? this.entityUserData.entities[index] : this.entityUserData.entities[0];
  //         localStorage.setItem(this.helperService.constants.localStorageKeys.entityId,
  //           this.helperService.encrypt(JSON.stringify(this.selectedEntity.entityInfo.id), this.helperService.appConstants.key));
  //         this.navService.changeSelectedEntity(this.selectedEntity);
  //         this.switchSideMenu(this.selectedEntity);
  //         this.loading = false;
  //       } else {
  //         this.loading = false;
  //         this.dialogRef.close('NO');
  //         this.helperService.createSnack(entitesData.responseDetails.message, this.helperService.constants.status.ERROR);
  //       }
  //     }, (error) => {
  //       this.loading = false;
  //       this.dialogRef.close('NO');
  //       this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
  //     });
  // }
  //
  // switchSideMenu(data: any) {
  //   if (data === undefined) {
  //     this.helperService.navigateTo(['/welcomeScreen/entityCreation']);
  //   } else {
  //     this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
  //   }
// }


}
