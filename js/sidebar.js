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

  // handle add marker
  handleAddMarker() {
    this._mapInstance.addMarker(0);
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

  handleSubmitZipcode() {
    // Get the entered zip code
    const zipcode = document.querySelector("#zipSubmitInput").value;
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
  constructor(parent, data) {
    this.parent = parent;
    this.card;
    this._weatherData = data.weather;
    this._addrData = data.addr;
    this.createWeatherCard();
  }

  createWeatherCard() {
    this.card = document.createElement("DIV");
    this.card.classList.add("weather-node");

    const button = document.createElement("BUTTON");
    button.addEventListener("click", this.destroyWeatherCard.bind(this));

    const header = document.createElement("H3");

    console.log({ weatherData: this._weatherData });
    header.innerHTML = this._weatherData;

    this.card.appendChild(button);
    this.parent.appendChild(this.card);
  }

  destroyWeatherCard() {
    this.parent.removeChild(this.card);
    console.log("removed");
  }
}
