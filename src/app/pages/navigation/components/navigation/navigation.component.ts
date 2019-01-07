import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CoreService } from 'src/app/core/services/authorization/core.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {


  public navLinks = [
    { path: '/home', icon: 'dashboard', label: 'Dashboard' },
    { path: '/home/profile', icon: 'person', label: 'Profile' },
    { path: '/home', icon: 'supervised_user_circle', label: 'My Team' }
  ];
  public navLinksBottom = [
    { path: '/home', icon: 'dashboard', label: 'Dashboard2' },
    { path: '/home/profile', icon: 'person', label: 'Profile2' },
    { path: '/home', icon: 'supervised_user_circle', label: 'My Team2' }
  ];
  constructor(public core: CoreService) {

  }

  ngOnInit() {
  }

}
