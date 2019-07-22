import {Component, Input, Output, EventEmitter} from '@angular/core';
import {NavItem} from 'src/app/models/navItems.model';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FixedNavModel} from 'src/app/models/navigation/fixedNav.model';

@Component({
  selector: 'app-fixed-nav',
  templateUrl: './fixedNav.component.html',
  styleUrls: ['./fixedNav.component.scss']
})
export class FixedNavComponent {
  @Input() public navLinks: Array<NavItem>;
  @Input() public selectedEntity;
  @Input() navOpened: boolean;
  @Output() sidenavToggle = new EventEmitter<boolean>();

  fixedNav: FixedNavModel = <FixedNavModel>{};
  appIcons: any;

  constructor(
    public helperService: HelperService
  ) {
    this.fixedNav.translated = this.helperService.translated;
    this.fixedNav.appIcons = this.helperService.constants.appIcons;
  }

  /**
   * this function is used for toggling the sideNav bar to open or to close.
   */
  public toggleSideNav() {
    this.navOpened = !this.navOpened;
    this.sidenavToggle.emit(this.navOpened);
  }
}
