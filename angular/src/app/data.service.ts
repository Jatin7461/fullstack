import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //signal used to store user id
  userId = signal('');

  //signal used to store user events
  userEvents = signal([]);

  //signal used to store the user events 
  userEventsWithIdOnly = signal([]);

  //signal used to store organization events
  OrgEvents = signal([]);


  headers = { headers: { authorization: sessionStorage.getItem('token') } }


  constructor(private httpClient: HttpClient) { }


  //api call to create a new user
  addUser(user: any): Observable<any> {
    return this.httpClient.post("http://localhost:4000/user-api/users", user)
  }

  //api call to create a new organization
  addOrganization(org: any): Observable<any> {
    return this.httpClient.post("http://localhost:4000/org-api/organizations", org)
  }

  //api call to get organization with given email
  getOrgs(email: any): Observable<any> {
    return this.httpClient.get<any>("http://localhost:4000/org-api/organizations/" + email);
  }

  //api call to create a new event
  addEvent(event: any): Observable<any> {
    return this.httpClient.post("http://localhost:4000/event-api/events", event, { headers: { authorization: sessionStorage.getItem('token') } });
  }

  //api call to get all the events
  getEvents(): Observable<any> {
    this.headers.headers.authorization = sessionStorage.getItem('token')
    return this.httpClient.get<any>("http://localhost:4000/event-api/events", { headers: { authorization: sessionStorage.getItem('token') } });
  }

  //api call to get user with given email
  getUsers(email: any): Observable<any> {

    let url = `http://localhost:4000/user-api/users?email=${email}`
    return this.httpClient.get<any>(url);
  }

  //api call when user logins
  userLogin(userData: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:4000/user-api/login', userData);
  }

  //api call when an organization logins
  loginOrg(orgData: any): Observable<any> {
    return this.httpClient.post<any>('http://localhost:4000/org-api/login', orgData)
  }

  //api call to get a user with given id
  getUserWithId(id: any): Observable<any> {
    let url = `http://localhost:4000/user-api/users/${id}`;
    return this.httpClient.get<any>(url, this.headers);
  }

  //api call to update user with given id
  updateUserWithId(id: any, user: any): Observable<any> {
    let url = `http://localhost:4000/user-api/users/${id}`;

    return this.httpClient.put(url, user, { headers: { authorization: sessionStorage.getItem('token') } })

  }

  //api call to delete event with given id
  deleteEventWithId(id: string) :Observable<any>{

    let url = `http://localhost:4000/event-api/events/${id}`;
    return this.httpClient.delete(url, { headers: { authorization: sessionStorage.getItem('token') } });

  }

  //api call to update event with given id
  updateEvent(id: string, event: any):Observable<any> {
    let url = `http://localhost:4000/event-api/events/${id}`;
    return this.httpClient.put(url, event, { headers: { authorization: sessionStorage.getItem('token') } });
  }

}
