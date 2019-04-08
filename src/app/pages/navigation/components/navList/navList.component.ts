import { Component, OnInit, Input } from '@angular/core';
import { NavItem } from 'src/app/models/navItems.model';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { InviteUserModalComponent } from '../../../../Dialogs/inviteUserModal/inviteUserModal.component';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { Translation } from 'src/app/models/translate.model';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: "app-nav-list",
  templateUrl: "./navList.component.html",
  styleUrls: ["./navList.component.scss"]
})
export class NavListComponent implements OnInit {
  item: any;
  expanded: boolean;
  translated: Translation;
  dialogConfig = new MatDialogConfig();
  @Input() public navLinks: NavItem;
  @Input() public navLinksBottom;
  roles: any;
  @Input() public selectedEntity;
  constructor(
    public router: Router,
    public navService: NavigationService,
    public dialog: MatDialog,
    private compiler: CompilerProvider,
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
    this.getRoles()
  }

  ngOnInit() {
    if (this.navLinks.children) {
      this.item = this.navLinks;
    }
  }
  getRoles() {
    this.navService.getRoles().subscribe((res) => {
      this.roles = res;
      var self = this;
      this.helperService.iterations(this.roles, function (obj) {
        obj.name = self.compiler.insertSpaces(obj.name)
      })
      this.helperService.appLogger(this.helperService.constants.status.SUCCESS, this.translated.LOGGER.MESSAGES.ROLES_RECIEVED);
    }, (err) => {
      this.helperService.appLogger(this.helperService.constants.status.ERROR, this.translated.LOGGER.MESSAGES.ROLES_RECIEVED_ERROR);
      this.helperService.logoutError(err.status);
    })
  }
  onItemSelected(navLinks: NavItem) {
    if (!navLinks.children || !navLinks.children.length) {
      this.router.navigate([navLinks.route]);
    }
    if (navLinks.children && navLinks.children.length) {
      this.expanded = !this.expanded;
    }
  }
  customActions(displayName) {
    switch (displayName) {
      case 'Invite Users':
        this.inviteUserModal(this.selectedEntity.entityInfo.id);
        break;
      case 'Analytics Reports':
        this.navLinks = this.compiler.switchSideMenu(this.selectedEntity, displayName)
        break;
      default:
        break;
    }
  }

  inviteUserModal(entityId) {
    this.helperService.createDialog(InviteUserModalComponent, { data: { "role": this.roles, "entityId": entityId } });
  }

}
