import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import firebase from 'firebase/app';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {

  }
  ngOnInit(): void {
    const config = {
      apiKey: 'AIzaSyCo9NxOGZj1InQ19c1XjtzBd6Q69UKNyU0',
      authDomain: 'sol-web-teste-1548858077536.firebaseapp.com',
      databaseURL: 'https://sol-web-teste-1548858077536.firebaseio.com',
      projectId: 'sol-web-teste-1548858077536',
      storageBucket: '',
      messagingSenderId: '909679869357'
    };
    firebase.initializeApp(config);

  }
}
