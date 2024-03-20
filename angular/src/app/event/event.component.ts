import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';
import { Router } from '@angular/router';
import { EditEventService } from '../edit-event.service';
import { Subscription } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit, OnDestroy {


  //event information
  @Input() eventName: any = '';
  @Input() location: any = '';
  @Input() date: any = '';
  @Input() startTime: any = '';
  @Input() endTime: any = '';
  @Input() seats: any = '';
  @Input() eventId: any = '';

  //boolean flags used in template
  @Input() showJoinButton: boolean = false;
  @Input() eventJoined: boolean = false;
  @Input() showRemoveButton: boolean = false;
  @Input() showEditButton: boolean = false;


  //subscription variables
  removeEventFromOrgObs$: Subscription;
  getEventsObs$: Subscription;
  removeEventFromUserObs$: Subscription
  updateUserAfterRemove$: Subscription
  joinEventObs$: Subscription;
  updateUserAfterJoinObs$: Subscription


  constructor(private dataService: DataService, private navigateService: NavigateService, private router: Router, private editEventService: EditEventService, private toast: NgToastService) { }

  ngOnInit(): void {
  }

  //executed when edit event button is clicked
  editEvent(id: string) {

    //initialize the event information signals in navigate service 
    this.navigateService.editEvent.set(true);
    this.editEventService.eventName.set(this.eventName);
    this.editEventService.eventLocation.set(this.location);
    this.editEventService.startTime.set(this.startTime);
    this.editEventService.endTime.set(this.endTime);
    this.editEventService.eventDate.set(this.date);
    this.editEventService.eventId.set(id);
    this.router.navigate(['create-event'])

  }



  //function to remove event from Org
  removeEventFromOrg(id: any) {

    //delete the event from events array
    this.removeEventFromOrgObs$ = this.dataService.deleteEventWithId(id).subscribe({
      next: (res) => {

        //after deleting update the UI Arrays
        this.getEventsObs$ = this.dataService.getEvents().subscribe({
          next: (res) => {

            //declare local arrays to differentiate between past, upcoming and ongoing events
            let pastList: any = []
            let upcomingList: any = []
            let ongoingList: any = []

            //get the current date
            let currDate = new Date().toISOString().slice(0, 10);

            //iterate through events and separate them in diff arrays
            for (let event of res.payload) {
              //if event is today
              if (event.eventDate === currDate) {
                //get the status of event
                let status: string = this.navigateService.calculateTime(event);
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
              //if event is in past
              else {
                pastList.push(event)
              }
            }
            //set the arrays to arrays in navigate service
            this.navigateService.pel = pastList
            this.navigateService.oel = ongoingList
            this.navigateService.uel = upcomingList
          },
          error: (err) => {
            console.log(err);
          }
        })
        this.toast.success({ "duration": 1500, "detail": "Event Removed", "summary": "Event Removed" })
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  //remove event from user 
  removeEventFromUser(id: any) {
    //get the user object from users database
    this.removeEventFromUserObs$ = this.dataService.getUserWithId(this.dataService.userId()).subscribe({
      next: (res) => {

        //store the events in a temp array
        let eventIdList: string[] = res.payload.events;

        //find the index of event id in temp array
        let index = eventIdList.findIndex((eventId: string) => { return eventId === id })

        //remove the event id
        eventIdList.splice(index, 1);

        //update the new events array
        res.payload.events = eventIdList;

        //update the user with new information
        this.updateUserAfterRemove$ = this.dataService.updateUserWithId(this.dataService.userId(), res.payload).subscribe({
          next: (res) => {

            //after updating, remove the event from the UI Array
            let i = this.dataService.userEvents().findIndex((event: any) => {
              return id === event.id;
            })
            this.dataService.userEvents().splice(i, 1);

          }
          ,
          error: (err) => {
            console.log(err);
          }
        })

        this.toast.success({ detail: "Event Removed", summary: "Event Removed", duration: 1500 })
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  removeEvent(id: any) {

    if (this.navigateService.signUpAs() === 'Organization') {
      this.removeEventFromOrg(id);
    }
    else {
      this.removeEventFromUser(id);
    }


  }

  joinEvent(id: string) {
    let userId = this.dataService.userId();

    //get the user object from users database and update the users event array
    this.joinEventObs$ = this.dataService.getUserWithId(userId).subscribe({
      next: (res) => {

        //store events array in a temp variable
        let arrWithEventIds = res.payload.events;
        //check if event id already exists in the array, i.e if the event is already joined or not
        let eventExists = arrWithEventIds.find((eventId: any) => {
          return eventId === id;
        })


        //if event exists then return coz we dont want to join the same event again
        if (eventExists) {
          this.toast.error({ summary: "Event already joined", duration: 1500, detail: "Error" })
          return;
        }



        //push the event id in temp array
        arrWithEventIds.push(id);

        //update the user with updated information
        this.updateUserAfterJoinObs$ = this.dataService.updateUserWithId(userId, res.payload).subscribe({
          next: (res) => {
          },
          error: (err) => {
            console.log('err', err);
          }
        })

        //get list of events id only
        let eventIdList = res.payload.events;

        //create a local array
        let eventsArr: any = [];

        //iterate through all the events and store the events whose ids gets matched
        for (let event of this.dataService.OrgEvents()) {
          for (let eve of eventIdList) {
            if (eve == event['_id']) {
              eventsArr.push(event);
            }
          }
        }

        //set the user events array in the signal
        this.dataService.userEvents.set(eventsArr);

        this.toast.success({ detail: "Event Joined", duration: 1500, summary: "Event Joined" })
      },
      error: (err) => {
        console.log(err);

      }
    })

  }

  //on destroy
  ngOnDestroy(): void {

    //unsubscribe all subscriptions
    if (this.getEventsObs$)
      this.getEventsObs$.unsubscribe();

    if (this.joinEventObs$)
      this.joinEventObs$.unsubscribe();

    if (this.removeEventFromOrgObs$)
      this.removeEventFromOrgObs$.unsubscribe();

    if (this.updateUserAfterRemove$)
      this.updateUserAfterRemove$.unsubscribe();

    if (this.removeEventFromUserObs$)
      this.removeEventFromUserObs$.unsubscribe();

    if (this.updateUserAfterJoinObs$)
      this.updateUserAfterJoinObs$.unsubscribe();
  }

}
