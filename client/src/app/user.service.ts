import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  userLoginStatus = new BehaviorSubject<boolean>(false)

  currentUser = new BehaviorSubject<User>({
    username:'',
    password:'',
    email:'',
    dob:'',
  })

//local vs session storage vs cookies


  


}
