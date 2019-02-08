export interface Coordinate {
  lat: number;
  lng: number;
};

export interface Location {
  coordinate: Coordinate;
  viewport?: Object;
  zoom?: number;
};
export interface Color {
  color: string;
  value: string;
};

export interface Polygon {

  color: string;
  coordinates: Array<Coordinate>;


}

