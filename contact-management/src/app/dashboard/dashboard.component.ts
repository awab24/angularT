import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  name: string | null = null;
  phoneNumber: string | null = null;
  email: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  addresses: string[] = [];

  map: L.Map | undefined;
  marker: L.Marker | undefined;

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
    }
  }

  ngAfterViewInit(): void {
    // Initialize map if latitude and longitude are available
    if (this.latitude && this.longitude) {
      this.loadLeaflet();
    }
  }

  loadLeaflet(): void {
    if (this.latitude && this.longitude) {
      this.map = L.map('map').setView([this.latitude, this.longitude], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.marker = L.marker([this.latitude, this.longitude]).addTo(this.map)
        .bindPopup('<b>Your Location</b>')
        .openPopup();
    }
  }

  goToAddContact(): void {
    this.router.navigate(['/add-contact']);
  }
}
