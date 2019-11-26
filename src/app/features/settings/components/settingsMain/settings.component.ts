import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingService} from 'src/app/services/common/settings/setting.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialogRef} from '@angular/material';
import {NavigationService} from '../../../navigation/services/navigation.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
    public dialogRef: MatDialogRef<SettingsComponent>;
    ownerView: boolean = false;
    themeSelected: any;
    settingFeatures = {
        'organization': true,
        'entity': false,
        'theme': false,
        'allUsers': false,
        'package': false
    };
    private subscription: Subscription;

    constructor(
        public settings: SettingService,
        public overlay: OverlayContainer,
        public helperService: HelperService,
        private navService: NavigationService
    ) {
        this.subscription = this.navService.currentRole.subscribe((res) => {
            if (res && res === 'Owner') {
                this.ownerView = true;
            } else if (res && res !== 'Owner') {
                this.settingFeatures.organization = false;
                this.settingFeatures.theme = true;
            }
        });
    }

    ngOnInit() {
        this.settings.getActiveTheme().subscribe(val => {
            this.themeSelected = val;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    changed() {
        this.settings.setActiveTheme(this.themeSelected);
        let self = this;
        this.helperService.iterations(this.overlay.getContainerElement().classList, function (value, index) {
            if (index !== 0) {
                self.overlay.getContainerElement().classList.remove(value);
            }
        });
        this.overlay.getContainerElement().classList.add(this.themeSelected);
    }

    changeSetting(settings: any) {
        let self = this;
        this.helperService.iterations(this.settingFeatures, function (value, key) {
            self.settingFeatures[key] = key === settings;
        });
    }
}

