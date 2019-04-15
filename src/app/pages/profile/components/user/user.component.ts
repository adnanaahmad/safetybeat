import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Translation} from 'src/app/models/translate.model';
import {ProfileService} from 'src/app/pages/profile/services/profile.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {share} from 'rxjs/operators';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit {
  translated: Translation;
  appIcons: any;
  displayedColumns: string[] = [
    'Firstname',
    'Lastname',
    'Email',
    'Contact No.',
    'symbol'
  ];
  allUsers: any = [];
  allUsersList: any;
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  empty: boolean = false;

  constructor(
    public userService: ProfileService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translated;
    this.appIcons = this.helperService.constants.appIcons;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.userService.usersData.subscribe(res => {
      if (res === 1) {
        this.getAllUsers();
      } else {
        this.empty = true;
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  /**
   *
   */

  getAllUsers() {
    this.allUsers = this.userService.getAllUsers().pipe(share());
    this.allUsers.subscribe(
      result => {
        this.empty = true;
        this.allUsersList = result.data;
        this.userService.updateUsers(this.allUsersList);
        this.dataSource = new MatTableDataSource(this.allUsersList);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.helperService.logoutError(error.status);
      }
    );
  }
}
