import { Component, OnInit, Input } from "@angular/core";
import { NavItem } from "src/app/models/navItems.model";
import { Router } from "@angular/router";
import { NavigationService } from "../../services/navigation.service";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { InviteUserModalComponent } from "../inviteUserModal/inviteUserModal.component";
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { forEach } from 'lodash';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from 'src/app/models/translate.model';

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
    private logging: LoggingService,
    public translate: TranslateService,
  ) {
    translate.get(['AUTH', 'BUTTONS', 'MESSAGES', 'LOGGER', 'STRINGS', 'ICONS']).subscribe((values) => {
      this.translated = values;
    });
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
      forEach(this.roles, function (obj) {
        obj.name = self.compiler.insertSpaces(obj.name)
      })
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.ROLES_RECIEVED);
    }, (err) => {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.ROLES_RECIEVED_ERROR);
    })
  }
  onItemSelected(navLinks: NavItem) {
    debugger
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
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.closeOnNavigation = false;
    this.dialog.open(InviteUserModalComponent, { data: { "role": this.roles, "entityId": entityId } });
  }

}
