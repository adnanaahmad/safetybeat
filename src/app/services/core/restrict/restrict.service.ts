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
    this.subscription = this.navService.data.subscribe((res) => {
      if (res && res !== 1) {
        let index = this.helperService.findIndex(res.entities, function (entity) {
          return entity.active === true;
        });
        let selectedEntity = index !== -1 ? res.entities[index] : res.entities[0];
        this.permission = selectedEntity.permissions[this.helperService.constants.componentPermission[route.routeConfig.path]];
      }
    });
    return this.permission;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
