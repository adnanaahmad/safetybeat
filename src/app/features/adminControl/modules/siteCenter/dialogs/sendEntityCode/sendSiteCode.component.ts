import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {SendSiteCode, SendSiteCodeData} from 'src/app/models/site.model';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {MAT_DIALOG_DATA, MatAutocomplete, MatAutocompleteSelectedEvent, MatDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {User} from 'src/app/models/user.model';
import {map, startWith} from 'rxjs/operators';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';

@Component({
  selector: 'app-send-entity-code',
  templateUrl: './sendSiteCode.component.html',
  styleUrls: ['./sendSiteCode.component.scss']
})
export class SendSiteCodeComponent implements OnInit {
  sendSiteCode: SendSiteCode = <SendSiteCode>{};

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<SendSiteCodeComponent>,
    public helperService: HelperService,
    private adminServices: AdminControlService,
    private compiler: CompilerProvider,
    @Inject(MAT_DIALOG_DATA) public data: SendSiteCodeData,
  ) {
    this.initialize();
    this.sendSiteCode.allUsers = this.data.inviteSiteCodeData.usersData
      ? this.data.inviteSiteCodeData.usersData.map(x => Object.assign({}, x))
      : [];
    this.sendSiteCode.filteredUsers = this.sendSiteCode.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: User | null) => {
        return user
          ? this._filter(user)
          : this.sendSiteCode.allUsers.slice();
      })
    );
  }

  ngOnInit() {
  }

  initialize() {
    this.sendSiteCode.removable = true;
    this.sendSiteCode.separatorKeysCodes = [ENTER, COMMA];
    this.sendSiteCode.users = [];
    this.sendSiteCode.allUsers = [];
    this.sendSiteCode.userCtrl = new FormControl();
    this.sendSiteCode.translated = this.helperService.translated;
    this.sendSiteCode.loading = false;
  }

  /**
   * this function is used in the material chips form when we select the multiple or single user to be invited and we want
   * him/her to remove from the list then we will use this function.
   * @params user
   */

  remove(user: User): void {
    const index = this.sendSiteCode.users.indexOf(user);
    if (index >= 0) {
      this.sendSiteCode.users.splice(index, 1);
    }
  }

  /**
   * this function is called when we select any of the users from the list then the first_name of that user
   * is shown in the input field and when nothing is selected then this function sets the value of null and
   * input fields remain empty.
   * @params event
   */

  selected(event: MatAutocompleteSelectedEvent): void {
    let index = this.helperService.findIndex(
      this.sendSiteCode.users,
      function (obj) {
        return obj.first_name === event.option.value.first_name;
      }
    );
    if (index === -1) {
      this.sendSiteCode.users.push(event.option.value);
    }
    this.userInput.nativeElement.value = '';
    this.sendSiteCode.userCtrl.setValue(null);
  }

  /**
   *this function is used for filtering out the users from the list using search bar.
   * @params value
   */

  private _filter(value): Array<User> {
    const filterValue = value && value.first_name
      ? value.first_name.toLowerCase()
      : value.toLowerCase();
    return this.sendSiteCode.allUsers.filter(user => {
      return user.first_name.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  /**
   * this function is used for closing the modal dialog.
   */

  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * this function is used when we select the users to invite and then hit on invite button then all the data of the users
   * is sent to the api and then api makes them added in the particular team.
   */

  sendUsersSiteCodes() {
    this.sendSiteCode.loading = true;
    let userEmails: Array<string> = [];
    this.helperService.iterations(this.sendSiteCode.users, function (obj) {
      userEmails.push(obj.email);
    });
    let sendCodeData = {
      email: userEmails,
      code: this.data.inviteSiteCodeData.siteCodeData
    };
    this.adminServices.sendSiteCode(sendCodeData).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.sendSiteCode.loading = false;
        this.dialogRef.close();
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
      } else {
        this.sendSiteCode.loading = false;
        this.dialogRef.close();
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.sendSiteCode.loading = false;
      this.dialogRef.close();
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    })
  }


}
