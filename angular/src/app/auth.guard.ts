import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  //inject the services needed
  let httpClient = inject(HttpClient)
  let router = inject(Router)

  //get the token from local storage
  let token = localStorage.getItem('token')

  //if token exists then verify the token
  if (token) {
    //make an api call to verify if the token is valid or not
    return httpClient.post<any>("http://localhost:4000/event-api/verify", { token: token }).pipe(
      map((res) => {
        //if token is valid then return true
        if (res.message === "token valid") {
          return true;
        }

        //if token not valid then navigate to home page and return false;
        router.navigate(['/home'])
        return false;
      })
    )
  }

  //if token does not exists then navigate to home page
  router.navigate(['/home'])
  return false;
};
