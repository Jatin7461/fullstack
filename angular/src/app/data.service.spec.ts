import { HttpClientModule } from "@angular/common/http"
import { fakeAsync, TestBed } from "@angular/core/testing"
import { DataService } from "./data.service";

import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing"

fdescribe('DataService', () => {

  let service, httpTestingContoller: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    })

    service = TestBed.inject(DataService)
    httpTestingContoller = TestBed.inject(HttpTestingController)
  })

  it('should add a user', () => {
    let user = {
      name: "jatin",
      email: "jatin@gmail.com",
      password: "jatin",
      events: []
    }
    console.log("adding user lol")
    service.addUser(user).subscribe({
      next: (res) => {
        console.log('hihi', res)
        expect(res).toBeTruthy()
        expect(res.name).toBe(user.name)
        expect(res.email).toBe(user.email)
      },
      error: (err) => {

        console.log('hihi err', err)
      }
    })

    const req = httpTestingContoller.expectOne('http://localhost:4000/user-api/users')
    expect(req.request.method).toEqual("POST")
    req.flush(user)
  })



  it('should get user with id', () => {

    let user = {
      _id: "65d468f59aff01c4701737cd",
      name: "jatin",
      email: "jatin@gmail.com",
      password: "1234",
      events: []
    }

    service.getUserWithId("65d468f59aff01c4701737cd").subscribe({
      next: (res) => {
        console.log("resres", res)
        expect(res).toBeTruthy()
        expect(res._id).toBe(user._id)
        expect(res.name).toBe(user.name)
      },
      error: (err) => {
        console.log("error in id")

        expect(err).toBeTruthy()
      }
    })


    const req = httpTestingContoller.expectOne('http://localhost:4000/user-api/users/65d468f59aff01c4701737cd')
    expect(req.request.method).toEqual("GET")
    req.flush(user)
  })


  it('Should add an Organization', () => {
    let org = {
      name: "Cognizant",
      email: "cts@gmail.com",
      pass: "cts123"
    }
    service.addOrganization(org).subscribe({
      next: (res) => {
        expect(res).toBeTruthy();
        expect(res.name).toBe(org.name)
        expect(res.email).toBe(org.email)
        expect(res.pass).toBe(org.pass)
      },
    })


    const req = httpTestingContoller.expectOne("http://localhost:4000/org-api/organizations")
    expect(req.request.method).toEqual("POST")
    req.flush(org);
  })




})



