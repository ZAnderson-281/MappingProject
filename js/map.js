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
      defaultLatLong: [51.505, -91.8318],
      markers: [],
      latlng: [],
      addresses: [],
      weather: [],
    };
  }

  // Create Map
  createMap() {
    this.map.setView([37.9643, -91.8318], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
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
    // Push the lat and lang
    this.markers.latlng.push(marker._latlng);
    // Get the address information
    this.getAddress(this.markers.latlng[this.index]);
    // Get weather Information
    this.getWeather(this.markers.latlng[this.index]);
    // Fly to marker
    this.map.flyTo(this.markers.latlng[this.index], 15);
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
  async getAddress(latlng) {
    const lat = latlng.lat;
    const lng = latlng.lng;
    this.geocodeService
      .reverse()
      .latlng([lat, lng])
      .run((error, result) => {
        console.log(result.address);
        this.markers.addresses[this.index] = result.address;
      });
  }

  // Get weather for a lat lang and push
  async getWeather(latlng) {
    const weatherData = await fetch(
      `http://api.geonames.org/findNearByWeatherJSON?lat=${latlng.lat}&lng=${latlng.lng}&username=ZAnderson281`
    ).then((data) => data.json());
    console.log(weatherData);

    this.markers.weather[this.index] = weatherData;
  }

  get getMarkerData() {
    return this.markers;
  }
}
