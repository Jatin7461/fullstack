import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, Observable } from 'rxjs';

export const authGu ard: CanActivateFn = (route, state) => {
  let httpClient = inject(HttpClient)
  if (localStorage.getItem('token')) {
    console.log("entering verification")
    return httpClient.post('http://localhost:4000/event-api/verify',{token:localStorage.getItem('token')}).pipe(map((data)=>{

    }))
  }
  let router = inject(Router)
  router.navigate(['/home'])

  // return true;
};
