import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public isLogged: boolean = null;
  public user: any = null;

  constructor(private route: Router) { }

  ngOnInit() {
    this.getUser();
    this.checkLoggedUser();
  }

  private checkLoggedUser(): void {
    if (!this.user || !Object.keys(this.user).length) {
      this.isLogged = false;
      return;
    }

    this.isLogged = true;
  }

  private getUser(): void {
    this.user = JSON.parse(localStorage.getItem('_auth_info'));
  }

  public async onClick(): Promise<void> {
    localStorage.clear();
    this.user = null;
    await this.route.navigate(['/login']);
  }
}
