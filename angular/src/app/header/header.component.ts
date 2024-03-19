import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {



  constructor(public navigateService: NavigateService, private dataService: DataService, private router: Router) { }
  ngOnInit(): void {

    //when page is refreshed update header if user is logged in 
    if (localStorage.getItem('token')) {
      this.navigateService.showLogout = true;
      this.navigateService.showSignIn = false;
      this.navigateService.showSignUp = false;
      this.navigateService.companyName.set(localStorage.getItem('companyName'))
    }


  }

  // when user logs out
  onLogout() {

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


    //empty the local storage
    localStorage.clear();

  }

  //go to homepage
  goHome() {

    //update header and to home page
    this.navigateService.showLogout = false;
    this.navigateService.showSignIn = true;
    this.navigateService.showSignUp = true;
    this.router.navigate([''])
  }

}
