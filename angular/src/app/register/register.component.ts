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


  file: File;
  fileName: String = '';

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

  //form group for organization registeration
  orgSignUpDetails = new FormGroup({
    "name": new FormControl('', [Validators.required]),
    "email": new FormControl('', [Validators.required, Validators.email]),
    "pass": new FormControl(''),
    "confirmPass": new FormControl(''),
  })

  //form group for user registeration
  userSignUpDetails = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', Validators.email),
    pass: new FormControl(''),
    confirmPass: new FormControl('')
  })


  signUpAs = signal('')
  signUpFlag = signal(true);
  placeholder = signal('')

  //change sign up as user or organization
  changeSignUpAs() {
    this.navigateService.changeSignUpAs();
  }

  //executes when sign up button is clicked
  onSignUp() {
    this.emailExists = false;
    this.toast.success({ detail: "SUCCESS", summary: "yo", duration: 3000 })

    //when signing up as an organizatoin
    if (this.signUpAs() === 'Organization') {
      let { name, email, pass, confirmPass } = this.orgSignUpDetails.value;
      this.signUpAsOrg({ name, email, pass, confirmPass });
    }
    //when signing up as a user/employee
    else {
      let { firstName, lastName, email, pass, confirmPass } = this.userSignUpDetails.value;
      this.signUpAsUser({ firstName, lastName, email, pass, confirmPass })

    }
  }

  //when user/organization registeration is a success -> navigate to login
  goToSignIn() {
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

        if (res.payload === null) {
          //no organization with same email exists -> add the organization
          this.addOrganization$ = this.dataService.addOrganization({ name, email, pass }).subscribe({
            next: (res) => {
              localStorage.setItem('register', 'success');
              this.router.navigate(['login']);
            }
          });

        }
        else {
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
  signUpAsUser(user: any) {

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


        if (res.payload === null) {
          //user does not exists -> add user
          this.addUser$ = this.dataService.addUser({ name: firstName + ' ' + lastName, email, pass, events: [] }).subscribe({
            next: (res) => {
              localStorage.setItem('register', 'success');
              this.router.navigate(['login']);
            }
          });
        }
        else {
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
  validateEmail(email: String) {

    if (!email) return false;

    //return false if email starts with a number
    if (email[0] >= '0' && email[0] <= '9') return false;

    let str = 0, atIndex = 0, len = email.length;
    let findAt = email.indexOf('@')
    let findDot = email.lastIndexOf('.')
    //return false if there is no @ or .
    if (findAt === -1 || findDot === -1 || findDot - findAt === 1 || findAt === 0 || findDot === len - 1 || findDot < findAt) return false;
    return true;

  }


  //validate organization register inputs
  validateOrgForm(org) {

    //fetch all inputs and validate them
    let { name, email, pass, confirmPass } = org;
    let validateEmail = this.validateEmail(email);

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

    return true;
  }

  //validate user register inputs
  validateUserForm(user) {
    let { firstName, lastName, email, pass, confirmPass } = user;



    let validateEmail = this.validateEmail(email);

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
