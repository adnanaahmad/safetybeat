import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatChipInputEvent
} from "@angular/material";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map, share } from "rxjs/operators";
import { ProfileService } from "src/app/pages/profile/services/profile.service";
import { HelperService } from "src/app/shared/helperService/helper.service";
import { User } from "src/app/models/user.model";
import { CompilerProvider } from "src/app/shared/compiler/compiler";
import { AdminControlService } from "../../services/adminControl.service";
@Component({
  selector: "app-inviteTeamModal",
  templateUrl: "./inviteTeamModal.component.html",
  styleUrls: ["./inviteTeamModal.component.scss"]
})
export class InviteTeamModalComponent {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUsers: Observable<any[]>;
  users: any[] = [];
  allUsers: any[] = [];

  @ViewChild("userInput") userInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<InviteTeamModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private adminServices: AdminControlService,
    private helperService: HelperService
  ) {
    this.allUsers = this.data.inviteTeamData.usersData.map(x =>
      Object.assign({}, x)
    );
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: any | null) => {
        return fruit ? this._filter(fruit) : this.allUsers.slice();
      })
    );
  }
  remove(fruit: any): void {
    const index = this.users.indexOf(fruit);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let index = this.helperService.findIndex(this.users, function(obj) {
      return obj.first_name === event.option.value.first_name;
    });
    if (index === -1) {
      this.users.push(event.option.value);
    }
    this.userInput.nativeElement.value = "";
    this.userCtrl.setValue(null);
  }

  private _filter(value: any): any[] {
    const filterValue =
      value && value.first_name
        ? value.first_name.toLowerCase()
        : value.toLowerCase();
    return this.allUsers.filter(fruit => {
      return fruit.first_name.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  inviteTeam() {
    let userEmails: any = [];
    this.helperService.iterations(this.users, function(obj) {
      userEmails.push(obj.email);
    });
    let inviteTeamData = {
      email: userEmails,
      entityCode: this.data.inviteTeamData.entityData
    };
    this.adminServices.inviteTeam(inviteTeamData).subscribe((res)=>{
      console.log(res);
    })
  }
}
