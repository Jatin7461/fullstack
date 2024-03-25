import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {


  //signals used to show/hide 
  showPastEvents = signal(false);
  showUpcomingEvents = signal(false);
  showOngoingEvents = signal(false);



  //lists of events
  pastEventsList: any = signal([])
  upcomingEventsList: any = signal([])
  ongoingEventsList: any = signal([])

  //subscription variable
  getEventsObs$: Subscription

  constructor(public navigateService: NavigateService, private dataService: DataService) { }


  ngOnInit(): void {
    //empty the arrays which are used to display to avoid repetition of data
    this.pastEventsList.set([])
    this.upcomingEventsList.set([])
    this.ongoingEventsList.set([])

    //initialize signals used to show/hide events
    this.showPastEvents = this.navigateService.showPastEvents
    this.showUpcomingEvents = this.navigateService.showUpcomingEvents
    this.showOngoingEvents = this.navigateService.showOngoingEvents

    //arrange all events in their respective lists
    this.getEventsObs$ = this.dataService.getEvents().subscribe({
      next: (res) => {


        //create local events array used to separate past,upcoming and ongoing events
        let pastList = []
        let upcomingList = []
        let ongoingList = []

        //get the current data
        let currDate = new Date().toISOString().slice(0, 10);

        //iterate through events and separate them in their respective arrays
        for (let event of res.payload) {

          //if the event is not for the same organization then dont display
          if (event['company'] !== sessionStorage.getItem('companyName')) continue

          //if event is today
          if (event.eventDate === currDate) {

            //get the status of the event 
            let status: string = this.calculateTime(event);

            //add the event according to its time
            if (status === 'ongoing') {
              ongoingList.push(event)
            }
            else if (status === 'past') {
              pastList.push(event)
            }
            else {
              upcomingList.push(event)
            }
          }
          //if event is in future
          else if (event.eventDate >= currDate) {
            upcomingList.push(event)
          }
          //if event is in the past
          else {
            pastList.push(event)
          }

        }

        this.pastEventsList = this.navigateService.pastEventsList
        this.upcomingEventsList = this.navigateService.upcomingEventsList
        this.ongoingEventsList = this.navigateService.ongoingEventsList


       

        //set the respective arrays in the navigate service
        this.navigateService.uel = upcomingList
        this.navigateService.pel = pastList
        this.navigateService.oel = ongoingList


      },
      error: (err) => {
        console.log(err);
      }
    })


  }



  //function used to return the status of the event such as past event, upcoming event or ongoing event
  calculateTime(event: any): string {

    //get current date
    let currDate = new Date();
    //get current hour and minutes
    let currHour = currDate.getHours();
    let currMin = currDate.getMinutes().toString();

    //get start and end time of event
    let start = event.startTime.replace(':', '');
    let end = event.endTime.replace(':', '');

    let currTime = currHour + currMin


    if (currTime.length == 3) {
      currTime = "0" + currTime
    }
    else if (currTime.length == 2)
      currTime = "00" + currTime
    else if (currTime.length == 1)
      currTime = "000" + currTime
    else if (currTime.length == 0)
      currTime = "0000"

    //compare the times and return the status accordingly
    if (currTime <= end && currTime >= start)
      return 'ongoing'
    if (currTime > end) {
      return 'past';
    }
    else return 'upcoming'
  }


  ngOnDestroy(): void {
    //unsubscribe all the events
    if (this.getEventsObs$)
      this.getEventsObs$.unsubscribe();
  }

}
