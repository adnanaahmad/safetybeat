import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CoreService} from 'src/app/services/core/authorization/core.service';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';

@Injectable()
/**
 * injectable is used to get the services og thr coreService because without this we can not get the functionalities of any
 * other services
 */
export class AuthGuard implements CanActivate {

  constructor(
    private coreService: CoreService,
    private router: Router
  ) {
  }

  /**
   * this is the bool type function that will return true if the user has any token otherwise it will return false and will
   * navigate to the login page. this function is used when we have to apply the condition that the particular page will be
   * shown when this function return true for example the dashboard page will be shown when the user is logged in.
   */
  canActivate(): boolean {
    if (this.coreService.getToken()) {
      return true;
    } else {
      if (this.router.url === '/signup') {
        return true
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
  }

}
