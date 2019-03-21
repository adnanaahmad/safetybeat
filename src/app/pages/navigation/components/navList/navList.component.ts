import { Component, OnInit, Input } from "@angular/core";
import { NavItem } from "src/app/models/navItems.model";
import { Router } from "@angular/router";
import { NavigationService } from "../../services/navigation.service";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { InviteUserModalComponent } from "../inviteUserModal/inviteUserModal.component";
import { CompilerProvider } from 'src/app/shared/compiler/compiler';

@Component({
  selector: "app-nav-list",
  templateUrl: "./navList.component.html",
  styleUrls: ["./navList.component.scss"]
})
export class NavListComponent implements OnInit {
  item: any;
  expanded: boolean;
  dialogConfig = new MatDialogConfig();
  @Input() public navLinks: NavItem;
  @Input() public navLinksBottom;
  @Input() public selectedEntity;
  constructor(
    public router: Router,
    public navService: NavigationService,
    public dialog: MatDialog,
    public compiler: CompilerProvider
  ) {

  }

  ngOnInit() {
    if (this.navLinks.children) {
      this.item = this.navLinks;
    }
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
        this.inviteUserModal();
        break;
      case 'Analytics Reports':
        console.log(this.selectedEntity)
       this.navLinks = this.compiler.switchSideMenu(this.selectedEntity, displayName)
       debugger
        break;
      default:
        break;
    }
  }

  inviteUserModal() {
    this.dialogConfig.disableClose = true;
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.closeOnNavigation = false;
    this.dialog.open(InviteUserModalComponent);
  }

}
