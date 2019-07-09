import { Component,Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-imageLightbox',
  templateUrl: './imageLightbox.component.html',
  styleUrls: ['./imageLightbox.component.scss']
})
export class ImageLightboxComponent implements OnInit {
  image: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.image = data.imageData;
   }

  ngOnInit() {
  }

}
