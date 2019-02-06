import { Component, OnInit } from '@angular/core';
import { AreaInformation } from './../../models/areaInfo';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }
  draw: any;
  map: any;
  Areas: Array<AreaInformation>;

  ngOnInit() {
    const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
   // const MapboxDraw = require('@mapbox/mapbox-gl-draw');

    mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXBlbnJvY2hhIiwiYSI6ImNqcmdqMGF1MTFvM3ozeWxweDNicDU5eWUifQ.3RTgEndlcpmgIvCjguuY7A';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
      center: [-47.82972222, -15.7779], // brasilia
      zoom: 12,
      color: 'red'
    });
  /*  this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });*/
    this.map.addControl(this.draw, 'top-left');
    if (localStorage.getItem('GEOJson')) {
      const STRINGcoordinates = localStorage.getItem('GEOJson');
      console.log(STRINGcoordinates);
      const JSONCoordinates = JSON.parse(STRINGcoordinates);
      console.log(JSONCoordinates);
       JSONCoordinates.forEach(element => {
         const coordinates = element.geometry.coordinates;
         console.log(coordinates);
         this.addLayers(this.map, coordinates, element.id);
       });


    }
  }
  seeLocalStorage() {
    console.log(localStorage);
  }
  clearLocalStorage() {
    localStorage.clear();
  }
  download(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  onButtonPress() {

   // this.download(JSON.stringify(this.draw.getAll()), 'json.txt', 'text/plain');

    // console.log(this.draw.getAll());
    console.log(this.draw.getAll());
    let coordinates = this.draw.getAll().features;
    console.log(coordinates);

    coordinates.forEach( (element: any) => {
      localStorage.setItem(element.id, JSON.stringify(element.geometry.coordinates));
    });
    coordinates = JSON.stringify(coordinates);
    if (localStorage.getItem('GEOJson')) {
      const str = localStorage.getItem('GEOJson');
      console.log('join:');
      console.log(str);
      console.log(coordinates);
      coordinates = str.substring(0, (str.length - 1)) + ',' + coordinates.substring(1); // formatar json
    }
    // coordinates = JSON.stringify(coordinates);
    console.log(coordinates);

    localStorage.setItem('GEOJson', coordinates);
  }

  addLayers(map: any, coordinates: any, element: string) {

    const color = '#DD0000';


    map.on('load', function () {
      map.addLayer({
        'id': element,
        'type': 'fill',
        'source': {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              'coordinates': coordinates
              /*[[[-67.13734351262877, 45.137451890638886],
              [-66.96466, 44.8097],
              [-68.03252, 44.3252],
              [-69.06, 43.98],
              [-70.11617, 43.68405],
              [-70.64573401557249, 43.090083319667144],
              [-70.75102474636725, 43.08003225358635],
              [-70.79761105007827, 43.21973948828747],
              [-70.98176001655037, 43.36789581966826],
              [-70.94416541205806, 43.46633942318431],
              [-71.08482, 45.3052400000002],
              [-70.6600225491012, 45.46022288673396],
              [-70.30495378282376, 45.914794623389355],
              [-70.00014034695016, 46.69317088478567],
              [-69.23708614772835, 47.44777598732787],
              [-68.90478084987546, 47.184794623394396],
              [-68.23430497910454, 47.35462921812177],
              [-67.79035274928509, 47.066248887716995],
              [-67.79141211614706, 45.702585354182816],
              [-67.13734351262877, 45.137451890638886]]]*/
            }
          }
        },
        'layout': {},
        'paint': {
          'fill-color': color,
          'fill-opacity': 0.4
        }
      });
    });
  }
}
