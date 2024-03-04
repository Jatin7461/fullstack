import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {



  showPastEvents = signal(false);
  showUpcomingEvents = signal(false);
  showOngoingEvents = signal(false);

  pel: any = []
  uel: any = []
  oel: any = []


  //lists of events
  pastEventsList: any = signal([])
  upcomingEventsList: any = signal([])
  ongoingEventsList: any = signal([])

  constructor(public navigateService: NavigateService, private dataService: DataService) { }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
    // this.navigateService.pastEventsList.set([]);
    // this.navigateService.ongoingEventsList.set([]);
    // this.navigateService.upcomingEventsList.set([]);
    console.log('on destroy called')
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');

    this.pastEventsList.set([])
    this.upcomingEventsList.set([])
    this.ongoingEventsList.set([])

    this.showPastEvents = this.navigateService.showPastEvents
    this.showUpcomingEvents = this.navigateService.showUpcomingEvents
    this.showOngoingEvents = this.navigateService.showOngoingEvents

    //arrange all events in their respective lists
    console.log('checking token before getting events', localStorage.getItem('token'))
    this.dataService.getEvents().subscribe({
      next: (res) => {
        console.log('get Events', res);

        let pastList = []
        let upcomingList = []
        let ongoingList = []
        let currDate = new Date().toISOString().slice(0, 10);
        for (let event of res.payload) {
          // console.log(event);
          console.log('company name in event: ', event.company, this.navigateService.companyName())
          if (event.eventDate === currDate) {

            //get the status of the event 
            console.log('calling calculate time')
            let status: string = this.calculateTime(event);
            console.log(event.eventName, status)
            if (status === 'ongoing') {
              // this.navigateService.ongoingEventsList.set(this.navigateService.ongoingEventsList().push(event));
              // this.navigateService.ongoingEventsList.push(event);
              ongoingList.push(event)
            }
            else if (status === 'past') {

              // this.navigateService.pastEventsList.set(this.navigateService.pastEventsList().push(event));
              pastList.push(event)
              // this.navigateService.pastEventsList.push(event);
            }
            else {
              // this.navigateService.upcomingEventsList.set(this.navigateService.upcomingEventsList().push(event));
              upcomingList.push(event)
              // this.navigateService.upcomingEventsList.push(event);
            }



          }
          else if (event.eventDate >= currDate) {
            // this.navigateService.upcomingEventsList.set(this.navigateService.upcomingEventsList().push(event));
            upcomingList.push(event)
            // this.navigateService.upcomingEventsList.push(event);
          }
          else {
            // this.navigateService.pastEventsList.set(this.navigateService.pastEventsList().push(event));
            pastList.push(event)
            // this.navigateService.pastEventsList.push(event)
          }

        }



        this.pastEventsList = this.navigateService.pastEventsList
        this.upcomingEventsList = this.navigateService.upcomingEventsList
        this.ongoingEventsList = this.navigateService.ongoingEventsList


        // this.pastEventsList.set(pastList)
        // this.upcomingEventsList.set(upcomingList)
        // this.ongoingEventsList.set(ongoingList)

        this.uel = upcomingList
        this.pel = pastList
        this.oel = ongoingList

        this.navigateService.uel = this.uel
        this.navigateService.pel = this.pel
        this.navigateService.oel = this.oel

        console.log('uel are:', this.navigateService.uel);
      },
      error: (err) => {
        console.log('the error iss', err);
      }
    })


  }




  calculateTime(event: any): string {

    console.log('inside calculateTime')
    let currDate = new Date();
    let currHour = currDate.getHours();
    console.log('currMin is', currDate.getMinutes())
    let currMin = currDate.getMinutes().toString();
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


    console.log('times', currTime, start, end);
    if (currTime <= end && currTime >= start)
      return 'ongoing'
    if (currTime > end) {
      return 'past';
    }
    else return 'upcoming'





  }


}
