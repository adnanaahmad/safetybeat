import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/common/helperService/helper.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-welcomeScreen',
  templateUrl: './welcomeScreen.component.html',
  styleUrls: ['./welcomeScreen.component.scss']
})
export class WelcomeScreenComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'particleContainer', cols: 2, rows: 1 },
          { title: 'registeredSuccess', cols: 2, rows: 1 }
        ];
      } else {
        return [
          { title: 'particleContainer', cols: 1, rows: 2 },
          { title: 'registeredSuccess', cols: 1, rows: 2 }
        ];
      }
    })
  );
  constructor(
    public helperService: HelperService,
    private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit() {
  }

}
