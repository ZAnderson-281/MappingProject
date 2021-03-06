import { Map } from "./map.js";
import { Sidebar } from "./sidebar.js";

const bindClickEvents = (sidebarInstance) => {
  document
    .querySelector("#addMarker")
    .addEventListener(
      "click",
      sidebarInstance.handleAddMarker.bind(sidebarInstance)
    );

  document
    .querySelector("#listWeatherLocations")
    .addEventListener(
      "click",
      sidebarInstance.handleViewLocations.bind(sidebarInstance)
    );

  document
    .querySelector("#currentLocation")
    .addEventListener(
      "click",
      sidebarInstance.setCurrentLocation.bind(sidebarInstance)
    );

  document
    .querySelector("#selectMapLayer")
    .addEventListener(
      "click",
      sidebarInstance.handleSelectLayer.bind(sidebarInstance)
    );

  document
    .querySelector("#zipCodeForm")
    .addEventListener(
      "click",
      sidebarInstance.handleEnterZip.bind(sidebarInstance)
    );

  document
    .querySelector("#zipSubmitBtn")
    .addEventListener(
      "click",
      sidebarInstance.handleSubmitZipcode.bind(sidebarInstance)
    );
};

const main = () => {
  const map = new Map();
  const sideBar = new Sidebar(map);
  bindClickEvents(sideBar);
};

window.onload = main;
