import {Component, OnInit} from '@angular/core';
import {HelperService} from '../../../../services/common/helperService/helper.service';
import {SettingsService} from '../../services/settings.service';
import {Package} from '../../../../models/Settings/package.model';
import {UpdatepackgaeComponent} from '../../../loginRegistration/dialogs/updatepackgae/updatepackgae.component';

@Component({
  selector: 'app-package-settings',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
  package: Package = <Package>{};

  constructor(public helperService: HelperService,
              public settingService: SettingsService) {
  }

  ngOnInit() {
    this.package.packagePrice = 10;
    this.getPackage();
  }

  getPackage() {
    this.settingService.getPackage().subscribe((res) => {
      this.package.name = res;
      this.package.currentPackage = this.package.name;
    });
  }

  updatePrice(value) {
    this.package.packagePrice = value;
  }

  updateSelection(value) {
    this.package.name = value;
  }

  proceedToPayment() {
    if (this.package.name === 'Unlimited') {
      this.package.packagePrice = 500;
    }
    let data = {
      package: this.package.name,
      price: this.package.packagePrice
    };
    this.helperService.createDialog(UpdatepackgaeComponent, {disableClose: true, data: data});
    this.helperService.dialogRef.afterClosed().subscribe(res => {
      if (res && res === this.helperService.appConstants.yes) {
        this.helperService.navigateTo([this.helperService.appConstants.paths.home]);
      }
    });
  }
}


