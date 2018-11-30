import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  constructor(
    private login: LoginService
  ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.login.isLoggedIn;
  }
  onLogout() {
    this.login.logoutUser();
  }

}
