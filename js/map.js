export class Map {
  constructor() {
    // Leaflet
    this.map = L.map("map");
    this.geocodeService = new L.esri.Geocoding.geocodeService();

    // On creation create map instance
    this.createMap();

    // Marker object and collectors
    this.index = 0;
    this.markers = {
      defaultLatLong: this.map.getCenter(),
      markers: [],
      latlng: [],
      addresses: [],
      weather: [],
    };
  }

  // Create Map
  createMap() {
    this.map.setView([37.9643, -91.8318], 4);
    this.map.on("zoomend", this.updateMapCenter.bind(this));

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }

  // After a zoom is compleated or halted recalculate the map center
  updateMapCenter() {
    this.markers.defaultLatLong = this.map.getCenter();
  }

  // Adds a marker at a lng and lat cord
  addMarker(latLong) {
    latLong === 0 ? (latLong = this.markers.defaultLatLong) : latLong;

    let marker = L.marker(latLong, {
      draggable: true,
      autoPan: true,
    })
      .addTo(this.map)
      .on("dragend", this.markerDrag.bind(this))
      .on("click", this.markerClick.bind(this));

    // Push marker instance
    this.markers.markers.push(marker);
    // Push the array activeIndex
    this.index = this.markers.markers.indexOf(marker);
    // Add an id to the marker icon
    this.markers.markers[this.index]._icon.id = this.index;
    // Push the lat and lang
    this.markers.latlng.push(marker._latlng);
    // Get the address information
    this.getAddress(this.markers.latlng[this.index]);
    // Get weather Information
    this.getWeather(this.markers.latlng[this.index]);
    // Fly to marker
    this.map.flyTo(this.markers.latlng[this.index], 15);
    return { index: this.index, markerData: this.markers };
  }

  markerDrag(e) {
    this.index = this.markers.markers.indexOf(e.target);
    this.getAddress(e.target._latlng);
    this.getWeather(e.target._latlng);
  }

  markerClick(e) {
    this.index = this.markers.markers.indexOf(e.target);
    this.getAddress(e.target._latlng);
    this.getWeather(e.target._latlng);
  }

  // Sets the address information
  getAddress(latlng) {
    const lat = latlng.lat;
    const lng = latlng.lng;
    this.geocodeService
      .reverse()
      .latlng([lat, lng])
      .run((error, result) => {
        this.markers.addresses[this.index] = result.address;
      });
  }
  // Get weather for a lat lang and push
  async getWeather(latlng) {
    const weatherData = await fetch(
      `http://api.geonames.org/findNearByWeatherJSON?lat=${latlng.lat}&lng=${latlng.lng}&username=ZAnderson281`
    ).then((data) => data.json());

    this.markers.weather[this.index] = weatherData;
  }

  async convertZipCode(zipCode) {
    const zipCodeData = await fetch(
      `http://api.geonames.org/postalCodeLookupJSON?postalcode=${zipCode}&country=US&username=ZAnderson281`
    ).then((data) => data.json());

    const latlng = {
      lat: zipCodeData.postalcodes[0].lat,
      lng: zipCodeData.postalcodes[0].lng,
    };

    return latlng;
  }

  get getMarkerData() {
    return this.markers;
  }
}
