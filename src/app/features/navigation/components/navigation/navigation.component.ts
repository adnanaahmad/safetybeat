import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {CoreService} from 'src/app/services/core/authorization/core.service';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavigationModel} from 'src/app/models/navigation/navigation.model';
import {PackageInfo} from 'src/app/models/user.model';
import {GeneralComponent} from 'src/app/features/settings/components/general/general.component';
import {SecurityComponent} from 'src/app/features/settings/components/security/security.component';
import {ProfileModel} from 'src/app/models/profile/profile.model';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class NavigationComponent implements OnInit, OnDestroy {
    profileModel: ProfileModel = <ProfileModel>{};
    @Output() entitySelected = new EventEmitter();
    moduleData = {
        moduleName: 'Safetybeat'
    };
    navModel: NavigationModel = <NavigationModel>{};
    isOwner: boolean = false;
    packageInfo: PackageInfo;
    matcher: MediaQueryList;
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    constructor(
        public core: CoreService,
        public adminServices: AdminControlService,
        public compiler: CompilerProvider,
        private navService: NavigationService,
        public helperService: HelperService,
        private profile: ProfileService,
        public breakpointObserver: BreakpointObserver,
        public mediaMatcher: MediaMatcher
    ) {
        this.initialize();
        this.helperService.appLoggerDev(
            this.helperService.constants.status.SUCCESS,
            this.navModel.translated.LOGGER.MESSAGES.NAVIGATION_COMPONENT
        );
        this.getSelectedEntity();

    }

    ngOnInit() {
        this.matcher = this.mediaMatcher.matchMedia('(min-width: 500px)');
        this.getProfileData();
    }


    /**
     * Get Profile Data of User
     */
    getProfileData() {
        this.profileModel.subscription = this.navService.currentUserData.subscribe((res) => {
            if (res !== 1) {
                this.profileModel.profileData = res;
                this.profileModel.username = this.profileModel.profileData.username;
                this.profileModel.email = this.profileModel.profileData.email;
                this.profileModel.profileImage = this.profileModel.profileData.profileImage;
            } else {
                this.getCurrentUser();
            }
        });
    }

    /**
     * this function is used for initializing the initial values of the global variables declared in the model.
     */
    initialize() {
        this.navModel.translated = this.helperService.translated;
        this.navModel.navLinks = null;
        this.navModel.defaultList = [];
        this.navModel.empty = true;
        this.navModel.appIcons = this.helperService.constants.appIcons;
        this.navModel.logoutDisable = false;
        this.packageInfo = {
            days: 0,
            expired: false,
            package: 'None',
            module: this.helperService.appConstants.moduleName
        };
    }

    /**
     * this function is used for getting the selectedEntity and its data and if the user
     * has not activated any entity then this function returns the first entity as selected from the entities list.
     */

    getSelectedEntity() {
        this.navModel.subscription = this.navService.data.subscribe((res) => {
            if (res !== 1) {
                this.navModel.allEntitiesData = res;
                this.navModel.entityUserData = this.navModel.allEntitiesData.entities;
                this.navModel.showEntitySwitcher = this.navModel.allEntitiesData.entities.length > 1;
                this.navModel.empty = false;
                let index = this.helperService.findIndex(this.navModel.entityUserData, function (entity) {
                    return entity.active === true;
                });
                this.navModel.selectedEntity =
                    index !== -1 ? this.navModel.entityUserData[index] : this.navModel.entityUserData[0];
                this.switchSideMenu(this.navModel.selectedEntity);
                this.navService.changePermissions(this.navModel.selectedEntity.permissions)
                this.navService.changeRole(this.navModel.selectedEntity.role)
            } else {
                this.adminServices
                    .viewEntities(this.moduleData)
                    .subscribe(entitesData => {
                        this.navModel.allEntitiesData = entitesData;
                        this.navModel.entityUserData = this.compiler.constructUserEntityData(
                            this.navModel.allEntitiesData.data
                        );
                        this.navService.changeEntites(this.navModel.entityUserData);
                    });
            }
        });
        this.navModel.subscription = this.navService.packageData.subscribe(
            (packageDataResult) => {
                if (packageDataResult !== 1) {
                    this.packageInfo = packageDataResult;
                } else {
                    this.navService.getPackageInfo().subscribe(res => {
                        this.packageInfo = res.data[0];
                        localStorage.setItem(this.helperService.constants.localStorageKeys.packageInfo, this.helperService.encrypt
                        (JSON.stringify(this.packageInfo), this.helperService.appConstants.key).toString()); // Store package data in local storage
                    }, error => {
                        this.packageInfo = JSON.parse(this.helperService.decrypt(localStorage.getItem
                        (this.helperService.constants.localStorageKeys.packageInfo), this.helperService.appConstants.key));
                    });
                }
            });
    }

    /**
     * this function is used for showing the loader on the page if the data is changed then it shows the loader
     * until this doesn't get the api response.
     */

    /**
     * this function is used for hiding the debugging messages on the destroying of this component.
     */

    ngOnDestroy() {
        this.helperService.hideLoggers();
        this.profileModel.subscription.unsubscribe();
        this.navModel.subscription.unsubscribe();
    }

    getCurrentUser() {
        this.profile.getUser().subscribe((res) => {
            this.profileModel.dataRecieved = res;
            let userData = this.compiler.constructProfileData(this.profileModel.dataRecieved.data.user);
            this.navService.updateCurrentUser(userData);
        });
    }

    /**
     * this function is used for switching the side menu when the selected entity is changed
     * and when the selected entity is changed then selected entity and role of the user is changed using
     * behavior subjects and also changes in the components where these observables are subscribed.
     * @params data
     */
    switchSideMenu(data: any) {
        if (data === undefined) {
            this.helperService.navigateTo(['/welcomeScreen/entityCreation']);
        } else {
            this.navModel.selectedEntity = data;
            localStorage.setItem(this.helperService.constants.localStorageKeys.entityId,
                this.helperService.encrypt(JSON.stringify(this.navModel.selectedEntity.entityInfo.id), this.helperService.appConstants.key));
            this.navService.changeSelectedEntity(this.navModel.selectedEntity);
            this.navModel.navLinks = this.compiler.switchSideMenuDefault(data);
        }

    }

    /**
     * this function is used for logging out the user from dashboard and expires the token and also
     * removed the token from the table.
     */

    logoutUser() {
        this.navService.logoutUser().subscribe((res) => {
            this.navModel.logoutDisable = true;
            this.navModel.logoutResponse = res;
            if (this.navModel.logoutResponse.detail === this.navModel.translated.AUTH.LOGOUTSUCCESSION) {
                this.core.logoutUser();
            }
        }, (error) => {
            this.navModel.logoutDisable = false;
            this.helperService.createSnack(this.navModel.translated.MESSAGES.LOGOUT_FAIL_MSG, this.navModel.translated.STATUS.ERROR);
        });
    }

    /**
     * this function is used for displaying model on basis of selection
     */
    showModel(isProfile) {
        let modal = (isProfile) ? GeneralComponent : SecurityComponent;
        this.helperService.createDialog(modal, {disableClose: true});
    }
}
