import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

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


  headers = { headers: { authorization: sessionStorage.getItem(environment.token) } }


  constructor(private httpClient: HttpClient) { }


  //api call to create a new user
  addUser(user: any): Observable<any> {
    return this.httpClient.post(environment.addUserURL, user)
  }

  //api call to create a new organization
  addOrganization(org: any): Observable<any> {
    return this.httpClient.post(environment.addOrgURL, org)
  }

  //api call to get organization with given email
  getOrgs(email: any): Observable<any> {
    return this.httpClient.get<any>(environment.getOrgsURL + email);
  }

  //api call to create a new event
  addEvent(event: any): Observable<any> {
    return this.httpClient.post(environment.addEventURL, event, { headers: { authorization: sessionStorage.getItem(environment.token) } });
  }

  //api call to get all the events
  getEvents(): Observable<any> {
    this.headers.headers.authorization = sessionStorage.getItem(environment.token)
    return this.httpClient.get<any>(environment.getEventsURL, { headers: { authorization: sessionStorage.getItem(environment.token) } });
  }

  //api call to get user with given email
  getUsers(email: any): Observable<any> {

    let url = environment.getUsersURL + email
    return this.httpClient.get<any>(url);
  }

  //api call when user logins
  userLogin(userData: any): Observable<any> {
    return this.httpClient.post<any>(environment.userLoginURL, userData);
  }

  //api call when an organization logins
  loginOrg(orgData: any): Observable<any> {
    return this.httpClient.post<any>(environment.loginOrgURL, orgData)
  }

  //api call to get a user with given id
  getUserWithId(id: any): Observable<any> {
    let url = environment.getUserWithIdURL + id;
    return this.httpClient.get<any>(url, this.headers);
  }

  //api call to update user with given id
  updateUserWithId(id: any, user: any): Observable<any> {
    let url = environment.updateUserWithIdURL + id;

    return this.httpClient.put(url, user, { headers: { authorization: sessionStorage.getItem(environment.token) } })

  }

  //api call to delete event with given id
  deleteEventWithId(id: string): Observable<any> {

    let url = environment.deleteEventWithIdURL + id;
    return this.httpClient.delete(url, { headers: { authorization: sessionStorage.getItem(environment.token) } });

  }

  //api call to update event with given id
  updateEvent(id: string, event: any): Observable<any> {
    let url = environment.updateEventURL + id;
    return this.httpClient.put(url, event, { headers: { authorization: sessionStorage.getItem(environment.token) } });
  }

}
