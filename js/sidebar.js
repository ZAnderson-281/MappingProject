export class Sidebar {
  constructor(mapInstance) {
    this._mapInstance = mapInstance;

    this.htmlNodes = {
      listWeather: document.querySelector("#weatherForm"),
      zipEntry: document.querySelector("#zipForm"),
      active: {
        zipEntry: false,
        listWeather: false,
      },
      weatherCard: {
        weatherCardInstances: [],
        weatherCardData: [],
      },
    };

    document.body.addEventListener("click", this.handleMarkerUpdate.bind(this));
  }

  // handle add marker
  handleAddMarker() {
    const markerData = this._mapInstance.addMarker(0);
    this.createWeatherCard(markerData);
  }

  handleEnterZip() {
    if (this.htmlNodes.active.zipEntry === false) {
      document
        .querySelector("#zipCodeForm")
        .classList.add("sidebar-btn-select");
      this.htmlNodes.zipEntry.style.display = "flex";
      this.htmlNodes.active.zipEntry = true;
    } else {
      document
        .querySelector("#zipCodeForm")
        .classList.remove("sidebar-btn-select");
      this.htmlNodes.zipEntry.style.display = "none";
      this.htmlNodes.active.zipEntry = false;
    }
  }

  handleViewLocations() {
    if (this.htmlNodes.active.listWeather === false) {
      document
        .querySelector("#listWeatherLocations")
        .classList.add("sidebar-btn-select");
      this.htmlNodes.listWeather.style.display = "flex";
      this.htmlNodes.active.listWeather = true;
    } else {
      document
        .querySelector("#listWeatherLocations")
        .classList.remove("sidebar-btn-select");
      this.htmlNodes.listWeather.style.display = "none";
      this.htmlNodes.active.listWeather = false;
    }
  }

  async handleSubmitZipcode() {
    // Get the entered zip code
    const zipcode = document.querySelector("#zipSubmitInput").value;
    const zipcodeConverted = await this._mapInstance.convertZipCode(zipcode);

    const markerData = await this._mapInstance.addMarker(zipcodeConverted);
    this.createWeatherCard(markerData);
  }

  handleMarkerUpdate(event) {
    const map = document.querySelector("#map");
    if (map.contains(event.target)) {
      if (!this.dragging) {
        console.log();
        this.htmlNodes.weatherCard.weatherCardInstances[0].updateCard();
      }
    }
  }

  createWeatherCard(data) {
    const parent = document.querySelector(".location-container");
    const wcInstance = new WeatherCard(parent, data);
    this.htmlNodes.weatherCard.weatherCardInstances.push(wcInstance);
  }
}

// WEATHER CARD
class WeatherCard {
  constructor(parent, data) {
    this.card;
    this.addresses;

    this.parent = parent;
    this.index = data.index;
    this.markerData = data.markerData;

    this.createWeatherCard();
  }

  async createWeatherCard() {
    this.card = document.createElement("DIV");
    this.header = document.createElement("DIV");
    this.weatherContainer = document.createElement("DIV");

    this.card.classList.add("weather-node");
    this.addAddress();
    this.addWeatherData();

    this.parent.appendChild(this.card);
  }

  addAddress() {
    setTimeout(() => {
      this.header.innerHTML = "";
      const header = document.createElement("H3");

      header.innerHTML = this.markerData.addresses[this.index].Match_addr;
      this.header.appendChild(header);
      this.card.appendChild(this.header);
    }, 1000);
  }

  addWeatherData() {
    setTimeout(() => {
      this.weatherContainer.innerHTML = "";
      const weather = this.markerData.weather[this.index].weatherObservation;

      const temp = document.createElement("p");
      temp.innerHTML = `Temperature: ${weather.temperature}`;
      const dew = document.createElement("p");
      dew.innerHTML = `Dew point: ${weather.dewPoint}`;
      const windSpeed = document.createElement("p");
      windSpeed.innerHTML = `Wind speed: ${weather.windSpeed}`;

      this.weatherContainer.appendChild(temp);
      this.weatherContainer.appendChild(dew);
      this.weatherContainer.appendChild(windSpeed);
      this.card.appendChild(this.weatherContainer);

      console.log(weather);
    }, 1000);
  }

  updateCard() {
    this.addAddress();
    this.addWeatherData();
  }

  destroyWeatherCard() {
    this.parent.removeChild(this.card);
    console.log("removed");
  }
}
