import { Component, OnInit, Input } from '@angular/core';
import { NavItem } from 'src/app/models/navItems.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-list',
  templateUrl: './navList.component.html',
  styleUrls: ['./navList.component.scss']
})
export class NavListComponent implements OnInit {
  item:any;
  expanded:boolean;
  @Input() public navLinks:NavItem;
  @Input() public navLinksBottom;
  constructor(
    public router:Router
  ) {
  }

  ngOnInit() {
    if(this.navLinks.children){
      this.item=this.navLinks;
      console.log('These are the menus',this.item);
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
}
