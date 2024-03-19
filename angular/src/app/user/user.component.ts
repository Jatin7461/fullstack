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

  yourEvents = true;
  upcomingEvents = false;

  dataService = inject(DataService)
  router = inject(Router)

  ngOnInit(): void {
    this.userEvents = this.dataService.userEvents
    this.OrgEvents = this.dataService.OrgEvents;

    if (this.dataService.userId() === '') {
      this.dataService.userId.set(localStorage.getItem('userId'));
    }
    this.getUserWithIdObs$ = this.dataService.getUserWithId(this.dataService.userId()).subscribe({
      next: (res) => {

        if (res.message === "Unauthorised access") {
          this.router.navigate(['/home'])
          return;
        }


        let eventIdList = res.payload.events

        let eventsArr: any = [];
        this.dataService.OrgEvents.set(JSON.parse(localStorage.getItem('orgEvents')))
        for (let event of this.dataService.OrgEvents()) {
          for (let eve of eventIdList) {
            if (eve == event['_id']) {
              eventsArr.push(event);
            }
          }
        }

        this.userEvents.set(eventsArr);

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
    localStorage.clear()

    if (this.getUserWithIdObs$)
      this.getUserWithIdObs$.unsubscribe();
  }

}
