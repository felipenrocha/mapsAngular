import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/database';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class GetCoordinatesService {


  constructor(private http: HttpClient) { }

  fetchData() {

    var polygonsRef = firebase.database().ref('/Polygons');
    return polygonsRef;


  }
  getInformations(lat: number, lng: number): Observable<Object>{
     return this.http.get<Object>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.apiKey}`)
    
  }

  setData(polygon) {
    return firebase.database().ref('/Polygons').push(polygon);
  }
}