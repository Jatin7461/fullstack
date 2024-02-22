import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditEventService {

  constructor() { }

  eventName = signal('')
  eventId = signal('')
  eventLocation = signal('')

  eventDate = signal('');
  startTime = signal('');
  endTime = signal('')


}
