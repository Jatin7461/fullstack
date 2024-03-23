import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {



  constructor(public navigateService: NavigateService, private dataService: DataService, private router: Router, private toast: NgToastService) { }
  ngOnInit(): void {

    //when page is refreshed update header if user is logged in 
    if (sessionStorage.getItem('token')) {
      this.navigateService.showLogout = true;
      this.navigateService.showSignIn = false;
      this.navigateService.showSignUp = false;
      this.navigateService.companyName.set(sessionStorage.getItem('companyName'))
    }


  }

  // when user logs out
  onLogout(): void {

    //empty all the events array
    this.navigateService.pastEventsList = ([])
    this.navigateService.upcomingEventsList = ([])
    this.navigateService.ongoingEventsList = ([])


    //update header buttons
    this.navigateService.showLogout = false;
    this.navigateService.showSignIn = true;
    this.navigateService.showSignUp = true;

    //update signal values
    this.dataService.userId.set('')
    this.dataService.userEvents.set([])
    this.dataService.userEventsWithIdOnly.set([])
    this.dataService.OrgEvents.set([])


    //show toast message when loging out
    this.toast.success({ "detail": "Logout Successful", duration: 1500, "summary": "Logout Successful" })


    //empty the local storage
    sessionStorage.clear()

  }

  //go to homepage
  goHome(): void {

    //update header and to home page
    this.navigateService.showLogout = false;
    this.navigateService.showSignIn = true;
    this.navigateService.showSignUp = true;
    this.router.navigate([''])
  }

}
