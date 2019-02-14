/// <reference types="@types/googlemaps" />
import { AreaInformation } from './../models/googleMaps';
import { Polygon } from './../models/googleMaps';
import { Component, OnInit } from '@angular/core';
import { GetCoordinatesService } from '../get-coordinates.service';
import { Location, Color } from '../models/googleMaps'

let firebase = require("firebase/app");
require("firebase/database");


@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  drawingManager: google.maps.drawing.DrawingManager;
  polygonsRef: any;
  currentPolygon: google.maps.Polygon;
  infoWindow: google.maps.InfoWindow;
  map: google.maps.Map;
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
    // console.log(this.gmapElement);
    this.polygonsRef = this.service.fetchData();


    this.map = new google.maps.Map(document.getElementById('map'), {
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
        fillOpacity: 0.4,
        strokeWeight: 1.5
      }
    });


    this.drawingManager.setMap(this.map);
    google.maps.event.addDomListener(this.drawingManager, 'polygoncomplete', polygon => {

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
          console.log(Polygon);
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
      .on('value', snapshot => {
        snapshot.forEach(element => {
          //console.log(element.val()['coordinates']);
          let polygon = this.loadPolygons(element.val());
        });
      });

    var input = (document.getElementById('map-input') as HTMLInputElement);
    var searchBox = new google.maps.places.SearchBox(input);
    console.log(searchBox);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      var places = searchBox.getPlaces();
      // console.log(places);
      if (places.length === 0) {
        return;
      }
      var bounds = new google.maps.LatLngBounds();


      places.forEach(place => {
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
      this.map.fitBounds(bounds);
    });

  }




  changeColor(color: string) {
    this.drawingManager.setOptions({
      polygonOptions: {
        fillColor: color,
        fillOpacity: 0.4,
        strokeWeight: 1.5
      }
    });

  }
  removeButton() {

    var c = confirm('Deseja apagar essa região?');
    if (c) {
      // newPolygon.setMap(null);
      let Polygon: Polygon = {
        color: '#FFFFFF',
        coordinates: []
      };

      for (var i = 0; i < this.currentPolygon.getPath().getLength(); i++) {
        Polygon.coordinates.push({
          lat: this.currentPolygon.getPath().getAt(i).lat(),
          lng: this.currentPolygon.getPath().getAt(i).lng()
        });

      }
      this.removePolygon(Polygon);

      this.infoWindow.close();
      alert('O Mapa será reiniciado para efetuar as atualizações.');
      this.ngOnInit();
    }

  }
  loadPolygons(polygon): google.maps.Polygon {
    this.infoWindow = new google.maps.InfoWindow;
    var newPolygon = new google.maps.Polygon({
      paths: polygon['coordinates'],
      strokeColor: '#000000',
      strokeOpacity: 0.8,
      strokeWeight: 0.7,
      fillColor: polygon['color'],
      fillOpacity: 0.4
    });
    newPolygon.setMap(this.map);
    newPolygon.addListener('click', polygonold => {

      let placeInformations: AreaInformation = {};
      this.currentPolygon = new google.maps.Polygon({
        paths: polygon['coordinates']
      });
      this.location.coordinate.lat = polygonold.latLng.lat();
      this.location.coordinate.lng = polygonold.latLng.lng()
      // console.log(currentPolygon);
      this.service.getInformations(this.location.coordinate.lat, this.location.coordinate.lng).subscribe(
        data => {
          data['results'].forEach(InfoArea => {
            InfoArea['address_components'].forEach(mapParameter => {
              mapParameter['types'].forEach(tipo => {
                if (tipo === 'postal_code') {
                  placeInformations.CEP = mapParameter['long_name'];
                }
                if (tipo === 'administrative_area_level_1') {
                  placeInformations.UF = mapParameter['long_name'];
                }
                if (tipo === 'sublocality_level_1') {
                  placeInformations.bairro = mapParameter['long_name'];
                }
                if (tipo === 'sublocality_level_2') {
                  placeInformations.localidade = mapParameter['long_name'];
                }
              });
            });
          });
          console.log(placeInformations);
          // console.log(data['results'][0]['address_components']);
          let contentString = `<div style="text-align: center">
          <h4>Informações da Região</h4>
          `;
          if (placeInformations.logadouro) {
            contentString += `<h5> ${placeInformations.logadouro} </h5>`;
          }
          if (placeInformations.bairro) {
            contentString += `<h5> ${placeInformations.bairro} </h5>`;
          }
          if (placeInformations.localidade) {
            contentString += `<h5> ${placeInformations.localidade} </h5>`;
          }
          if (placeInformations.UF) {
            contentString += `<h5> ${placeInformations.UF} </h5>`;
          }
          if (placeInformations.CEP) {
            contentString += `<h5> ${placeInformations.CEP} </h5>`;
          }
          contentString += `
          <button type="button" onclick="document.getElementById(\'HiddenButton\').click()">
            Remover Área
            </button>
          </div>`;
          this.infoWindow.setContent(contentString);

        }
      );
      console.log(placeInformations);

      this.infoWindow.setPosition(polygonold.latLng);
      //  polygonold.setMap(null);
      this.infoWindow.open(this.map);


    });
    return newPolygon;


  }
  removePolygon(polygon) {
    var polygonsRef = firebase.database().ref('/Polygons');

    polygonsRef.on('value', snapshot => {

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
}
