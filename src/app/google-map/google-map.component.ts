
/// <reference types="@types/googlemaps" />
import { Polygon } from './../models/googleMaps';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GetCoordinatesService } from '../get-coordinates.service';
import { Location, Color } from '../models/googleMaps'
import { Alert } from 'selenium-webdriver';



let firebase = require("firebase/app");
require("firebase/database");
let c: boolean;
let currentPolygon: google.maps.Polygon;
let infoWindow: google.maps.InfoWindow;

let location: Location = {
  coordinate: {
    lat: -15.802263609290923,
    lng: -47.880005836486816,
  },

  zoom: 14
};

function loadPolygons(polygon) {
  // console.log(polygon);
  google.maps.event.addListener(polygon, 'click', function () {
    console.log('oi');
  });
  infoWindow = new google.maps.InfoWindow;

  var newPolygon = new google.maps.Polygon({
    paths: polygon['coordinates'],
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 0.7,
    fillColor: polygon['color'],
    fillOpacity: 0.6
  });
  // console.log(newPolygon);
  newPolygon.setMap(map);
  newPolygon.addListener('click', function (polygonold) {
    currentPolygon = new google.maps.Polygon({
      paths: polygon['coordinates']
    });
    location.coordinate.lat = polygonold.latLng.lat();
    location.coordinate.lng = polygonold.latLng.lng()
    // console.log(currentPolygon);

    infoWindow.setContent('<div style="margin: 15px">' +
      '<h3>Informações da Área</h3>' +
      '<h5>Logadouro: </h5>' +
      '<h5>Bairro: </h5>' +
      '<h5>Complemento: </h5>' +
      '<h5>Localidade: </h5>' +
      '<h5>UF: </h5>' +
      '<button type="button" onclick="document.getElementById(\'HiddenButton\').click()">Remover Área</button>' +
      '<button>Editar Área</button>');
    infoWindow.setPosition(polygonold.latLng);
    //  polygonold.setMap(null);
    infoWindow.open(map);


  });


}


function removePolygon(polygon) {
  var polygonsRef = firebase.database().ref('/Polygons');

  polygonsRef.on('value', function (snapshot) {

    snapshot.forEach(element => {
      // console.log(element.val()['coordinates']);
      // console.log(polygon['coordinates']);
      if (JSON.stringify(element.val()['coordinates']) === JSON.stringify(polygon['coordinates'])) {
        // console.log('achado');
        polygonsRef.child(element.key).remove();
        // polygon.setMap(null);
      }

    });
  });
}

let map: google.maps.Map;



@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  // @ViewChild('gmap') gmapElement: any;

  drawingManager: google.maps.drawing.DrawingManager;
  color: string = '#00FF00';
  polygonsRef: any;


  colors: Array<Color> = [
    { color: 'Vermelho', value: '#ff4433' },
    { color: 'Verde', value: '#44FF44' },
    { color: 'Amarelo', value: '#F8F844' },
    { color: 'Azul', value: '#1111FF' }

  ];
  constructor(public service: GetCoordinatesService) { }

  ngOnInit() {
    // console.log(this.gmapElement);
    this.polygonsRef = this.service.fetchData();


    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: location.coordinate.lat, lng: location.coordinate.lng },
      zoom: location.zoom
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

      if (polygon.fillColor !== "#FFFFFFF") {
        const confirmacao = confirm('Deseja salvar essa região?');


        if (confirmacao) {
          let Polygon: Polygon = {
            color: polygon.fillColor,
            coordinates: []
          };

          for (var i = 0; i < polygon.getPath().getLength(); i++) {
            Polygon.coordinates.push({
              lat: polygon.getPath().getAt(i).lat(),
              lng: polygon.getPath().getAt(i).lng()
            });
            /*  coordStr += polygon.getPath().getAt(i).toString().replace(',', ', "lng":');
              coordStr = coordStr.replace('(', '{ "lat": ');
              coordStr = coordStr.replace(')', ' }');
  
              if (i + 1 < polygon.getPath().getLength()) {
                coordStr += ',';
              }*/
          }
          //  console.log(Polygon);
          //  coordStr = coordStr + '] }';

          firebase.database().ref('/Polygons').push(Polygon);


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
          //console.log(element.val()['coordinates']);
          loadPolygons(element.val());
        });
      });

    var input = (document.getElementById('map-input') as HTMLInputElement);
    var searchBox = new google.maps.places.SearchBox(input);


    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();
      // console.log(places);
      if (places.length == 0) {
        return;
      }
      var bounds = new google.maps.LatLngBounds();


      places.forEach(function (place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
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
  removeButton() {

    c = confirm('Deseja apagar essa região?');
    if (c) {
      // newPolygon.setMap(null);
      let Polygon: Polygon = {
        color: '#FFFFFF',
        coordinates: []
      };

      for (var i = 0; i < currentPolygon.getPath().getLength(); i++) {
        Polygon.coordinates.push({
          lat: currentPolygon.getPath().getAt(i).lat(),
          lng: currentPolygon.getPath().getAt(i).lng()
        });

      }
      removePolygon(Polygon);

      infoWindow.close();
      alert('O Mapa será reiniciado para efetuar as atualizações.');
      this.ngOnInit();
    }

  }
}
