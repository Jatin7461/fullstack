import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, OnDestroy {

  //subscription variable
  getUserWithIdObs$: Subscription

  //signals used to store user events and org events
  userEvents: any = signal([])
  OrgEvents = signal([])

  //boolean variables used to show/hide events tabs
  yourEvents = true;
  upcomingEvents = false;


  //inject services
  dataService = inject(DataService)
  router = inject(Router)

  ngOnInit(): void {

    //initialize the signals
    this.userEvents = this.dataService.userEvents
    this.OrgEvents = this.dataService.OrgEvents;


    //when refreshed restore the user id
    if (this.dataService.userId() === '') {
      this.dataService.userId.set(sessionStorage.getItem(environment.userId));
    }

    //api call to get the user with id
    this.getUserWithIdObs$ = this.dataService.getUserWithId(this.dataService.userId()).subscribe({
      next: (res) => {

        //if token expired then redirect to home page
        if (res.message === "Unauthorised access") {
          this.router.navigate(['/home'])
          return;
        }

        //store event id list in a local variable
        let eventIdList = res.payload.events

        let eventsArr: any = [];

        //store the organizations events in a signal when page is refreshed
        this.dataService.OrgEvents.set(JSON.parse(sessionStorage.getItem(environment.orgEvents)))

        //iterate through all organizations events and store the user events in a local array
        for (let event of this.dataService.OrgEvents()) {
          for (let eve of eventIdList) {
            if (eve == event['_id']) {
              eventsArr.push(event);
            }
          }
        }

        //set the user events in a signal
        this.userEvents.set(eventsArr);

      },
      error: (err) => {
        console.log('error', err)
      }
    })
  }


  //function to show your events tab
  onYourEvents(): void {
    this.yourEvents = true;
    this.upcomingEvents = false;
  }

  //function to show upcoming events tab
  onUpcomingEvents(): void {
    this.yourEvents = false;
    this.upcomingEvents = true
  }

  //on destroy
  ngOnDestroy(): void {
    //clear the session storage
    sessionStorage.clear();


    //unsubscribe the subscriptions
    if (this.getUserWithIdObs$)
      this.getUserWithIdObs$.unsubscribe();
  }

}
