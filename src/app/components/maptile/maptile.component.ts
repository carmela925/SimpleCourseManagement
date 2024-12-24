import { Component, OnDestroy, OnInit} from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { CapactiorGeofence } from 'capacitor-geofence';


import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-maptile',
  templateUrl: './maptile.component.html',
  styleUrls: ['./maptile.component.scss'],
})
export class MaptileComponent  implements OnInit{
  map: any;

  constructor() {}

  ngOnInit() {
    this.initializeMap();
    this.setupGeofences();
  }

  async initializeMap() {
    const position = await Geolocation.getCurrentPosition();
    const userPosition: [number, number] = [position.coords.longitude, position.coords.latitude];

    this.map = new maplibregl.Map({
      container: 'map', // Map container ID
      style: 'https://demotiles.maplibre.org/style.json', // Map style URL
      center: userPosition, // Center the map on the user's position
      zoom: 14, // Adjust the zoom level
    });

    // Add user location marker
    this.map.on('load', () => {
      this.map.addLayer({
        id: 'user-location',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: userPosition,
          },
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#FF6347',
        },
      });
    });
  }

  async updateUserLocation() {
    const position = await Geolocation.getCurrentPosition();
    const userLocation = [position.coords.longitude, position.coords.latitude];

    // Update the user's location marker on the map
    this.map.getSource('user-location').setData({
      type: 'Point',
      coordinates: userLocation,
    });
  }

  setupGeofences() {
    const livingRoom = {
      key: 'living-room',
      lat: 40.7128,
      lng: -74.0060,
      radius: 100, // In meters
      expiration: 3600, // 1 hour expiration
      trigger: { enter: true, exit: true },
    };

    const bedroom = {
      key: 'bedroom',
      lat: 40.7150,
      lng: -74.0050,
      radius: 50, // In meters
      expiration: 3600, // 1 hour expiration
      trigger: { enter: true, exit: true },
    };

    // Add geofences to the map
    this.addGeofenceToMap(livingRoom);
    this.addGeofenceToMap(bedroom);

    // Set up geofences in the geofence 
    CapactiorGeofence.addGeoFence(livingRoom);
    CapactiorGeofence.addGeoFence(bedroom);
    CapactiorGeofence.addListener('onGeofenceTrigger', (event) => {
      console.log('Geofence Triggered:', event);
      alert(`Geofence Triggered: ${JSON.stringify(event)}`);
    });    
  }

  addGeofenceToMap(geofence: any) {
    this.map.addLayer({
      id: geofence.key,
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'Point',
          coordinates: [geofence.lng, geofence.lat],
        },
      },
      paint: {
        'circle-radius': geofence.radius,
        'circle-color': '#ADD8E6',
        'circle-opacity': 0.3,
      },
    });
  }
}
