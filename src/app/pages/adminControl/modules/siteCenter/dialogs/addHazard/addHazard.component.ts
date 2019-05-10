// import {Component, Inject, OnInit} from '@angular/core';
// import {FormBuilder, Validators} from '@angular/forms';
// import {HelperService} from 'src/app/shared/helperService/helper.service';
// import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
// import {AddHazardModel, Hazard, HazardObj, RiskType} from 'src/app/models/hazard.model';
// import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';
// import {environment} from '../../../../../../../environments/environment';
//
// @Component({
//   selector: 'app-addHazard',
//   templateUrl: './addHazard.component.html',
//   styleUrls: ['./addHazard.component.scss']
// })
// export class AddHazardComponent implements OnInit {
//   hazardObj: AddHazardModel = <AddHazardModel>{};
//   hazardInfo: Hazard = <Hazard>{};
//   risks: string[];
//   serverUrl = environment.serverUrl;
//
//   constructor(
//     public formBuilder: FormBuilder,
//     public helperService: HelperService,
//     public service: AdminControlService,
//     public dialogRef: MatDialogRef<AddHazardComponent>,
//     @Inject(MAT_DIALOG_DATA) public data
//   ) {
//     debugger;
//     // this.getRisks();
//     this.hazardObj.modalType = data.Modal;
//     this.hazardInfo.hazard = data.hazard;
//   }
//
//   ngOnInit() {
//     this.hazardObj.addHazardForm = this.formBuilder.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       risk: ['']
//     });
//     this.service.getRisks().subscribe((res) => {
//         this.risks = res;
//
//       }, (error) => {
//         this.hazardObj.addHazardForm.disable();
//         this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_LIST_FAIL,
//           this.helperService.constants.status.ERROR);
//       }
//     );
//     if (!this.hazardObj.modalType) {
//       this.viewHazardInfo();
//     }
//   }
//
//   viewHazardInfo() {
//     this.risks = this.hazardInfo.hazard.risk
//     this.hazardObj.addHazardForm = this.formBuilder.group({
//       title: this.hazard.hazard.title,
//       description: this.hazard.hazard.description,
//       risk: this.risks.id
//     })
//   }
//
//   getRisks() {
//     this.service.getRisks().subscribe((res) => {
//         this.hazard.risk = res;
//
//       }, (error) => {
//         this.hazardObj.addHazardForm.disable();
//         this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_LIST_FAIL,
//           this.helperService.constants.status.ERROR);
//       }
//     );
//   }
//
//   hazardFormSubmit({value}: { value: HazardObj }) {
//     this.hazardObj.modalType ? this.addHazard(value) : this.editHazard(value);
//   }
//
//   get addHazardControls() {
//     return this.hazardObj.addHazardForm.controls;
//   }
//
//   onFileSelected(event) {
//     this.hazardObj.image = <File>event.target.files[0];
//   }
//
//
//   generateHazardData(value, editHazard) {
//     debugger;
//     let formData = new FormData();
//     if (this.hazardObj.image) {
//       let blob = new Blob([this.hazardObj.image], {type: 'application/image'});
//       formData.append('image', blob, this.hazardObj.image.name);
//     }
//     formData.append('title', value.title);
//     formData.append('description', value.description);
//     formData.append('site', this.data.id);
//     formData.append('risk', value.risk);
//     if (editHazard === false) {
//       formData.append('addedBy', this.hazardObj.addedBy);
//     }
//     return formData;
//   }
//
//   addHazard(value) {
//     this.service.addHazard(this.generateHazardData(value, true)).subscribe((res) => {
//         this.helperService.createSnack('Hazard Added', this.helperService.constants.status.SUCCESS);
//         this.onNoClick();
//         this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ADDED, this.helperService.constants.status.SUCCESS);
//
//       }, (error) => {
//         this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
//           this.helperService.constants.status.ERROR);
//       }
//     );
//   }
//
//
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//
//   editHazard(value) {
//     this.service.editHazard(this.hazard.hazard.id, this.generateHazardData(value, false)).subscribe((res) => {
//         this.helperService.createSnack('Hazard Edited', this.helperService.constants.status.SUCCESS);
//         this.onNoClick();
//         this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ADDED, this.helperService.constants.status.SUCCESS);
//
//       }, (error) => {
//         this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
//           this.helperService.constants.status.ERROR);
//       }
//     );
//   }
// }
