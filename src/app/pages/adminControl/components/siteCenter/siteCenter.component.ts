import { Component, OnInit } from '@angular/core';
import { Translation } from '../../../../models/translate.model';
import { HelperService } from '../../../../shared/helperService/helper.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-siteCenter',
  templateUrl: './siteCenter.component.html',
  styleUrls: ['./siteCenter.component.scss']
})
export class SiteCenterComponent implements OnInit {

  translated: Translation;
  appIcons: any;
  private sites = new BehaviorSubject<any>(1);
  siteObserver = this.sites.asObservable();
  constructor(
    public helperService: HelperService,
  ) { 
    this.translated = this.helperService.translation;
    this.appIcons = this.helperService.constants.appIcons;
  }

  ngOnInit() {
  }

  changeSites(sitesInfo:any){
    this.sites.next(sitesInfo)
  }
  

}
