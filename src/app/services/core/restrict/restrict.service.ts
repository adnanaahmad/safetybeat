import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Subscription} from 'rxjs';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';


@Injectable()
export class NoAuthGuard implements CanActivate, OnDestroy {
  private subscription: Subscription;
  private permission: boolean = false;

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
}
