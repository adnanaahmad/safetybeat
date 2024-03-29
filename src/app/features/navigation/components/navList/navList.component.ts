import {Component, Input} from '@angular/core';
import {NavItem} from 'src/app/models/navItems.model';
import {Router} from '@angular/router';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {NavListModel} from 'src/app/models/navigation/navList.model';


@Component({
  selector: 'app-nav-list',
  templateUrl: './navList.component.html',
  styleUrls: ['./navList.component.scss']
})
export class NavListComponent {
  @Input() public navLinks: Array<NavItem>;
  @Input() public navLinksBottom;
  @Input() public selectedEntity;
  navListModel: NavListModel = <NavListModel>{};

  constructor(
    public router: Router,
    public navService: NavigationService,
    public helperService: HelperService
  ) {
    this.navListModel.translated = this.helperService.translated;
  }
}
