import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-passwordRecovery',
  templateUrl: './passwordRecovery.component.html',
  styleUrls: ['./passwordRecovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {
  data: any;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    debugger
    this.route.params.subscribe(params => {
     
    })
  }

}
