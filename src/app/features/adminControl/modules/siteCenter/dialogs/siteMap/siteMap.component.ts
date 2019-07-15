import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-site-map',
  templateUrl: './siteMap.component.html',
  styleUrls: ['./siteMap.component.scss']
})
export class SiteMapComponent implements OnInit {
  @ViewChild('gmap') gMapElement: ElementRef;
  constructor(
    public helperService: HelperService,
              public dialogRef: MatDialogRef<SiteMapComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit() {
    if (this.data.type === true) {
      this.singleSite();
    } else {
      this.showMap();
    }
  }

  showMap() {
    let val = this.helperService.createMap(this.gMapElement, {
      zoom: 15,
      center: {lat: this.data.siteData[0].longitude, lng: this.data.siteData[0].latitude},
    });
    for (let i = 0; i < this.data.siteData.length; i++) {
      this.helperService.addMarker(val, {lat: this.data.siteData[i].longitude, lng: this.data.siteData[i].latitude});
    }
  }

   singleSite() {
     let val = this.helperService.createMap(this.gMapElement);
     this.helperService.addMarker(val, {lat: this.data.siteData.longitude, lng: this.data.siteData.latitude});
  }
}