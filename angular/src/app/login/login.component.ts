import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigateService } from '../navigate.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //signal used to display error message
  showError = signal(false);

  //login details form
  loginDetails = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    pass: new FormControl('', [Validators.required]),
  });

  signUpAs = signal('')
  signUpFlag = signal(true);

  constructor(private navigateService: NavigateService, private router: Router, private toast: NgToastService) { }


  ngOnInit(): void {

    //signal values to differentiate between user and organization
    this.signUpAs = this.navigateService.signUpAs
    this.signUpFlag = this.navigateService.signUpFlag
    this.showError = this.navigateService.signInError;


    //update header buttons
    this.navigateService.showLogout = false;
    this.navigateService.showSignIn = true;
    this.navigateService.showSignUp = true;

    this.showError.set(false)
  }



  //change sign in as user or organization
  changeSignUpAs(): void {
    this.showError.set(false)
    this.navigateService.changeSignUpAs();
  }

  //when sign in is clicked
  onSignIn(): void {

    if (!this.loginDetails.valid) {
      this.toast.error({ duration: 1500, detail: "Invalid details", summary: "Invalid details" })
      this.showError.set(true)
      return;
    }

    let { email, pass } = this.loginDetails.value
    this.navigateService.onSignIn(email, pass);
  }

  //go to register component
  goToRegister(): void {
    this.router.navigate(['register'])
  }

}
