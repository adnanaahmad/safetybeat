import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private userServices:ProfileService
  ) { }

  ngOnInit() {
    this.usersOfOrganization();
  }

  usersOfOrganization(){
    this.userServices.getAllUsers().subscribe((res)=>{
    })
  }

}
