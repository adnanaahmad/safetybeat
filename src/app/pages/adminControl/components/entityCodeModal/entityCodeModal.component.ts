import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
@Component({
  selector: 'app-entityCodeModal',
  templateUrl: './entityCodeModal.component.html',
  styleUrls: ['./entityCodeModal.component.scss']
})
export class AlertModalComponent implements OnInit {
/* To copy Text from Textbox */
copyInputMessage(inputElement){
  inputElement.select();
  document.execCommand('copy');
  inputElement.setSelectionRange(0, 0);
}

/* To copy any Text */
copyText(val: string){
  let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  constructor(
    public dialogRef: MatDialogRef<AlertModalComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }

  ngOnInit() {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
