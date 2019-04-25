import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {Packages} from 'src/app/models/loginRegistration/packageDetails.model';
import {CompilerProvider} from '../../../../shared/compiler/compiler';

@Component({
  selector: 'app-org-registration-modal',
  templateUrl: './packageDetails.component.html',
  styleUrls: ['./packageDetails.component.scss']
})
export class PackageDetailsComponent implements OnInit, OnDestroy {

  packages: Packages[] = [];

  constructor(private loginRegisterService: LoginRegistrationService,
              public helperService: HelperService) {
  }

  ngOnInit() {
    this.loginRegisterService.getPackagesData().subscribe((res) => {
      this.packages = CompilerProvider.constructPackageDetail(res);
      console.log(CompilerProvider.constructPackageDetail(res));
      this.packages = this.helperService.sortBy(this.packages, function (pkg) {
        return pkg.package.cost;
      });
      this.packages.splice(0, 1);
    });
  }

  ngOnDestroy() {
  }
}
