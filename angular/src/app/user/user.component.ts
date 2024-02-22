import { Component, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {



  userEvents: any = signal([])
  OrgEvents = signal([])

  yourEvents = false;
  upcomingEvents = false;

  dataService = inject(DataService)

  ngOnInit(): void {
    this.userEvents = this.dataService.userEvents
    this.OrgEvents = this.dataService.OrgEvents;

    this.dataService.getUserWithId(this.dataService.userId()).subscribe({
      next: (res) => {

        console.log('res after joining', res)

        let eventIdList = res.payload.events

        console.log(res);
        console.log(eventIdList);
        let eventsArr: any = [];
        console.log('orgevents are:', typeof (this.dataService.OrgEvents()))
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

}
