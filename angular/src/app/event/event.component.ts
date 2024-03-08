import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataService } from '../data.service';
// import { error, log } from 'node:console';

import { NavigateService } from '../navigate.service';
import { Router } from '@angular/router';
import { EditEventService } from '../edit-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit, OnDestroy {

  @Input() eventName: any = '';
  @Input() location: any = '';
  @Input() date: any = '';
  @Input() startTime: any = '';
  @Input() endTime: any = '';
  @Input() seats: any = '';
  @Input() eventId: any = '';
  @Input() showJoinButton: boolean = false;
  @Input() eventJoined: boolean = false;
  @Input() showRemoveButton: boolean = false;
  @Input() showEditButton: boolean = false;


  //observable variables
  removeEventFromOrgObs$: Subscription;
  getEventsObs$: Subscription;
  removeEventFromUserObs$: Subscription
  updateUserAfterRemove$: Subscription
  joinEventObs$: Subscription;
  updateUserAfterJoinObs$: Subscription


  constructor(private dataService: DataService, private navigateService: NavigateService, private router: Router, private editEventService: EditEventService) { }

  ngOnInit(): void {

    console.log('eventId', this.eventId)
    console.log('eventName', this.eventName)

  }

  editEvent(id: string) {

    this.navigateService.editEvent.set(true);
    this.editEventService.eventName.set(this.eventName);
    this.editEventService.eventLocation.set(this.location);
    this.editEventService.startTime.set(this.startTime);
    this.editEventService.endTime.set(this.endTime);
    this.editEventService.eventDate.set(this.date);
    this.editEventService.eventId.set(id);
    console.log("event name is ", this.eventName, id)
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


            let pastList: any = []
            let upcomingList: any = []
            let ongoingList: any = []
            let currDate = new Date().toISOString().slice(0, 10);
            for (let event of res.payload) {
              if (event.eventDate === currDate) {

                let status: string = this.navigateService.calculateTime(event);
                console.log(event.eventName, status)
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
              else if (event.eventDate >= currDate) {
                upcomingList.push(event)
              }
              else {
                pastList.push(event)
              }

            }





            this.navigateService.pel = pastList
            this.navigateService.oel = ongoingList
            this.navigateService.uel = upcomingList


            console.log(this.navigateService.uel);

          },
          error: (err) => {
            console.log(err);
          }
        })
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

        console.log("yo sup")
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

    
    console.log('id', id)
    let userId = this.dataService.userId();
    console.log('join clicked')

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
          console.log('not moving forward')
          return;
        }



        //push the event id in temp array
        arrWithEventIds.push(id);

        //update the user with updated information
        this.updateUserAfterJoinObs$ = this.dataService.updateUserWithId(userId, res.payload).subscribe({
          next: (res) => {
            console.log('res', res);
          },
          error: (err) => {
            console.log('err', err);
          }
        })


        let eventIdList = res.payload.events;

        console.log(res);
        console.log(eventIdList);
        let eventsArr: any = [];
        for (let event of this.dataService.OrgEvents()) {
          for (let eve of eventIdList) {
            if (eve == event['_id']) {
              eventsArr.push(event);
            }
          }
        }
        console.log('executing')
        this.dataService.userEvents.set(eventsArr);
      },
      error: (err) => {
        console.log(err);

      }
    })

  }

  ngOnDestroy(): void {

  //   console.log("event ondestroy")

  //   console.log(this.getEventsObs$, this.joinEventObs$,
  //     this.removeEventFromOrgObs$, this.updateUserAfterJoinObs$,
  //     this.removeEventFromUserObs$, this.updateUserAfterRemove$
  //   )
  
  //   this.getEventsObs$.unsubscribe();
  //   this.joinEventObs$.unsubscribe();
  //   this.removeEventFromOrgObs$.unsubscribe();
  //   this.updateUserAfterRemove$.unsubscribe();
  //   this.removeEventFromUserObs$.unsubscribe();
  //   this.updateUserAfterJoinObs$.unsubscribe();
  }

}
