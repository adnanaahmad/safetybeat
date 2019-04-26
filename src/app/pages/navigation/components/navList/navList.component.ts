import {Component, OnInit, Input} from '@angular/core';
import {NavItem} from 'src/app/models/navItems.model';
import {Router} from '@angular/router';
import {NavigationService} from 'src/app/pages/navigation/services/navigation.service';
import {InviteUserModalComponent} from 'src/app/Dialogs/inviteUserModal/inviteUserModal.component';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {NavListModel} from 'src/app/models/navigation/navList.model';


@Component({
  selector: 'app-nav-list',
  templateUrl: './navList.component.html',
  styleUrls: ['./navList.component.scss']
})
export class NavListComponent implements OnInit {
  @Input() public navLinks: NavItem;
  @Input() public navLinksBottom;
  @Input() public selectedEntity;
  navListModel: NavListModel = <NavListModel>{};

  constructor(
    public router: Router,
    public navService: NavigationService,
    private compiler: CompilerProvider,
    public helperService: HelperService,
  ) {
    this.navListModel.translated = this.helperService.translated;
    this.getRoles();
  }

  ngOnInit() {
    if (this.navLinks.children) {
      this.navListModel.item = this.navLinks;
    }
  }

  /**
   * this function is used for getting all the roles from the db using api call.
   */
  getRoles() {
    this.navService.getRoles().subscribe((res) => {
      this.navListModel.roles = res;
      let self = this;
      this.helperService.iterations(this.navListModel.roles, function (obj) {
        obj.name = self.compiler.insertSpaces(obj.name);
      });
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS,
        this.navListModel.translated.LOGGER.MESSAGES.ROLES_RECIEVED);
    }, (err) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR,
        this.navListModel.translated.LOGGER.MESSAGES.ROLES_RECIEVED_ERROR);
      this.helperService.logoutError(err.status);
    });
  }

  /**
   * this function is used for invite users and analytics reports that if the user click on
   * invite users menu item then the modal dialog will be opened and if the user has
   * clicked on the analytics reports then the menu will be switched and only the reporting
   * components will be listed down.
   * @params displayName
   */
  customActions(displayName) {
    switch (displayName) {
      case 'Invite Users':
        this.inviteUserModal(this.selectedEntity.entityInfo.id);
        break;
      case 'Analytics Reports':
        this.navLinks = this.compiler.switchSideMenu(this.selectedEntity, displayName);
        break;
      default:
        break;
    }
  }

  /**
   * this function is used for creating the modal dialog of invite user and with this modal we also attach the all roles and
   * entity id of the selected entity.
   * @params entityId
   */
  inviteUserModal(entityId) {
    this.helperService.createDialog(InviteUserModalComponent, {data: {'role': this.navListModel.roles, 'entityId': entityId}});
  }

}
