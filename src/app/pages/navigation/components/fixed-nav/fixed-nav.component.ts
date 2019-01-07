import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fixed-nav',
  templateUrl: './fixed-nav.component.html',
  styleUrls: ['./fixed-nav.component.scss']
})
export class FixedNavComponent implements OnInit {
  @Input()
  navOpened: boolean;
  @Output()
  sidenavToggle = new EventEmitter<boolean>();
  public navLinks = [
    { path: '/home', icon: 'dashboard' },
    { path: '/home/profile', icon: 'person' },
    { path: '/home', icon: 'supervised_user_circle' }
  ];
  public navLinksBottom = [
    { path: '/home', icon: 'search' },
    { path: '/home', icon: 'add' },
    { path: '/home', icon: 'notification_important' },
    { path: '/home', icon: 'help' }
  ];
  // Toggle the sidenav
  public toggleSideNav() {
    this.navOpened = !this.navOpened;
    this.sidenavToggle.emit(this.navOpened);
  }
  constructor() { }

  ngOnInit() {
  }

}
