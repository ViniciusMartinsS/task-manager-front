import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public isLogged: boolean = null;

  constructor() { }

  ngOnInit() {
    this.checkLoggedUser();
  }

  private checkLoggedUser(): void {
    const user = this.getUser();

    // @ts-ignore
    if (!Object.keys(user).length) {
      this.isLogged = false;
      return;
    }

    this.isLogged = true;
  }


  private getUser(): void {
    return JSON.parse(localStorage.getItem('_auth_info'));
  }

}
