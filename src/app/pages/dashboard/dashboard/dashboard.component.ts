import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { OrganizationService } from '../services/organization.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public auth: AuthService,
    private org: OrganizationService,
    private route: Router) {
  }

  ngOnInit() {
  }

  userData() {
    this.org.getUser().subscribe(data => {
      console.log(data)
    }, err => {
      console.log(err)
    })
  }
}
