import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditEventService {

  constructor() { }

  //signals used to store all events details
  eventName = signal('')
  eventId = signal('')
  eventLocation = signal('')

  eventDate = signal('');
  startTime = signal('');
  endTime = signal('')


}
