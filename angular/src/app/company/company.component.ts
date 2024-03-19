import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NavigateService } from '../navigate.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  constructor(private navigateService: NavigateService, private router: Router) {

  }
  ngOnInit(): void {
    this.companyName.set(this.navigateService.companyName())
  }

  //signal used to store company name
  companyName = signal('');

  //executes when past events is clicked
  onPastEvents() {
    this.navigateService.onPastEvents();
  }

  //executes when upcoming events is clicked
  onUpcomingEvents() {
    this.navigateService.onUpcomingEvents();
  }

  //executes when ongoing events is clicked
  onOngoingEvents() {
    this.navigateService.onOngoingEvents();
  }


  //executes when create new event is clicked
  createNewEvent() {
    this.navigateService.editEvent.set(false);
    this.router.navigate(['create-event'])
  }


}
