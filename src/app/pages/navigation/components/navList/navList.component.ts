import { Component, OnInit, Input } from "@angular/core";
import { NavItem } from "src/app/models/navItems.model";
import { Router } from "@angular/router";
import { NavigationService } from "../../services/navigation.service";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { InviteUserModalComponent } from "../inviteUserModal/inviteUserModal.component";
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import * as _ from 'lodash'
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
  constructor(
    public router: Router,
    public navService: NavigationService,
    public dialog: MatDialog,
    private compilerProvider: CompilerProvider,
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
      _.forEach(this.roles, function (obj) {
        obj.name = self.compilerProvider.insertSpaces(obj.name)
      })
      this.logging.appLogger(this.translated.LOGGER.STATUS.SUCCESS, this.translated.LOGGER.MESSAGES.ROLES_RECIEVED);
    }, (err) => {
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR, this.translated.LOGGER.MESSAGES.ROLES_RECIEVED_ERROR);
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

  inviteUserModal() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.closeOnNavigation = false;
    this.dialog.open(InviteUserModalComponent, { data: this.roles });
  }

}
