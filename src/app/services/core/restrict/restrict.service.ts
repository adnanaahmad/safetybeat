import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {PackageDetailsComponent} from 'src/app/features/loginRegistration/components/packageDetails/packageDetails.component';


@Injectable()
export class NoAuthGuard implements CanActivate, OnDestroy, CanDeactivate<PackageDetailsComponent> {
  subscription: Subscription;
  permission: boolean;
  packageExpired: boolean;

  constructor(
    private navService: NavigationService,
    private helperService: HelperService, ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (route.routeConfig.path === 'adminControl' || route.routeConfig.path === 'profile' ) {
      return true;
    }
    this.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res && res !== 1) {
        let selectedEntity = res;
        this.permission = selectedEntity.permissions[this.helperService.constants.componentPermission[route.routeConfig.path]];
      } else {
        let selectedEntity = JSON.parse(this.helperService.decrypt((localStorage.getItem('url')), this.helperService.appConstants.key));
        this.permission = selectedEntity[this.helperService.constants.componentPermission[route.routeConfig.path]];
      }
    });
    if (!this.permission) {
      this.helperService.navigateTo([state.url + '/404']);
    }
    return this.permission;

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  canDeactivate(component: PackageDetailsComponent, currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean {
    if (nextState.url.split('/')[1] === 'home') {
      this.subscription = this.navService.packageData.subscribe((res) => {
        if (res !== 1) {
          this.packageExpired = res.expired;
          return !this.packageExpired ? false : true;
        }
      });
    } else {
      return true;
    }
    return !this.packageExpired;
  }
}
