import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationService } from '../../services/organization.service';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private org: OrganizationService,
    private route: Router,
    private breakpointObserver: BreakpointObserver) {
  }

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Graph 1', cols: 2, rows: 1 },
          { title: 'Graph 2', cols: 2, rows: 1 },
          { title: 'Graph 3', cols: 2, rows: 1 },
          { title: 'Graph 4', cols: 2, rows: 1 }
        ];
      }

      return [
        { title: 'Graph 1', cols: 1, rows: 1 },
        { title: 'Graph 2', cols: 1, rows: 1 },
        { title: 'Graph 3', cols: 1, rows: 1 },
        { title: 'Graph 4', cols: 1, rows: 1 }
      ];
    })
  );

  ngOnInit() {
  }
}
