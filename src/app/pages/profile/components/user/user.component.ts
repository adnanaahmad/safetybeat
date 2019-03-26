import { Component, OnInit, ViewChild } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { ProfileService } from '../../services/profile.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { share } from 'rxjs/operators';
import { HelperService } from 'src/app/shared/helperService/helper.service';
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  translated: Translation;
  appIcons: any;
  displayedColumns: string[] = [
    "Firstname",
    "Lastname",
    "Email",
    "Contact No.",
    "symbol"
  ];
  allUsers: any = [];
  allUsersList: any = [];
  dataSource: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  empty: boolean = false;
  constructor(
    public userService: ProfileService,
    public logging: LoggingService,
    public helperService: HelperService
  ) {
    this.translated = this.helperService.translation;
    this.appIcons = ConstantService.appIcons;
  }

  ngOnInit() {
    this.getAllUsers();
  }
  getAllUsers() {
    this.allUsers = this.userService.getAllUsers().pipe(share());
    this.allUsers.subscribe(result => {
      this.empty = true;
      this.allUsersList = result.data;
      this.dataSource = new MatTableDataSource(this.allUsersList);
      this.dataSource.paginator = this.paginator;
    },(error)=>{
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR,'Please try again later');
    });
  }
}
