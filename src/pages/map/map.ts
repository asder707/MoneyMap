import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarkerOptions, GoogleMapsMarker } from 'ionic-native';
import {GeolocationService} from '../../services/geolocation.service';
import { Transaction } from '../../database';
import {TransactionService} from '../../services/transactions.service';

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  map : GoogleMap = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public geolocator : GeolocationService,
              private transactionService : TransactionService) {}

  ionViewDidEnter() {
    //obtener ubicacion del usuario para centrar mapa
    this.geolocator.get().then((result)=>{
      //cargar mapa
      this.loadMap(result.coords.latitude, result.coords.longitude);
    }).catch((err)=>console.log(err));
    //limpiar marcadores del mapa
    this.clearMap();
  }

  loadMarkers(){
    this.transactionService.all()
    .then((results) => this.loadTransactionMarkers(results));
  }

  loadTransactionMarkers(transactions){
    //limpiar marcadores antes de volverlos a poner
    for (let i = 0; i < transactions.length; i++) {
        let transaction=transactions[i];

        //si la transaccion no tiene locacion, se saltará a la siguiente iteracion
        if(!transaction.hasLocation()) continue;

        let markerLocation : GoogleMapsLatLng = new GoogleMapsLatLng(transaction.lat,transaction.lng);

        let markerOptions : GoogleMapsMarkerOptions = {
          position: markerLocation,
          title: transaction.title,
          icon: transaction.getImage()
        }

        this.map.addMarker(markerOptions).then((marker : GoogleMapsMarker)=>{
          marker.showInfoWindow();
        }).catch(err => console.log(err));
    }
  }

  loadMap(lat,lng){
    let location : GoogleMapsLatLng = new GoogleMapsLatLng(lat,lng);

    this.map = new GoogleMap("map",{
      'controls': {
        'compass':true,
        'myLocationButton':true,
        'indoorPicker':true,
        'zoom':true
      },
      'gestures':{
        'scroll':true,
        'tilt':true,
        'rotate':true,
        'zoom':true
      },
      'camera':{
        'latLng': location,
        'tilt':30,
        'zoom':15,
        'bearing':50
      }
    });
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(()=>this.loadMarkers());
  }

  clearMap(){
    this.map.clear();
  }

}
