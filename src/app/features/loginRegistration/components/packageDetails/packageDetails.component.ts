import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoginRegistrationService} from 'src/app/features/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {Packages} from 'src/app/models/loginRegistration/packageDetails.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {CoreService} from 'src/app/services/core/authorization/core.service';

@Component({
  selector: 'app-org-registration-modal',
  templateUrl: './packageDetails.component.html',
  styleUrls: ['./packageDetails.component.scss']
})
export class PackageDetailsComponent implements OnInit, OnDestroy {

  packages: Packages[] = [];
  logoutDisable: boolean = false;
  logoutResponse;

  constructor(private loginRegisterService: LoginRegistrationService,
              private navService: NavigationService,
              private coreService: CoreService,
              private loginService: LoginRegistrationService,
              public helperService: HelperService) {
  }

  ngOnInit() {
    this.loginRegisterService.getPackagesData().subscribe((res) => {
      this.packages = CompilerProvider.constructPackageDetail(res);
      this.packages = this.helperService.sortBy(this.packages, function (pkg) {
        return pkg.package.cost;
      });
      this.packages.splice(0, 1);
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

  ngOnDestroy() {
  }

  updatePackage(packageId) {
    let data = {
      'packageId': packageId
    };
    this.loginService.updatePackage(data).subscribe((res) => {
        if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }
    );
  }
}
