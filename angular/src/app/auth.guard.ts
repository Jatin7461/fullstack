import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  let httpClient = inject(HttpClient)
  let router = inject(Router)
  let token = localStorage.getItem('token')
  if (token) {
    console.log("entering verification")

    return httpClient.post<any>("http://localhost:4000/event-api/verify", { token: token }).pipe(
      map((res) => {
        console.log('res is:', res)

        if (res.message === "token valid") {
          console.log("token valid")
          return true;
        }

        router.navigate(['/home'])
        return false;
      })
    )
  }
  router.navigate(['/home'])
  return false;
  // return true;
};
