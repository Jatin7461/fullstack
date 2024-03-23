import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {


  //org register form validation variables for ngIf
  orgNameRequired: boolean = false;
  emailRequired: boolean = false;
  passwordRequired: boolean = false;
  passMatch: boolean = false;

  // org and user email validation variables for ngIf
  emailExists = false;
  userEmailExists = false;
  invalidEmail = false;
  userEmailInvalid = false;

  //user register form variables for ngIF
  userNameRequired: boolean = false;
  userEmailRequired: boolean = false;
  userPassRequired: boolean = false;
  userPassConfirmRequired: boolean = false;

  //subscription variables
  getOrgs$: Subscription;
  addOrganization$: Subscription
  getUsers$: Subscription
  addUser$: Subscription




  //form group for organization registeration
  orgSignUpDetails = new FormGroup({
    "name": new FormControl('', [Validators.required]),
    "email": new FormControl('', [Validators.required, Validators.email]),
    "pass": new FormControl('', Validators.required),
    "confirmPass": new FormControl('', Validators.required),
  })

  //form group for user registeration
  userSignUpDetails = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', Validators.required),
    confirmPass: new FormControl('', Validators.required)
  })

  //signals used to differentiate between user and organization
  signUpAs = signal('')
  signUpFlag = signal(true);
  placeholder = signal('')

  toast = inject(NgToastService);
  constructor(private navigateService: NavigateService, private dataService: DataService, private router: Router) {
  }


  ngOnInit(): void {

    //know whether user is registering or organization
    this.signUpAs = this.navigateService.signUpAs
    this.signUpFlag = this.navigateService.signUpFlag


    //set the login, logout
    this.navigateService.showLogout = false;
    this.navigateService.showSignIn = true;
    this.navigateService.showSignUp = true;


  }

  //change sign up as user or organization
  changeSignUpAs(): void {
    this.navigateService.changeSignUpAs();
  }

  //executes when sign up button is clicked
  onSignUp(): void {
    this.emailExists = false;

    //when signing up as an organizatoin
    if (this.signUpAs() === 'Organization') {

      //validate the organization form
      if (!this.orgSignUpDetails.valid) {
        //show a toast message
        this.toast.error({ "detail": "Invalid details", "duration": 1500, "summary": "Invalid details" })
        //validate each value individually
        this.validateOrgForm(this.orgSignUpDetails.value)
        return;
      }

      //if form details are valid then signup
      let { name, email, pass, confirmPass } = this.orgSignUpDetails.value;
      this.signUpAsOrg({ name, email, pass, confirmPass });
    }
    //when signing up as a user/employee
    else {
      //validate the user register form
      if (!this.userSignUpDetails.valid) {
        //show error toast message
        this.toast.error({ "detail": "Invalid details", "duration": 1500, "summary": "Invalid details" })
        //validate each input individually
        this.validateUserForm(this.userSignUpDetails.value)
        return
      }

      //details are valid and register user
      let { firstName, lastName, email, pass, confirmPass } = this.userSignUpDetails.value;
      this.signUpAsUser({ firstName, lastName, email, pass, confirmPass })

    }
  }

  //when user/organization registeration is a success -> navigate to login
  goToSignIn(): void {
    this.router.navigate(['login']);
  }

  //sign up as an organization
  signUpAsOrg(org: any) {

    //fetch all the inputs and validate the form
    let { name, email, pass, confirmPass } = org;
    let validateForm = this.validateOrgForm({ name, email, pass, confirmPass });

    //return if inputs are invalid
    if (!validateForm) {
      this.toast.error({ detail: "ERROR", summary: "Invalid Credentials", duration: 3000 })
      return
    }

    //fetch all the orgs and check if organization with email already exists
    this.getOrgs$ = this.dataService.getOrgs(email).subscribe({
      next: (res) => {
        //if no such organization exists
        if (res.message === "Org not found") {
          //no organization with same email exists -> add the organization
          this.addOrganization$ = this.dataService.addOrganization({ name, email, pass }).subscribe({
            next: (res) => {

              //if organization was successfully added
              if (res.message === 'new org created') {

                //show toast message registeration successful and navigate to login page
                this.toast.success({ summary: "Registeration Successful", duration: 1500, detail: "Registeration Successful" })

                sessionStorage.setItem('register', 'success');
                this.router.navigate(['login']);
              }
              else {

                //show toast message that organization already exists
                this.toast.error({ "detail": "Organization Already Exists", duration: 1500, "summary": "Organization Already Exists" })
              }
            },
            error: (err) => {
              console.log(err)
            }
          });
        }
        else {
          //show toast message that email already exists
          this.toast.error({ "detail": "Email Already Exists", duration: 1500, "summary": "Email Already Exists" })

          //organization with the given email already exists
          this.emailExists = true;
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  //sign up as a user/employee
  signUpAsUser(user: any): void {

    //fetch the user register form inputs and validate them
    this.userEmailExists = false;
    let { firstName, lastName, email, pass, confirmPass } = user;
    let validateForm = this.validateUserForm(user)

    //return if inputs are invalid
    if (!validateForm) {
      this.toast.error({ detail: "ERROR", summary: "Invalid Credentials", duration: 3000 })
      return;
    }


    //check if user already exists
    this.getUsers$ = this.dataService.getUsers(email).subscribe({
      next: (res) => {


        if (res.message === "User Not Found") {
          //user does not exists -> add user
          this.addUser$ = this.dataService.addUser({ name: firstName + ' ' + lastName, email, pass, events: [] }).subscribe({
            next: (res) => {
              sessionStorage.setItem('register', 'success');

              //show toast message when user registeration is successful
              this.toast.success({ "detail": "Registeration Successful", duration: 1500, "summary": "Registeration Successful" })

              this.router.navigate(['login']);
            }
          });
        }
        else {
          //show toast message that email already exists
          this.toast.error({ "detail": "Email Already Exists", duration: 1500, "summary": "Email Already Exists" })

          //user exists -> don't add the user
          this.userEmailExists = true;
        }

      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  //validates the email
  validateEmail(email: String): boolean {

    if (!email) return false;

    //return false if email starts with a number
    if (email[0] >= '0' && email[0] <= '9') return false;

    let len = email.length;
    let findAt = email.indexOf('@')
    let findDot = email.lastIndexOf('.')
    //return false if there is no @ or .
    if (findAt === -1 || findDot === -1 || findDot - findAt === 1 || findAt === 0 || findDot === len - 1 || findDot < findAt) return false;
    return true;

  }


  //validate organization register inputs
  validateOrgForm(org: any): boolean {

    //fetch all inputs and validate them
    let { name, email, pass, confirmPass } = org;

    //validate email
    let validateEmail = this.validateEmail(email);

    //hide error messages when inputs are valid
    if (name) {
      this.orgNameRequired = false;
    }
    if (email) {
      this.emailRequired = false;
    }
    if (validateEmail) {
      this.invalidEmail = false;
    }
    if (pass && pass === confirmPass) {
      this.passwordRequired = false;
    }


    //show errors when inputs are invalid
    if (!name || !email || !pass || pass !== confirmPass || !validateEmail) {
      if (!name) {
        this.orgNameRequired = true;
      }
      if (!pass) {
        this.passwordRequired = true;
      }

      if (pass !== confirmPass) {
        this.passMatch = true;
      }
      if (!validateEmail) {
        this.invalidEmail = true;
      }
      if (!email) {
        this.emailRequired = true;
        this.invalidEmail = false;
      }
      return false;
    }


    //returning true because all inputs are valid
    return true;
  }

  //validate user register inputs
  validateUserForm(user: any): boolean {
    let { firstName, lastName, email, pass, confirmPass } = user;


    //validate the email
    let validateEmail = this.validateEmail(email);

    //hide error when inputs are valid
    if (firstName) {
      this.userNameRequired = false;
    }

    if (email) {
      this.userEmailRequired = false;
    }

    if (validateEmail) {
      this.userEmailInvalid = false;
    }


    if (pass && pass === confirmPass) {
      this.userPassRequired = false;
    }

    //show errors when inputs are not valid
    if (!firstName || !email || !pass || !confirmPass || !validateEmail) {

      if (!firstName) {
        this.userNameRequired = true;
      }

      if (!validateEmail) {
        this.userEmailInvalid = true;
      }

      if (!email) {
        this.userEmailRequired = true;
        this.userEmailInvalid = false;
      }

      if (!pass) {
        this.userPassRequired = true;
      }

      if (pass !== confirmPass) {
        this.userPassConfirmRequired = true;
      }

      return false;

    }

    //returning true because all inputs are valid
    return true;

  }

  //on destroy
  ngOnDestroy(): void {

    //unsubscribe all the subscriptions
    if (this.getOrgs$)
      this.getOrgs$.unsubscribe();
    if (this.addOrganization$)
      this.addOrganization$.unsubscribe();
    if (this.getUsers$)
      this.getUsers$.unsubscribe();
    if (this.addUser$)
      this.addUser$.unsubscribe();
  }






}
