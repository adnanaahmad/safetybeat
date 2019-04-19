import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {share} from 'rxjs/operators';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {UserModel} from 'src/app/models/profile/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userModel: UserModel = <UserModel>{};

  constructor(
    public userService: ProfileService,
    public helperService: HelperService
  ) {
    this.initialize();
  }

  ngOnInit() {
    this.userModel.subscription = this.userService.usersData.subscribe(res => {
      if (res === 1) {
        this.getAllUsers();
      } else {
        this.userModel.empty = true;
        this.userModel.dataSource = new MatTableDataSource(res);
        this.userModel.dataSource.paginator = this.paginator;
      }
    });
  }

  ngAfterViewInit() {
    this.userModel.subscription.unsubscribe();
  }

  initialize() {
    this.userModel.translated = this.helperService.translated;
    this.userModel.appIcons = this.helperService.constants.appIcons;
    this.userModel.displayedColumns = [
      'Firstname',
      'Lastname',
      'Email',
      'Contact No.',
      'symbol'
    ];
    this.userModel.dataSource = [];
    this.userModel.allUsers = [];
    this.userModel.empty = false;
  }

  /**
   *
   */

  getAllUsers() {
    this.userModel.allUsers = this.userService.getAllUsers().pipe(share());
    this.userModel.allUsers.subscribe(
      result => {
        this.userModel.empty = true;
        this.userModel.allUsersList = result.data;
        this.userService.updateUsers(this.userModel.allUsersList);
        this.userModel.dataSource = new MatTableDataSource(this.userModel.allUsersList);
        this.userModel.dataSource.paginator = this.paginator;
      },
      error => {
        this.helperService.logoutError(error.status);
      }
    );
  }
}
