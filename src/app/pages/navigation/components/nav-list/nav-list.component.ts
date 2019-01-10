import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-nav-list",
  templateUrl: "./nav-list.component.html",
  styleUrls: ["./nav-list.component.scss"]
})
export class NavListComponent implements OnInit {
  @Input() public navLinks;
  @Input() public navLinksBottom;
  constructor() {}

  ngOnInit() {}
}
