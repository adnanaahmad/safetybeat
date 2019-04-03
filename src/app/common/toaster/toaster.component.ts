import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }

}
