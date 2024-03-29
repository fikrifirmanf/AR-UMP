import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(private http:HttpClient) { }
  private BASE_URL = "https://apiarump.fikriff.xyz/api/v1/"
  getData():Observable<any>{
    return this.http.get(`${this.BASE_URL}building`).pipe(map((res)=>res),catchError((err)=>{
      console.log(err)
      return throwError(err)
    }),finalize(()=>null),catchError((err)=>{
      console.log(err)
      return of([])
    }),finalize(()=>null));
  }
  getIP():Observable<any>{
    return this.http.get('https://api.ipify.org/?format=json').pipe(map((res)=>res),catchError((err)=>{
      console.log(err)
      return throwError(err)
    }),finalize(()=>null),catchError((err)=>{
      console.log(err)
      return of([])
    }),finalize(()=>null))
  }
}
