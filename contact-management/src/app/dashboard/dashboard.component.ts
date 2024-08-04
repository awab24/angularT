import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  name: string | null = null;
  phoneNumber: string | null = null;
  email: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  addresses: string[] = [];

  map: any;
  marker: any;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Retrieve contact info from localStorage
      this.name = localStorage.getItem('name');
      this.phoneNumber = localStorage.getItem('phoneNumber');
      this.email = localStorage.getItem('email');
      this.latitude = parseFloat(localStorage.getItem('latitude') || '0');
      this.longitude = parseFloat(localStorage.getItem('longitude') || '0');
      this.addresses = JSON.parse(localStorage.getItem('addresses') || '[]');

      // Initialize map if latitude and longitude are available
      if (this.latitude && this.longitude) {
        this.loadLeaflet();
      }
    }
  }

  loadLeaflet(): void {
    // Ensure Leaflet is loaded
    if (L) {
      this.map = L.map('map').setView([this.latitude!, this.longitude!], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = L.marker([this.latitude!, this.longitude!]).addTo(this.map)
        .bindPopup('<b>Your Location</b>')
        .openPopup();
    } else {
      console.error('Leaflet library is not available');
    }
  }

  goToAddContact(): void {
    this.router.navigate(['/add-contact']);
  }
}
