import { Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {

  constructor(private router: Router, private dataService: DataService) { }




  showSignUp = true
  showSignIn = true
  showLogout = false


  editEvent = signal(false)


  showPastEvents = signal(true);
  showUpcomingEvents = signal(false);
  showOngoingEvents = signal(false);

  pastEventsList: any = signal([])
  upcomingEventsList: any = signal([])
  ongoingEventsList: any = signal([])

  pel = []
  oel = []
  uel = []


  companyName = signal('');
  signInError = signal(false);

  signUpAs = signal("Organization")
  placeholder = signal('')

  signUpFlag = signal(true);

  changeSignUpAs() {
    if (this.signUpFlag()) {

      this.signUpAs.set("User")
      this.placeholder.set("User Name")
    }
    else {

      this.signUpAs.set("Organization")
    }

    this.signUpFlag.set(!this.signUpFlag());
  }


  onSignIn(email: any, pass: any) {
    if (this.signUpAs() === "Organization") {


      this.dataService.getOrgs(email).subscribe({
        next: (res) => {
          if (!res[0] || !email || !pass) {
            this.signInError.set(true);
          }
          else {

            this.companyName.set(res[0].name);
            this.signInError.set(false);
            this.showLogout = true;
            this.showSignIn = false;
            this.showSignUp = false;
            this.router.navigate(['company']);
          }
        },
        error: (err) => {
          console.log(err)
        }


      })
    }
    else {

      this.dataService.getUsers(email).subscribe({
        next: (res) => {
          if (res[0] && email && pass) {
            this.dataService.userId.set(res[0].id);
            this.dataService.userEvents.set(res[0].events);

            // this.dataService.getEvents().subscribe({
            //   next:(res)=>{

            //   },
            //   error:(err)=>{
            //     console.log(err);
            //   }
            // })

            this.dataService.getEvents().subscribe({
              next: (res) => {

                let arr: any = []
                for (let event of res) {
                  for (let userEvent of this.dataService.userEventsWithIdOnly()) {
                    if (userEvent === event['id'])
                      arr.push(event);
                  }
                }
                console.log('res is ', res);
                this.dataService.OrgEvents.set(res);
                // this.OrgEvents = (res);


                this.dataService.userEvents.set(arr);
                this.showLogout = true;
                this.showSignIn = false;
                this.showSignUp = false;
                this.router.navigate(['user']);
                this.signInError.set(false)

              },
              error: (err) => {
                console.log(err);
              }
            })

          }
          else {
            this.signInError.set(true)
          }
        },
        error: (err) => {
          console.log(err);
        }
      })

    }
  }


  validateCredentials() {

  }


  onPastEvents() {

    this.showPastEvents.set(true)
    this.showUpcomingEvents.set(false)
    this.showOngoingEvents.set(false)





  }

  onUpcomingEvents() {

    this.showUpcomingEvents.set(true)
    this.showPastEvents.set(false)
    this.showOngoingEvents.set(false)




  }

  onOngoingEvents() {
    this.showOngoingEvents.set(true)
    this.showPastEvents.set(false)
    this.showUpcomingEvents.set(false)



  }




  organizeEvents() {

  }

  calculateTime(event: any): string {


    let currDate = new Date();
    let currHour = currDate.getHours();
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
