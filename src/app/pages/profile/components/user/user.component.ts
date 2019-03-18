import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Translation } from "src/app/models/translate.model";
import { ConstantService } from 'src/app/shared/constant/constant.service';
import { ProfileService } from '../../services/profile.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
export interface PeriodicElement {
  name: string;
  email: string;
  contact: number;
  photos: string;
  accessLevel: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9CjkT5ZsjKVUPDmQxrbfAx3uO3khf1WV4F_hK5Id5cpcxSkav",
    name: "Hydrogen",
    email: "asad@optergy.com",
    contact: 923157118511,
    accessLevel: "user"
  },
  {
    photos:
      "https://0.academia-photos.com/31849164/9465967/10547536/s200_nabeel.zubair.jpg_oh_4704ce984fd9fa186890395ba7e3a50e_oe_55ea4f26___gda___1443393968_e868319be1a6b839dfccc3f65287f6d7",
    name: "Helium",
    email: "sohaib@optergy.com",
    contact: 923157118511,
    accessLevel: "admin"
  },
  {
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9CjkT5ZsjKVUPDmQxrbfAx3uO3khf1WV4F_hK5Id5cpcxSkav",
    name: "Lithium",
    email: "asad@google.com",
    contact: 923157118511,
    accessLevel: "user"
  },
  {
    photos:
      "https://0.academia-photos.com/31849164/9465967/10547536/s200_nabeel.zubair.jpg_oh_4704ce984fd9fa186890395ba7e3a50e_oe_55ea4f26___gda___1443393968_e868319be1a6b839dfccc3f65287f6d7",
    name: "Beryllium",
    email: "taqi@yahoo.com",
    contact: 923157118511,
    accessLevel: "admin"
  },
  {
    photos:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9CjkT5ZsjKVUPDmQxrbfAx3uO3khf1WV4F_hK5Id5cpcxSkav",
    name: "Boron",
    email: "sohaib@gmail.com",
    contact: 923157118511,
    accessLevel: "user"
  }
];
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
  translated: Translation;
  appIcons: any;
  allUsers: any = [];
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
  displayedColumns: string[] = [
    "photos",
    "name",
    "email",
    "contact",
    "accessLevel",
    "symbol"
  ];
  dataSource = ELEMENT_DATA;


  getAllUsers(){
    this.userService.getAllUsers().subscribe((result)=>{
      debugger;
      this.allUsers = result
      console.log(this.allUsers);
    }),(error=>{
      this.logging.appLogger(this.translated.LOGGER.STATUS.ERROR,"There's something bad happened, Please try again later");
    })
  }
}
