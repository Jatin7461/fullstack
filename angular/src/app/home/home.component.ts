import { Component, OnInit } from '@angular/core';
import { NavigateService } from '../navigate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private navigateService: NavigateService) {

  }
  ngOnInit(): void {
    //update header buttons
    this.navigateService.showLogout = false;
    this.navigateService.showSignIn = true;
    this.navigateService.showSignUp = true;
  }

}
