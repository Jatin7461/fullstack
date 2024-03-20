import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';
import { EditEventService } from '../edit-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit, OnDestroy {

  //Subscription variables
  addEventObs$: Subscription;
  updateEventObs$: Subscription

  //boolean flag if event is getting edited or not
  editEvent = signal(false)

  //name of event
  eventName = signal('');


  //boolean flags used in template
  eventNameRequired: boolean = false
  eventLocationRequired: boolean = false
  eventDateRequired: boolean = false
  eventStartTimeRequired: boolean = false
  eventEndTimeRequired: boolean = false

  //event form group
  eventDetails = new FormGroup({
    eventName: new FormControl(''),
    eventDate: new FormControl(''),
    location: new FormControl(''),
    startTime: new FormControl(''),
    endTime: new FormControl('')
  })


  constructor(private dataService: DataService,
    private router: Router, private navigateService: NavigateService, private editEventService: EditEventService) { }



  ngOnInit(): void {

    //initialize edit event to true/false
    //initialize event name
    this.editEvent = this.navigateService.editEvent
    this.eventName = this.editEventService.eventName

    //if editing event then initialize form values
    if (this.editEvent()) {
      this.eventDetails.setValue({
        eventName: this.eventName(),
        eventDate: this.editEventService.eventDate(),
        location: this.editEventService.eventLocation(),
        startTime: this.editEventService.startTime(),
        endTime: this.editEventService.endTime()
      })
    }
    this.editEvent = this.navigateService.editEvent;
  }

  //update event function
  updateEvent() :void{
    //fetch event form inputs
    let { eventName, eventDate, location, startTime, endTime } = this.eventDetails.value

    //update the event
    this.updateEventObs$ = this.dataService.updateEvent(this.editEventService.eventId(), { "company": this.navigateService.companyName(), eventName, eventDate, location, startTime, endTime }).subscribe({
      next: (res) => {
        //navigate back to company component
        this.router.navigate(['company']);
      },
      error: (err) => {
        console.log('error in updating event', err);
      }
    });
  }


  //create new event
  onCreateEvent():void {

    //fetch event form inputs
    let { eventName, eventDate, location, startTime, endTime } = this.eventDetails.value

    //validate inputs
    if (!eventName || !eventDate || !location || !startTime || !endTime) {
      if (!eventName) this.eventNameRequired = true;

      if (!eventDate) this.eventDateRequired = true

      if (!location) this.eventLocationRequired = true


      if (!startTime) this.eventStartTimeRequired = true


      if (!endTime) this.eventEndTimeRequired = true;

      return;
    }

    //add a new event and subscribe
    this.addEventObs$ = this.dataService.addEvent({ "company": this.navigateService.companyName(), eventName, eventDate, location, startTime, endTime }).subscribe({
      next: (res) => {
        //navigate back to company component
        this.router.navigate(['company'])
      },
      error: (err) => {
        console.log(err)
      }
    });


  }


  //on destroy
  ngOnDestroy(): void {

    //unsubscribe all the subscriptions
    if (this.addEventObs$)
      this.addEventObs$.unsubscribe();
    if (this.updateEventObs$)
      this.updateEventObs$.unsubscribe();
  }
}
