import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from '../../shared/helperService/helper.service';

@Component({
  selector: 'app-imageLightbox',
  templateUrl: './imageLightbox.component.html',
  styleUrls: ['./imageLightbox.component.scss']
})
export class ImageLightboxComponent implements OnInit {
  image: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helperService: HelperService
  ) {
    this.image = this.data.image;
  }

  ngOnInit() {
  }

}
