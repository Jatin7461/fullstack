import { Injectable, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from './data.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class NavigateService implements OnInit, OnDestroy {

  constructor(private router: Router, private dataService: DataService, private toast: NgToastService) { }


  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }


  //subscription variables
  userLoginObs$: Subscription;
  OrgLoginObs$: Subscription;
  getEventsObs$: Subscription;

  //boolean variables used to show/hide header buttons
  showSignUp = true
  showSignIn = true
  showLogout = false

  //signal to differentiate between event getting edited or not
  editEvent = signal(false)

  //boolean signals used to show/hide respective events category
  showPastEvents = signal(true);
  showUpcomingEvents = signal(false);
  showOngoingEvents = signal(false);

  //array signals used to display the list of events
  pastEventsList: any = signal([])
  upcomingEventsList: any = signal([])
  ongoingEventsList: any = signal([])

  //string signal which stores the company name
  companyName = signal('');

  //boolean signal used to show sign in error display
  signInError = signal(false);

  //string signal used to differentiate between user and organization
  signUpAs = signal("Organization")

  placeholder = signal('')

  //used to differentiate between registeration form
  signUpFlag = signal(true);

  pel = []
  oel = []
  uel = []


  //change sign up as user or organization
  changeSignUpAs():void {

    //using boolean signal to differentiate between user and organization
    if (this.signUpFlag()) {
      this.signUpAs.set("User")
      this.placeholder.set("User Name")
    }
    else {
      this.signUpAs.set("Organization")
    }

    //change boolean value after every click
    this.signUpFlag.set(!this.signUpFlag());
  }



  //when user or organization clicks on sign in
  onSignIn(email: any, pass: any): void {



    //when signin in as an organization
    if (this.signUpAs() === "Organization") {
      //call organization login api
      this.OrgLoginObs$ = this.dataService.loginOrg({ email, pass }).subscribe({
        next: (res) => {

          //when organization credentials are wrong
          if (!res.payload) {
            this.signInError.set(true);
            this.toast.error({ detail: "ERROR", summary: "Invalid Credentials", duration: 3000 })
          }
          //when organization credentials are correct
          else {
            //set token in local storage
            localStorage.setItem('token', res.token)
            //set company name
            this.companyName.set(res.payload.name);
            //set sign in error notification signal
            this.signInError.set(false);

            //set the header buttons
            this.showLogout = true;
            this.showSignIn = false;
            this.showSignUp = false;
            localStorage.setItem('companyName', res.payload.name)

            //navigate to the company component
            this.router.navigate(['company']);
          }
        },
        error: (err) => {
          console.log(err)
        }


      })
    }
    //when sign in as user
    else {

      //call user login api
      this.userLoginObs$ = this.dataService.userLogin({ email, password: pass }).subscribe({
        next: (res) => {
          //when the user credentials are correct
          if (res.message === "Login Success") {

            //set signals used in data service
            this.dataService.userId.set(res.payload._id);
            this.dataService.userEvents.set(res.payload.events);

            let token = res.token;
            //set token and user id in local storage
            localStorage.setItem('token', token)
            localStorage.setItem('userId', res.payload._id)

            //get all the events which user has subscribed to and save it in data service signals
            this.getEventsObs$ = this.dataService.getEvents().subscribe({
              next: (res) => {
                let arr: any = []
                for (let event of res.payload) {
                  for (let userEvent of this.dataService.userEventsWithIdOnly()) {
                    if (userEvent === event['id'])
                      arr.push(event);
                  }
                }
                this.dataService.OrgEvents.set(res.payload);
                this.dataService.userEvents.set(arr);

                localStorage.setItem('orgEvents', JSON.stringify(res.payload))
                //set header buttons
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
          //when the user credentials are wrong
          else {
            this.toast.error({ detail: "ERROR", summary: "Invalid Credentials", duration: 3000 })
            this.signInError.set(true)
          }
        },
        error: (err) => {
          console.log(err);
        }
      })

    }
  }




  //show past events
  onPastEvents():void {
    this.showPastEvents.set(true)
    this.showUpcomingEvents.set(false)
    this.showOngoingEvents.set(false)
  }

  //show upcoming events
  onUpcomingEvents():void {

    this.showUpcomingEvents.set(true)
    this.showPastEvents.set(false)
    this.showOngoingEvents.set(false)
  }

  //show ongoing events
  onOngoingEvents():void {
    this.showOngoingEvents.set(true)
    this.showPastEvents.set(false)
    this.showUpcomingEvents.set(false)
  }





  //function used to differentiate events timing
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


    if (currTime <= end && currTime >= start)
      return 'ongoing'
    if (currTime > end) {
      return 'past';
    }
    else return 'upcoming'
  }

  ngOnDestroy(): void {

    if (this.OrgLoginObs$)
      this.OrgLoginObs$.unsubscribe();
    if (this.userLoginObs$)
      this.userLoginObs$.unsubscribe()
    if (this.getEventsObs$)
      this.getEventsObs$.unsubscribe()
  }

}
