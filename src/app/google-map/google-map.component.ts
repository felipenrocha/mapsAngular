/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild } from '@angular/core';

interface Coordinate {
  lat: number;
  lng: number;
};

interface Location {
  coordinate: Coordinate;
  viewport?: Object;
  zoom?: number;
};
interface Color {
  color: string;
  value: string;
};

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  drawingManager: google.maps.drawing.DrawingManager;
  color: string = '#00FF00';
  triangle: Array<Coordinate> = [
    { lat: -15.792807187347448, lng: -47.86820411682129 },
    { lat: -15.803543702340935, lng: -47.877817153930664 },
    { lat: -15.807260055651707, lng: -47.86734580993652 }];


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
  constructor() { }

  ngOnInit() {

    //this.triangle = localStorage.getItem('coordinates');
    // console.log(this.triangle);

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
        fillOpacity: 0,
        strokeWeight: 1.5



      }
    });
    //this.bindDataLayerListeners(this.drawingManager);
    google.maps.event.addDomListener(this.drawingManager, 'polygoncomplete', function (polygon) {
      console.log(polygon.getPath().getAt(1));
      let coordStr: string = '';
      for (var i = 0; i < polygon.getPath().getLength(); i++) {
        coordStr += polygon.getPath().getAt(i).toString().replace(',', ', lng:');
        coordStr = coordStr.replace('(', '{ lat: ');
        coordStr = coordStr.replace(')', ' }');

        if (i + 1 < polygon.getPath().getLength()) {
          coordStr += ',';
        }
      }
      coordStr = '[' + coordStr + ']';
      console.log(coordStr);




    });
    this.drawingManager.setMap(this.map);




    this.loadPolygons();


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

  bindDataLayerListeners(dataLayer) {

    dataLayer.addListener('completepolygon', this.savePolygon);
    dataLayer.addListener('addfeature', this.savePolygon);
    dataLayer.addListener('removefeature', this.savePolygon);
    dataLayer.addListener('setgeometry', this.savePolygon);
  }

  savePolygon(): void {

  }
  loadPolygons() {
    var data = JSON.parse(localStorage.getItem('geoData'));
    console.log(data);
    this.map.data.forEach(function (f) {
      this.map.data.remove(f);
    });
    this.map.data.addGeoJson(data)
  }
}
