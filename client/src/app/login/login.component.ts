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


  // signUpAs: string = "Organization";
  // signUpFlag: boolean = true;
  // changeSignUpAs() {
  //   if (this.signUpFlag) {

  //     this.signUpAs = "User"
  //   }
  //   else {

  //     this.signUpAs = "Organization"

  //   }

  //   this.signUpFlag = !this.signUpFlag;
  // }

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
  }



  signUpAs = signal('')
  signUpFlag = signal(true);
  changeSignUpAs() {
    this.navigateService.changeSignUpAs();

  }

  onSignIn() {
    let { email, pass } = this.loginDetails.value

    this.navigateService.onSignIn(email, pass);
  }

  goToRegister() {
    this.router.navigate(['register'])
  }

}
