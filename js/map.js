export class Map {
  constructor() {
    this.map = L.map("map");

    this.geocodeService = new L.esri.Geocoding.geocodeService();

    this.createMap();

    this.index = 0;
    this.markers = {
      defaultLatLong: [51.505, -91.8318],
      markers: [],
      latlng: [],
      addresses: [],
      weather: [],
    };
  }

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

    this.markers.markers.push(marker);
    this.markers.latlng.push(marker._latlng);
    this.index = this.markers.markers.indexOf(marker);

    this.map.flyTo(this.markers.latlng[this.index], 15);
    this.getAddress();
  }

  markerDrag(e) {
    this.index = this.markers.markers.indexOf(e.target);
    this.markers.latlng[this.index] = e.target._latlng;
    this.getAddress();
  }

  markerClick(e) {
    this.index = this.markers.markers.indexOf(e.target);
    this.getAddress();
  }

  getAddress() {
    const marker = this.markers.markers[this.index];
    this.geocodeService
      .reverse()
      .latlng(marker._latlng)
      .run((error, result) => {
        console.log(result);
        this.markers.markers.addresses.push(result.address);
        marker.bindPopup(result.address.Match_addr).openPopup();
      });
  }

  createData(zip) {
    this.getInfo(zip);
  }

  async getInfo(zipCode) {
    const zipCodeFetch = await fetch(
      `http://api.geonames.org/postalCodeLookupJSON?postalcode=${zipCode}&country=US&username=ZAnderson281`
    );
    const data = await zipCodeFetch.json();

    // Get the weather data
    const weatherFetch = await fetch(
      `http://api.geonames.org/findNearByWeatherJSON?lat=${data.postalcodes[0].lat}&lng=${data.postalcodes[0].lng}&username=ZAnderson281`
    );
    const weatherData = await weatherFetch.json();
    this.markers.weather = weatherData;
    console.log(this.markers.weather);
  }
}
