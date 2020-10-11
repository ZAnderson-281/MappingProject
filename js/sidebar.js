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
      },
    };

    document.body.addEventListener("click", this.handleMarkerUpdate.bind(this));
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
    // this.createWeatherCard.bind(markerData);
    console.log(markerData);
    this.createWeatherCard(markerData);
  }

  // Handles the updating of markers
  handleMarkerUpdate(event) {
    const map = document.querySelector("#map");
    if (map.contains(event.target)) {
      console.log(event.target.id);
      this.htmlNodes.weatherCard.weatherCardInstances[
        event.target.id
      ].updateCard();
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
    this.header = document.createElement("DIV");
    this.weatherContainer = document.createElement("DIV");

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
      this.weatherContainer.innerHTML = "";
      const weather = this.markerData.weather[this.index].weatherObservation;

      const temp = document.createElement("p");
      temp.innerHTML = `Temperature: ${weather.temperature}`;
      const hum = document.createElement("p");
      hum.innerHTML = `Humidity: ${weather.humidity}`;
      const dew = document.createElement("p");
      dew.innerHTML = `Dew point: ${weather.dewPoint}`;
      const windSpeed = document.createElement("p");
      windSpeed.innerHTML = `Wind speed: ${weather.windSpeed}`;

      this.weatherContainer.appendChild(temp);
      this.weatherContainer.appendChild(hum);
      this.weatherContainer.appendChild(dew);
      this.weatherContainer.appendChild(windSpeed);
      this.card.appendChild(this.weatherContainer);

      console.log(weather);
    }, 1000);
  }

  // Updates the weather card information
  updateCard() {
    this.addAddress();
    this.addWeatherData();
  }

  // Destroys the weather card
  destroyWeatherCard() {
    this.parent.removeChild(this.card);
    console.log("removed");
  }
}
