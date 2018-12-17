import { Component, OnInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {


  public navLinks = [
    { path: '/home', icon: 'dashboard', label: 'Dashboard' },
    { path: '/home/profile', icon: 'supervised_user_circle', label: 'Profile' }
  ];
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
