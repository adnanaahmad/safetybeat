import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {UserModel} from 'src/app/models/profile/user.model';
import {PaginationData} from '../../../../models/site.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userModel: UserModel = <UserModel>{};
  private pageSize: number;
  private pageCount: number;

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
    this.userService.getUser().subscribe(res => {
      this.userModel.user = res;
      this.userModel.userId = this.userModel.user.data.user.id;
    });
    this.getAllUsers(0);
  }


  /**
   * this function is used for unsubscription of all the observables that have been subscribed.
   */

  ngOnDestroy() {
  }

  /**
   * this function is used for initializing the global variables.
   */
  initialize() {
    this.userModel.loading = false;
    this.userModel.translated = this.helperService.translated;
    this.userModel.appIcons = this.helperService.constants.appIcons;
    this.userModel.displayedColumns = [
      'Firstname',
      'Lastname',
      'Email',
      'Contact No.'
    ];
    this.userModel.dataSource = [];
    this.pageSize = 10;
    this.userModel.allUsers = [];
    this.userModel.empty = false;
  }

  /**
   * this function is used for getting all the usersData who have been invited.
   */

  getAllUsers(pageIndex) {
    this.userModel.loading = true;
    let paginationData: PaginationData = {
      limit: this.helperService.constants.appConstant.paginationLimit,
      offset: pageIndex * this.helperService.constants.appConstant.paginationLimit,
    };
    this.userService.getAllUsers(paginationData).subscribe(
      (result) => {
        if (result) {
          this.userModel.allUsers = result.data.allUser;
          this.userModel.empty = true;
          this.userService.updateUsers(this.userModel.allUsersList);
          this.userModel.loading = false;
          this.pageCount = result.data.pageCount;
          this.userModel.dataSource = new MatTableDataSource(this.userModel.allUsers);
        } else {
          this.userModel.loading = false;
        }
      },
      (error) => {
        this.userModel.loading = false;
        this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
      }
    );
  }
}
