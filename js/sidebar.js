export class Sidebar {
  constructor(mapInstance) {
    this._mapInstance = mapInstance;

    this.htmlNodes = {
      listWeather: document.querySelector("#weatherForm"),
      zipEntry: document.querySelector("#zipForm"),

      layerEntry: [
        document.querySelector("#sat"),
        document.querySelector("#reg"),
      ],

      active: {
        zipEntry: false,
        listWeather: false,
        layerEntry: "reg",
      },
      weatherCard: {
        weatherCardInstances: [],
      },
    };

    document.body.addEventListener("click", this.handleMarkerUpdate.bind(this));
    document
      .querySelector("#map")
      .addEventListener("click", this.hideViewLocation.bind(this));
  }

  // Handles the toggleing of the zip code entry form
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

  // Handles the toggleing of the weather card container
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
  hideViewLocation() {
    document
      .querySelector("#listWeatherLocations")
      .classList.remove("sidebar-btn-select");
    this.htmlNodes.listWeather.style.display = "none";
    this.htmlNodes.active.listWeather = false;
  }

  handleSelectLayer() {
    if (this.htmlNodes.active.layerEntry === "reg") {
      document.querySelector(".sat-map").style.display = "none";
      document.querySelector(".regular-map").style.display = "flex";

      this._mapInstance.changeToSatalite.bind(this._mapInstance);
      this._mapInstance.changeToSatalite();
      this.htmlNodes.active.layerEntry = "sat";
    } else {
      document.querySelector(".regular-map").style.display = "none";
      document.querySelector(".sat-map").style.display = "flex";

      this._mapInstance.changeToRegular.bind(this._mapInstance);
      this._mapInstance.changeToRegular();
      this.htmlNodes.active.layerEntry = "reg";
    }
  }

  setCurrentLocation() {
    const getPositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      this.createCurrentPositionMarker.bind(this),
      this.handleCurrentPositionError,
      getPositionOptions
    );
  }

  createCurrentPositionMarker(pos) {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitude;
    const markerData = this._mapInstance.addMarker([lat, long]);
    this.createWeatherCard(markerData);
  }

  handleCurrentPositionError(error) {
    console.log(error);
  }

  // Handles the addition of a zipcodeless marker
  handleAddMarker() {
    const markerData = this._mapInstance.addMarker(0);
    this.createWeatherCard(markerData);
  }

  // Handles the creation of a marker with a zip code
  async handleSubmitZipcode() {
    // Get the entered zip code
    const zipcode = document.querySelector("#zipSubmitInput").value;
    const zipcodeConverted = await this._mapInstance.convertZipCode(zipcode);

    const markerData = await this._mapInstance.addMarker(zipcodeConverted);
    this.createWeatherCard(markerData);
  }

  // Handles the updating of markers
  handleMarkerUpdate(event) {
    const map = document.querySelector("#map");
    if (map.contains(event.target)) {
      if (
        event.target.classList.contains("leaflet-marker-icon") &&
        typeof this.htmlNodes.weatherCard.weatherCardInstances[
          event.target.id
        ] != "undefined"
      ) {
        this.htmlNodes.weatherCard.weatherCardInstances[
          event.target.id
        ].updateCard();
      }
    }
  }

  // Creates the weather card and appends the instance to an array
  createWeatherCard(data) {
    const parent = document.querySelector(".location-container");
    const wcInstance = new WeatherCard(parent, data);
    this.htmlNodes.weatherCard.weatherCardInstances.push(wcInstance);
  }
}

// WEATHER CARD CLASS
class WeatherCard extends Sidebar {
  constructor(parent, data) {
    super();
    this.index = data.index;
    this.markerData = data.markerData;
    this.parent = parent;

    this.createWeatherCard();
    this.handleViewLocations();
  }

  // Creates the weather card
  createWeatherCard() {
    this.card = document.createElement("DIV");

    // Card Header
    this.header = document.createElement("DIV");
    this.header.classList.add("weather-card-header");

    // Card Body
    this.weatherContainer = document.createElement("DIV");
    this.weatherContainer.classList.add("weather-card-body");

    // Card Body Temp
    this.temperatureContainer = document.createElement("DIV");
    this.temperatureContainer.classList.add("weather-temp-container");

    // Card Body Other Container
    this.otherContainer = document.createElement("DIV");
    this.otherContainer.classList.add("other-data-container");

    this.card.classList.add("weather-node");
    this.card.id = this.index;

    this.addAddress();
    this.addWeatherData();

    this.parent.appendChild(this.card);
  }

  // Adds the address data to the card
  addAddress() {
    setTimeout(() => {
      this.header.innerHTML = "";
      const header = document.createElement("H3");

      header.innerHTML = this.markerData.addresses[this.index].Match_addr;
      this.header.appendChild(header);
      this.card.appendChild(this.header);
    }, 1000);
  }

  // a\Adds the weather data to the card
  addWeatherData() {
    setTimeout(() => {
      this.temperatureContainer.innerHTML = "";
      this.otherContainer.innerHTML = "";
      const weather = this.markerData.weather[this.index].weatherObservation;

      // Tempature container
      const temp = document.createElement("p");
      const icon = this.getCorrectIcon(weather);

      temp.innerHTML = `
      <div class='temp-top'>
      <p>${icon}</p>
      <p>
      ${Math.round((weather.temperature * 9) / 5 + 32)}&degF</p>
      </div>
      <p class="condition">${
        weather.weatherCondition !== "n/a" ? weather.weatherCondition : ""
      }</p>`;
      this.weatherContainer.appendChild(this.temperatureContainer);

      // Other Container
      const hum = document.createElement("DIV");
      hum.innerHTML = `<p>Humidity: <strong>${weather.humidity}%</strong></p>`;
      // const dew = document.createElement("p");
      // dew.innerHTML = `Dew point: ${
      //   Math.round((weather.dewPoint * 9) / 5) + 32
      // } &degF`;
      const windSpeed = document.createElement("DIV");
      windSpeed.innerHTML = `<p>Wind speed:<strong> ${Math.round(
        weather.windSpeed * 1.15078
      )}mph</strong></p>`;

      this.temperatureContainer.appendChild(temp);

      this.otherContainer.appendChild(hum);
      // this.otherContainer.appendChild(dew);
      this.otherContainer.appendChild(windSpeed);

      this.weatherContainer.appendChild(this.otherContainer);

      this.card.appendChild(this.weatherContainer);
    }, 1000);
  }

  // Updates the weather card information
  updateCard() {
    this.addAddress();
    this.addWeatherData();
  }

  getCorrectIcon(weatherData) {
    const sun = `<i class="fas fa-sun"></i>`;
    const cloudSun = `<i class="fas fa-cloud-sun"></i>`;
    const rain = `<i class="fas fa-cloud-rain"></i>`;
    const cold = `<i class="fas fa-temperature-low"></i>`;
    const hot = `<i class="fas fa-temperature-high"></i>`;
    // const cloud = `<i class="fas fa-cloud"></i>`;
    // const snow = `<i class="fas fa-snowflake"></i>`;
    // const wind = '<i class="fas fa-wind"></i>';

    const temp = Math.round((weatherData.temperature * 9) / 5 + 32);
    let clouds;
    let condition;
    let tempRes;

    // Cloud Logic
    if (weatherData.clouds === "n/a") {
      clouds = false;
    } else {
      clouds = true;
    }

    // Temp Logic
    let tempIconFound = false;

    while (!tempIconFound) {
      if (temp > 75) {
        tempRes = "over";
        tempIconFound = true;
        break;
      }

      if (temp <= 10) {
        tempRes = "below";
        tempIconFound = true;
        break;
      }
      if (temp <= 40) {
        tempRes = "cold";
        tempIconFound = true;
        break;
      }

      tempIconFound = true;
      tempRes = "avg";
    }

    // Weather Condition
    if (weatherData.weatherCondition === "n/a") {
      condition = false;
    } else {
      condition = true;
    }

    // Return Logic
    if (condition) {
      return rain;
    }

    if (clouds && !condition) {
      return cloudSun;
    }
    if (!clouds && !condition && tempRes === "avg") {
      return sun;
    }
    if (!clouds && !condition && tempRes == "cold") {
      return cold;
    }
    if (!clouds && !condition && tempRes == "over") {
      return hot;
    }
    if (!clouds && !condition && tempRes == "below") {
      return cold;
    }
  }

  // Destroys the weather card
  destroyWeatherCard() {
    this.parent.removeChild(this.card);
    console.log("removed");
  }
}
