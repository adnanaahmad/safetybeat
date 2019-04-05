import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, share } from 'rxjs/operators';
import { ProfileService } from 'src/app/pages/profile/services/profile.service';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-inviteTeamModal',
  templateUrl: './inviteTeamModal.component.html',
  styleUrls: ['./inviteTeamModal.component.scss']
})
export class InviteTeamModalComponent {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredUsers: Observable<any[]>;
  fruits: string[] = ['Lemon'];
  allFruits: any = [];
  allUsersList:any = [];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  allUsers: any = [];
  empty: boolean;

  constructor(
    private helperService:HelperService,
    private userService:ProfileService
  ) {

    this.userService.usersData.subscribe((res)=>{
      if(res!==1){
        this.allUsersList = res;
      } else {
        this.getAllUsers();
      }
    })
    
  }
  remove(fruit: any): void {
    const index = this.allUsersList.indexOf(fruit);

    if (index >= 0) {
      this.allUsersList.splice(index, 1);
    }
  }
  getAllUsers() {
    this.allUsers = this.userService.getAllUsers().pipe(share());
    this.allUsers.subscribe(
      result => {
        this.empty = true;
        this.allUsersList = result.data;
        this.userService.updateUsers(this.allUsersList);
      },
      error => {
        this.helperService.logoutError(error.status);
      }
    );
  }
}
