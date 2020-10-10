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
  }

  handleAddMarker() {
    this._mapInstance.addMarker(0);
    this._mapInstance.createData.bind(this._mapInstance);
    this.htmlNodes.weatherCard.weatherCardData.push(
      this._mapInstance.createData()
    );
    this.createWeatherCard(this.htmlNodes.weatherCard.weatherCardData);
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
    const zipcode = document.querySelector("#zipSubmitInput").value;
    // this._mapInstance.getZipcodeInfo(zipcode);
    this._mapInstance.createData.bind(this._mapInstance);
    await this._mapInstance.getInfo(zipcode);
    this.htmlNodes.weatherCard.weatherCardData.push(
      this._mapInstance.markers.weather
    );

    console.log(this.htmlNodes.weatherCard);
    console.log(this._mapInstance.markers.weather);

    // this.createWeatherCard();
  }

  createWeatherCard() {
    const parent = document.querySelector(".location-container");
    const wcInstance = new WeatherCard(
      parent,
      this.htmlNodes.weatherCard.weatherCardData
    );
    this.htmlNodes.weatherCard.weatherCardInstances.push(wcInstance);
  }
}

// WEATHER CARD
class WeatherCard {
  constructor(parent, weatherData) {
    this.parent = parent;
    this.card;
    this._weatherData = weatherData;
    this.createWeatherCard();
  }

  createWeatherCard() {
    this.card = document.createElement("DIV");
    this.card.classList.add("weather-node");
    const button = document.createElement("BUTTON");
    button.addEventListener("click", this.destroyWeatherCard.bind(this));
    this.card.appendChild(button);
    this.parent.appendChild(this.card);
  }

  destroyWeatherCard() {
    this.parent.removeChild(this.card);
    console.log("removed");
  }
}
