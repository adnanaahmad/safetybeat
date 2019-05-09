import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {UserModel} from 'src/app/models/profile/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userModel: UserModel = <UserModel>{};

  constructor(
    public userService: ProfileService,
    public helperService: HelperService
  ) {
    this.initialize();
  }

  /**
   * this function is used for subscribing to the usersData behavior subject and if the data is not
   * there in the observable then the api will be called again.
   */

  ngOnInit() {
    this.userModel.subscription = this.userService.usersData.subscribe(res => {
      if (res !== 1) {
        this.userModel.empty = true;
        this.userModel.userData = res;
        this.userModel.dataSource = new MatTableDataSource(this.userModel.userData);
        this.userModel.dataSource.paginator = this.paginator;
      } else {
        this.getAllUsers();
      }
    });
    this.userService.getUser().subscribe(res => {
      this.userModel.user = res;
      this.userModel.userId = this.userModel.user.data.user.id;
    });
  }


  /**
   * this function is used for unsubscription of all the observables that have been subscribed.
   */

  ngOnDestroy() {
    this.userModel.subscription.unsubscribe();
  }

  /**
   * this function is used for initializing the global variables.
   */
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
   * this function is used for getting all the usersData who have been invited.
   */

  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      result => {
        this.userModel.allUsers = result;
        this.userModel.empty = true;
        this.userModel.allUsersList = this.userModel.allUsers.data;
        this.userService.updateUsers(this.userModel.allUsersList);
        this.userModel.dataSource = new MatTableDataSource(this.userModel.allUsersList);
        this.userModel.dataSource.paginator = this.paginator;
      },
      error => {
      }
    );
  }
}
