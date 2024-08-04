import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  contactForm: FormGroup;
  latitude: number = 0;
  longitude: number = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?\d{10,}$/)]], // Pattern to validate phone number
      email: ['', [Validators.required, Validators.email]], // Validators to validate email
      addresses: this.fb.array([]) // Form array for addresses
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.requestLocation();
    }
  }

  get addresses(): FormArray {
    return this.contactForm.get('addresses') as FormArray;
  }

  addAddress(): void {
    if (this.addresses.length < 5) {
      this.addresses.push(this.fb.control('', Validators.required));
    } else {
      alert('You can add up to 5 addresses.');
    }
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  requestLocation(): void {
    if (navigator.geolocation) {
      const userAgreed = confirm("Do you agree to share your location?");
      if (userAgreed) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            localStorage.setItem('latitude', this.latitude.toString());
            localStorage.setItem('longitude', this.longitude.toString());
          },
          (error) => {
            console.error('Error getting location', error);
          }
        );
      } else {
        alert("Location access denied. Latitude and longitude will not be available.");
      }
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  saveContact() {
    if (this.contactForm.valid) {
      localStorage.setItem('name', this.contactForm.value.name);
      localStorage.setItem('phoneNumber', this.contactForm.value.phoneNumber);
      localStorage.setItem('email', this.contactForm.value.email);
      localStorage.setItem('addresses', JSON.stringify(this.contactForm.value.addresses));

      this.router.navigate(['/dashboard']);
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
