import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Translation } from "src/app/models/translate.model";
import { ConstantService } from "src/app/shared/constant/constant.service";
import { ProfileService } from "../../services/profile.service";
import { LoggingService } from "src/app/shared/logging/logging.service";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { share } from "rxjs/operators";
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
    translate: TranslateService,
    public userService: ProfileService,
    public logging: LoggingService
  ) {
    translate
      .get([
        "AUTH",
        "BUTTONS",
        "MESSAGES",
        "LOGGER",
        "STRINGS",
        "ICONS",
        "SITETITLE",
        "TABLEHEADINGS"
      ])
      .subscribe(values => {
        this.translated = values;
      });
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
      localStorage.setItem("users", JSON.stringify(this.allUsersList));
      this.dataSource = new MatTableDataSource(this.allUsersList);
      this.dataSource.paginator = this.paginator;
    },(error)=>{
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR,'Please try again later');
    });
  }
}
