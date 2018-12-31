import { Component, OnInit, Output } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})

export class ProfileComponent implements OnInit {
  @Output() loaded: boolean = false;
  userData: any;
  constructor(private profile: ProfileService,
    private compiler: CompilerProvider) {
  }

  ngOnInit() {
    this.profile.getUser(1).subscribe((data) => {
      this.userData = this.compiler.constructUserData(data);
      this.loaded = true;
    });
  }

}
