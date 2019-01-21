import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-list',
  templateUrl: './navList.component.html',
  styleUrls: ['./navList.component.scss']
})
export class NavListComponent implements OnInit {
  @Input() public navLinks;
  @Input() public navLinksBottom;
  constructor() { }

  ngOnInit() { }
}
