import { Component, OnInit, Output, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit {
  // userData: Observable<{}>;
  userData: any;
  constructor(private profile: ProfileService) {
  }
  @Input()
  ngOnInit() {
    this.userData = this.getUserData();
  }

  getUserData() {
    const dataRecieved = this.profile.getUser(1).pipe(share());
    dataRecieved.subscribe(data => {
      debugger;
    }, err => {
      debugger;
    });
    return dataRecieved;
  }

}
