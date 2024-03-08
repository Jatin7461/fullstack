import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  userId = signal('');
  userEvents = signal([]);
  userEventsWithIdOnly = signal([]);
  OrgEvents = signal([]);


  headers = { headers: { authorization: localStorage.getItem('token') } }


  constructor(private httpClient: HttpClient) { }

  addUser(user: any) {
    console.log("user added", user);

    return this.httpClient.post("http://localhost:4000/user-api/users", user)
  }

  addOrganization(org: any) {
    console.log("org added", org);
    return this.httpClient.post("http://localhost:4000/org-api/organizations", org)
  }


  getOrgs(email: any) {
    return this.httpClient.get<any>("http://localhost:4000/org-api/organizations/" + email);
  }


  addEvent(event: any) {
    return this.httpClient.post("http://localhost:4000/event-api/events", event, { headers: { authorization: localStorage.getItem('token') } });
  }


  getEvents() {
    console.log("called", this.headers)
    this.headers.headers.authorization = localStorage.getItem('token')
    return this.httpClient.get<any>("http://localhost:4000/event-api/events", { headers: { authorization: localStorage.getItem('token') } });
  }

  getUsers(email: any) {
    console.log("this called")

    let url = `http://localhost:4000/user-api/users?email=${email}`
    return this.httpClient.get<any>(url);
  }


  userLogin(userData: any) {
    return this.httpClient.post<any>('http://localhost:4000/user-api/login', userData);
  }

  loginOrg(orgData: any) {
    return this.httpClient.post<any>('http://localhost:4000/org-api/login', orgData)
  }

  getUserWithId(id: any) {
    let url = `http://localhost:4000/user-api/users/${id}`;
    console.log('getting user with id', id, 'using the url', url, { headers: { authorization: localStorage.getItem('token') } })
    return this.httpClient.get<any>(url, this.headers);
  }

  updateUserWithId(id: any, user: any) {
    let url = `http://localhost:4000/user-api/users/${id}`;

    return this.httpClient.put(url, user, { headers: { authorization: localStorage.getItem('token') } })

  }


  deleteEventWithId(id: string) {

    let url = `http://localhost:4000/event-api/events/${id}`;
    return this.httpClient.delete(url, { headers: { authorization: localStorage.getItem('token') } });

  }


  updateEvent(id: string, event: any) {

    let url = `http://localhost:4000/event-api/events/${id}`;
    console.log('updating event with url', url)
    return this.httpClient.put(url, event, { headers: { authorization: localStorage.getItem('token') } });

  }

}
