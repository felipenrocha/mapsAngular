import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/database';
interface Coordinate {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})

export class GetCoordinatesService {


  constructor() { }

  fetchData() {

    var polygonsRef = firebase.database().ref('/Polygons');
    
   /* leadsRef.on('value', function (snapshot) {
      console.log(snapshot.val())
      r    }); */
    return polygonsRef;


  }

  setData(polygon) {
    return firebase.database().ref('/Polygons').push(polygon);
  }
}