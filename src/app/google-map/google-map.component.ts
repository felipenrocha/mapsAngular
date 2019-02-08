
/// <reference types="@types/googlemaps" />
import { Polygon } from './../models/googleMaps';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GetCoordinatesService } from '../get-coordinates.service';
import { Location, Color } from '../models/googleMaps'




let firebase = require("firebase/app");
require("firebase/database");

function loadPolygons(polygon) {
  // console.log(polygon);

  var newPolygon = new google.maps.Polygon({
    paths: polygon['coordinates'],
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 0.7,
    fillColor: polygon['color'],
    fillOpacity: 0.6
  });
  newPolygon.setMap(map);
  newPolygon.addListener('click', function(polygon){
    let c = confirm("Deseja apagar o Polígono?");
    if(c){
     // firebase.database().ref('/Polygons').remove();
      newPolygon.setMap(null);
    }
  });

}

let map: google.maps.Map;



@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;

  drawingManager: google.maps.drawing.DrawingManager;
  color: string = '#00FF00';
  polygonsRef: any;


  location: Location = {
    coordinate: {
      lat: -15.802263609290923,
      lng: -47.880005836486816,
    },

    zoom: 14
  };

  colors: Array<Color> = [
    { color: 'Vermelho', value: '#ff4433' },
    { color: 'Verde', value: '#44FF44' },
    { color: 'Amarelo', value: '#F8F844' },
    { color: 'Azul', value: '#1111FF' }

  ];
  constructor(public service: GetCoordinatesService) { }

  ngOnInit() {

    this.polygonsRef = this.service.fetchData();


    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.location.coordinate.lat, lng: this.location.coordinate.lng },
      zoom: this.location.zoom
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON
        ]
      },
      polygonOptions: {
        fillColor: '#FFFFFFF',
        fillOpacity: 0,
        strokeWeight: 1.5



      }
    });
    this.drawingManager.setMap(map);
    google.maps.event.addDomListener(this.drawingManager, 'polygoncomplete', function (polygon) {
      console.log(polygon.fillColor);
      if (polygon.fillColor !== "#FFFFFFF") {
        const confirmacao = confirm('Deseja salvar essa região?');


        if (confirmacao) {
          let coordStr: string = '{"color": "' + polygon.fillColor + '", "coordinates": [';
          for (var i = 0; i < polygon.getPath().getLength(); i++) {
            coordStr += polygon.getPath().getAt(i).toString().replace(',', ', "lng":');
            coordStr = coordStr.replace('(', '{ "lat": ');
            coordStr = coordStr.replace(')', ' }');

            if (i + 1 < polygon.getPath().getLength()) {
              coordStr += ',';
            }
          }
          coordStr = coordStr + '] }';
          console.log(coordStr);
          firebase.database().ref('/Polygons').push((JSON.parse(coordStr)));
          // firebase.database().ref('/Polygons').push((JSON.parse(coordStr)));
          // services.setData((JSON.parse(coordStr)));
          // localStorage.setItem('Polygon', coordStr);
        } else {
          polygon.setMap(null);
        }
      } else {
        alert("Selecione uma cor!");
        polygon.setMap(null);
      }
    });



    this.polygonsRef
      .on('value', function (snapshot) {
        snapshot.forEach(element => {
          console.log(element.val()['coordinates']);
          loadPolygons(element.val());
        });
      });
  }

  changeColor(color: string) {
    this.drawingManager.setOptions({
      polygonOptions: {
        fillColor: color,
        fillOpacity: 0.6,
        strokeWeight: 1.5
      }

    });

  }



}
