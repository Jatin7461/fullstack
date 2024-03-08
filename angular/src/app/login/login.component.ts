import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigateService } from '../navigate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  showError = signal(false);


  loginDetails = new FormGroup({
    email: new FormControl('', Validators.required),
    pass: new FormControl(''),
  });

  constructor(private navigateService: NavigateService, private router: Router) { }


  ngOnInit(): void {
    this.signUpAs = this.navigateService.signUpAs
    this.signUpFlag = this.navigateService.signUpFlag
    this.showError = this.navigateService.signInError;

    this.navigateService.showLogout = false;
    this.navigateService.showSignIn = true;
    this.navigateService.showSignUp = true;
  }



  signUpAs = signal('')
  signUpFlag = signal(true);

  //change sign in as user or organization
  changeSignUpAs() {
    console.log('sign in not sign up')
    this.navigateService.changeSignUpAs();
  }

  //when sign in is clicked
  onSignIn() {
    let { email, pass } = this.loginDetails.value
    this.navigateService.onSignIn(email, pass);
  }

  //go to register component
  goToRegister() {
    this.router.navigate(['register'])
  }

}
