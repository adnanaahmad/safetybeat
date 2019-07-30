import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatBottomSheet, MatDialogRef} from '@angular/material';
import {AddHazardModel} from 'src/app/models/hazard.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {AddActionsComponent} from 'src/app/features/adminControl/modules/siteCenter/dialogs/addActions/addActions.component';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {User} from 'src/app/models/user.model';

@Component({
  selector: 'app-addHazard',
  templateUrl: './addHazard.component.html',
  styleUrls: ['./addHazard.component.scss']
})
export class AddHazardComponent implements OnInit {
  @ViewChild('gmap') gMapElement: ElementRef;
  hazardObj: AddHazardModel = <AddHazardModel>{};

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService,
    public service: AdminControlService,
    private bottomSheet: MatBottomSheet,
    public navService: NavigationService,
    public memberService: MemberCenterService,
    public compiler: CompilerProvider,
    public dialogRef: MatDialogRef<AddHazardComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.hazardObj.editModal = data.Modal;
    this.hazardObj.hazardInfo = data.hazardInfo;
    this.hazardObj.url = helperService.appConstants.noHazard;
  }

  ngOnInit() {
    this.initialize();
    this.getRisks();
    this.getAllUsers();
    this.hazardObj.addHazardFormFirst = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['', Validators.required],
      pic: [''],
      note: ['', Validators.required],
      responsible: [false]
    });
    if (this.hazardObj.editModal) {
      this.hazardObj.siteName = this.data.hazardInfo.site.name;
      this.hazardObj.location = this.data.hazardInfo.site.location;
      this.addHazardControls['title'].setValue(this.data.hazardInfo.title);
      this.addHazardControls['description'].setValue(this.data.hazardInfo.description);
      this.addHazardControls['risk'].setValue(this.data.hazardInfo.risk.id);
      this.addHazardControls['note'].setValue(this.data.hazardInfo.precautionaryNote);
      this.addHazardControls['responsible'].setValue(this.data.hazardInfo.isEntityResponsible);
      this.hazardObj.url = this.data.hazardInfo.image ? this.data.hazardInfo.image : this.helperService.appConstants.noHazard;
      this.hazardObj.actionsArray = this.data.hazardInfo.actions;
    } else {
      this.hazardObj.siteName = this.data.siteName;
      this.hazardObj.location = this.data.location;
    }
  }

  initialize() {
    this.hazardObj.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.hazardObj.entityName = res.entityInfo.name;
      }
    });
    this.hazardObj.emails = [];
    // tslint:disable-next-line:max-line-length
    this.hazardObj.msg = this.helperService.translated.MESSAGES.IS + this.hazardObj.entityName + this.helperService.translated.MESSAGES.ENTITY_RES_MSG;
    this.hazardObj.actionsArray = [];
    this.hazardObj.allUsers = [];
    this.hazardObj.allUsersList = [];
    this.hazardObj.selectedUserList = [];
    this.hazardObj.filteredSelectedUsers = [];
  }

  getRisks() {
    this.service.getRisks().subscribe((res) => {
        this.hazardObj.risks = res;
      }, (error) => {
        this.hazardObj.addHazardFormFirst.disable();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_LIST_FAIL,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  hazardFormSubmit(value) {
    this.hazardObj.editModal ? this.editHazard(value) : this.addHazard(value);
  }

  get addHazardControls() {
    return this.hazardObj.addHazardFormFirst.controls;
  }

  onFileSelected(file: FileList) {
    this.hazardObj.removeImage = 'False';
    this.hazardObj.image = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.hazardObj.url = event.target.result;
    };
    reader.readAsDataURL(this.hazardObj.image);
  }


  removePicture() {
    this.hazardObj.url = this.helperService.appConstants.noHazard;
    this.hazardObj.removeImage = 'True';
  }

  addHazard(value) {
    this.service.addHazard(this.generateNewHazard(value)).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.onNoClick(this.helperService.appConstants.yes);
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ADDED,
            this.helperService.constants.status.SUCCESS);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.onNoClick(null);
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.onNoClick(null);
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
          this.helperService.constants.status.ERROR);
      }
    );
  }


  onNoClick(msg: string): void {
    this.dialogRef.close(msg);
  }

  editHazard(value) {
    this.service.editHazard(this.hazardObj.hazardInfo.id, this.generateNewHazard(value)).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.onNoClick(this.helperService.appConstants.yes);
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_SUCCESS,
            this.helperService.constants.status.SUCCESS);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.onNoClick(null);
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_FAILURE,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.onNoClick(null);
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  getAllUsers() {
    let data = {
      entityId: JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };
    this.memberService.getUsersList(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.hazardObj.allUsersList = this.compiler.constructUserDataOfTeam(res.data);
        this.hazardObj.allUsers = this.compiler.constructUserDataOfTeam(res.data);
      } else {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  filterAllUserList(value) {
    let filterValue = value.toLowerCase();
    this.hazardObj.allUsers = this.hazardObj.allUsersList.filter(
      user => user.name.toLowerCase().startsWith(filterValue));
  }
  filterSelectedUserList(value) {
    let filterValue = value.toLowerCase();
    this.hazardObj.filteredSelectedUsers = this.hazardObj.selectedUserList.filter(
      user => user.name.toLowerCase().startsWith(filterValue));
  }

  openBottomSheet() {
    const bottomSheetRef = this.bottomSheet.open(AddActionsComponent, {disableClose: true});
    bottomSheetRef.afterDismissed().subscribe((res) => {
      if (res !== 'cancel') {
        this.hazardObj.actionsArray.push(res);
      }
    });
  }

  saveValues(value) {
    this.hazardObj.hazardTitle = value.title;
    this.hazardObj.description = value.description;
    this.hazardObj.note = value.note;
  }

  generateNewHazard(value) {
    let formData = new FormData();
    formData.append('title', value.title);
    formData.append('risk', value.risk);
    formData.append('precautionaryNote ', value.note);
    formData.append('description', value.description);
    formData.append('isEntityResponsible', value.responsible);
    if (this.hazardObj.image) {
      let blob = new Blob([this.hazardObj.image], {type: 'application/image'});
      formData.append('image', blob, this.hazardObj.image.name);
    }
    if (value.responsible) {
      formData.append('action', JSON.stringify( this.compiler.constructActions(this.hazardObj.actionsArray)));
    }
    if (this.hazardObj.selectedUserList.length !== 0) {
      formData.append('share', 'true');
      formData.append('emails', JSON.stringify(this.hazardObj.emails));
    } else {
      formData.append('share', 'false');
    }
    if (this.hazardObj.editModal) {
      formData.append('site', this.hazardObj.hazardInfo.site.id);
      formData.append('preciseLocation ', this.hazardObj.hazardInfo.site.location);
      formData.append('removeImage', this.hazardObj.removeImage);
    } else {
      formData.append('site', this.data.siteId);
      formData.append('preciseLocation ', this.hazardObj.location);
    }
    return formData;
  }

  alreadyAddedCheck(user: any) {
    for (let i = 0; i < this.hazardObj.filteredSelectedUsers.length; i++) {
      if (this.hazardObj.filteredSelectedUsers[i].id === user.id) {
        return true;
      }
    }
    return false;
  }

  removeFromSelected(selectedUser: any) {
    let index: number = this.hazardObj.selectedUserList.indexOf(selectedUser);
    if (index !== -1) {
      this.hazardObj.selectedUserList.splice(index, 1);
    }
    let index2: number = this.hazardObj.filteredSelectedUsers.indexOf(selectedUser);
    if (index2 !== -1) {
      this.hazardObj.filteredSelectedUsers.splice(index2, 1);
    }
    let index3: number = this.hazardObj.emails.indexOf(selectedUser.email);
    if (index3 !== -1) {
      this.hazardObj.emails.splice(index3, 1);
    }
  }

  addToSelected(user: User) {
    this.hazardObj.selectedUserList.push(user);
    this.hazardObj.filteredSelectedUsers.push(user);
    this.hazardObj.emails.push(user.email);
  }

}
