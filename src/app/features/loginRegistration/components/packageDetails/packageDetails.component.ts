import {Component, OnInit} from '@angular/core';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {Packages} from 'src/app/models/loginRegistration/packageDetails.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CoreService} from 'src/app/services/core/authorization/core.service';
import {UpdatepackgaeComponent} from 'src/app/features/loginRegistration/dialogs/updatepackgae/updatepackgae.component';

@Component({
  selector: 'app-org-registration-modal',
  templateUrl: './packageDetails.component.html',
  styleUrls: ['./packageDetails.component.scss']
})
export class PackageDetailsComponent implements OnInit {

  packages: Packages[] = [];
  logoutDisable: boolean = false;
  logoutResponse;
  loading: boolean = false;


  constructor(private loginRegisterService: LoginRegistrationService,
              private navService: NavigationService,
              private coreService: CoreService,
              public helperService: HelperService) {
    this.navService.getPackageInfo().subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.navService.updatePackageInfo(res.data[0]);
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });

  }

  ngOnInit() {
    this.loading = true;
    this.loginRegisterService.getPackagesData().subscribe((res) => {
      this.packages = CompilerProvider.constructPackageDetail(res);
      this.packages = this.helperService.sortBy(this.packages, function (pkg) {
        return pkg.package.cost;
      });
      this.packages.splice(0, 1);
      this.loading = false;
    }, (error) => {
      this.loading = false;
    });
  }

  logoutUser() {
    this.navService.logoutUser().subscribe((res) => {
      this.logoutDisable = true;
      this.logoutResponse = res;
      if (this.logoutResponse.detail === this.helperService.translated.AUTH.LOGOUTSUCCESSION) {
        this.coreService.logoutUser();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG,
        this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG);
    });
  }

  updatePackage(packages) {
    this.helperService.createDialog(UpdatepackgaeComponent, {disableClose: true, data: packages});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res && res === this.helperService.appConstants.yes) {
        this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
      }
    });
  }
}
