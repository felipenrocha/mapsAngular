import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    // const MapboxDraw = require('mapbox-gl-draw');

    mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXBlbnJvY2hhIiwiYSI6ImNqcmdqMGF1MTFvM3ozeWxweDNicDU5eWUifQ.3RTgEndlcpmgIvCjguuY7A';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
      center: [-47.82972222, -15.7779], // brasilia
      zoom: 9
    });
    /* const draw = new MapboxDraw({
       displayControlsDefault: false,
       controls: {
         polygon: true,
         trash: true
       }
     });*/
  }

}
