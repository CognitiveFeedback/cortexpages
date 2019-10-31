import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isAuthenticated: boolean = false;
  path: string = "/about";
  menuExpandToggle: boolean = true;
  constructor(private router: Router, activatedRoute: ActivatedRoute) {

    router.events.subscribe((a: any) => {
      if (a.url !== undefined)
        this.path = a.url;
    });
  }

  ngOnInit() {
    let value = localStorage["authkey"];
    this.isAuthenticated = value == "authenticated";
  }

  navigateTo(path: string): void {
    if (this.path == "/" + path) {
      this.menuExpandToggle = !this.menuExpandToggle;
      return;
    }
    this.path = "/" + path;
    this.menuExpandToggle = true;
    this.router.navigate([path]);
  }

  isOpen(path: string): boolean {
    return this.path.indexOf(path) == 0 && this.menuExpandToggle;
  };
}

