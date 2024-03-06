import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit, OnDestroy {


  getUserWithIdObs$: Subscription

  userEvents: any = signal([])
  OrgEvents = signal([])

  yourEvents = false;
  upcomingEvents = false;

  dataService = inject(DataService)
  router = inject(Router)

  ngOnInit(): void {
    this.userEvents = this.dataService.userEvents
    this.OrgEvents = this.dataService.OrgEvents;

    if (this.dataService.userId() === '') {
      this.dataService.userId.set(localStorage.getItem('userId'));
    }
    console.log('user id is', this.dataService.userId())
    this.getUserWithIdObs$ = this.dataService.getUserWithId(this.dataService.userId()).subscribe({
      next: (res) => {

        if (res.message === "Unauthorised access") {
          this.router.navigate(['/home'])
          return;
        }

        console.log('res after joining', res)

        let eventIdList = res.payload.events

        console.log(res);
        console.log(eventIdList);
        let eventsArr: any = [];
        this.dataService.OrgEvents.set(JSON.parse(localStorage.getItem('orgEvents')))
        console.log('orgevents are:', typeof (this.dataService.OrgEvents()), this.dataService.OrgEvents())
        for (let event of this.dataService.OrgEvents()) {
          for (let eve of eventIdList) {
            if (eve == event['_id']) {
              eventsArr.push(event);
            }
          }
        }

        this.userEvents.set(eventsArr);
        console.log('userevent array in user component is ', this.userEvents())

      },
      error: (err) => {
        console.log('error', err)
      }
    })
  }


  onYourEvents() {
    this.yourEvents = true;
    this.upcomingEvents = false;
  }

  onUpcomingEvents() {
    this.yourEvents = false;
    this.upcomingEvents = true
  }

  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    console.log('user component destroyed')
    localStorage.removeItem('orgEvents')
    localStorage.removeItem('userId')
    localStorage.removeItem('companyName')
    localStorage.removeItem('token')
    this.getUserWithIdObs$.unsubscribe();
  }

}
