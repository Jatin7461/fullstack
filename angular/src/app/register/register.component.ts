import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { NavigateService } from '../navigate.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {


  orgNameRequired: boolean = false;
  emailRequired: boolean = false;
  passwordRequired: boolean = false;
  passMatch: boolean = false;

  emailExists = false;
  userEmailExists = false;

  userNameRequired: boolean = false;
  userEmailRequired: boolean = false;
  userPassRequired: boolean = false;
  userPassConfirmRequired: boolean = false;


  file:File;
  fileName:String='';

  constructor(private navigateService: NavigateService, private dataService: DataService, private router: Router) { }
  ngOnInit(): void {
    this.signUpAs = this.navigateService.signUpAs
    this.signUpFlag = this.navigateService.signUpFlag

  }

  SignUpDetails = new FormGroup({
    "name": new FormControl('', Validators.required),
    "email": new FormControl(''),
    "pass": new FormControl(''),
    "confirmPass": new FormControl(''),
  })


  userSignUpDetails = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    pass: new FormControl(''),
    confirmPass: new FormControl('')
  })

  signUpAs = signal('')
  signUpFlag = signal(true);
  placeholder = signal('')

  changeSignUpAs() {
    this.navigateService.changeSignUpAs();
    console.log(this.signUpFlag());    
  }

  onSignUp() {
    this.emailExists = false;
    let userEvents: any = []

    let formData = new FormData();
    






    let { name, email, pass, confirmPass } = this.SignUpDetails.value;
    console.log(this.SignUpDetails.value);
    if (this.signUpAs() === 'Organization') {


      this.signUpAsOrg({ name, email, pass, confirmPass });
    }
    else {
      let { firstName, lastName, email, pass, confirmPass } = this.userSignUpDetails.value;
      this.signUpAsUser({ firstName, lastName, email, pass, confirmPass })

    }
  }


  goToSignIn() {
    this.router.navigate(['login']);
  }


  signUpAsOrg(org: any) {

    let { name, email, pass, confirmPass } = org;
    if (!name || !email || !pass || pass !== confirmPass) {

      if (!name) {
        this.orgNameRequired = true;
      }

      if (!email) {
        this.emailRequired = true;
      }

      if (!pass) {
        this.passwordRequired = true;
      }

      if (pass !== confirmPass) {
        this.passMatch = true;

      }

      return;
    }


    this.dataService.getOrgs(email).subscribe({
      next: (res) => {

        console.log('res is :', res)
        if (res.payload === null) {
          console.log('email does not exists, signing up')
          this.dataService.addOrganization({ name, email, pass }).subscribe({
            next: (res) => {
              console.log(res);
              this.router.navigate(['login']);
            }
          });

        }
        else {
          this.emailExists = true;
          console.log('org with this email already exists')
        }
      },
      error: (err) => {
        console.log(err);
      }
    })



  }


  signUpAsUser(user: any) {
    this.userEmailExists = false;
    let { firstName, lastName, email, pass, confirmPass } = user;

    console.log(firstName, lastName, email, pass, confirmPass)
    console.log('verifying credentials')
    if (!firstName || !email || !pass || !confirmPass) {

      if (!firstName) {
        this.userNameRequired = true;
      }

      if (!email) {
        this.userEmailRequired = true;
      }

      if (!pass) {
        this.userPassRequired = true;
      }

      if (pass !== confirmPass) {
        this.userPassConfirmRequired = true;
      }

      console.log('nope');
      return;

    }


    this.dataService.getUsers(email).subscribe({
      next: (res) => {

        console.log('payload', res.payload);

        if (res.payload === null) {

          console.log('no email found, registering user')
          this.dataService.addUser({ name: firstName + ' ' + lastName, email, pass, events: [] }).subscribe({
            next: (res) => {
              this.router.navigate(['login']);
            }
          });
        }
        else {
          this.userEmailExists = true;
          console.log('email already exists')
        }

      },
      error: (err) => {
        console.log(err)
      }
    })



  }

  //this method receives file content, read and make it ready for preview
  onChange(file: File){

    if(file){
      this.fileName = file.name;
      this.file = file;
    }

  }




}
