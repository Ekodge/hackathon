<template>
  <div>
    <h1>Carte avec OpenLayers et Géocodage d'Adresse</h1>

    <!-- Formulaire pour saisir l'adresse -->
    <input
      v-model="address"
      @keyup.enter="searchAddress"
      placeholder="Entrez une adresse"
    />

    <!-- La carte -->
    <div ref="map" style="height: 500px"></div>

    <!-- Bouton pour la géolocalisation -->
    <button @click="getLocation">Obtenir ma position</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Circle from "ol/geom/Circle";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Stroke } from "ol/style";
import "ol/ol.css";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

const address = ref("");
const map = ref(null);
const mapInstance = ref(null); // Référence à l'instance de la carte
const userMarkerLayer = ref(null); // Couche pour le marqueur de l'utilisateur
const rangeCirclesLayers = ref([]); // Couches pour les cercles
const locationMarkersLayers = ref([]); // Couches pour les marqueurs de lieux

// Fonction pour supprimer toutes les couches liées (cercles et marqueurs)
const clearOldLayers = () => {
  // Supprimer la couche utilisateur
  if (userMarkerLayer.value) {
    mapInstance.value.removeLayer(userMarkerLayer.value);
    userMarkerLayer.value = null;
  }

  // Supprimer les cercles
  rangeCirclesLayers.value.forEach((circleLayer) => {
    mapInstance.value.removeLayer(circleLayer);
  });
  rangeCirclesLayers.value = [];

  // Supprimer les marqueurs des lieux
  locationMarkersLayers.value.forEach((markerLayer) => {
    mapInstance.value.removeLayer(markerLayer);
  });
  locationMarkersLayers.value = [];
};

// Fonction pour ajouter des cercles de portée
const addRangeCircles = (lon, lat) => {
  const coordinates = fromLonLat([lon, lat]);

  const ranges = [
    { radius: 5000, color: "rgba(0, 255, 0, 0.2)" }, // 5 km (vert)
    { radius: 10000, color: "rgba(255, 165, 0, 0.2)" }, // 10 km (orange)
    { radius: 20000, color: "rgba(255, 0, 0, 0.2)" }, // 20 km (rouge)
  ];

  ranges.forEach(({ radius, color }) => {
    const circleFeature = new Feature({
      geometry: new Circle(coordinates, radius),
    });

    const circleLayer = new VectorLayer({
      source: new VectorSource({
        features: [circleFeature],
      }),
      style: new Style({
        fill: new Fill({ color }),
        stroke: new Stroke({ color, width: 1 }),
      }),
    });

    // Ajouter le cercle à la carte
    mapInstance.value.addLayer(circleLayer);
    rangeCirclesLayers.value.push(circleLayer); // Stocker dans la liste
  });
};

// Fonction pour mettre à jour la carte avec un nouveau marqueur
const updateMap = (lon, lat, isUserLocation = false) => {
  const coordinates = fromLonLat([lon, lat]);

  const markerStyle = new Style({
    image: new CircleStyle({
      radius: isUserLocation ? 7 : 10,
      fill: new Fill({ color: isUserLocation ? "blue" : "orange" }),
      stroke: new Stroke({ color: "black", width: 2 }),
    }),
  });

  const markerFeature = new Feature({
    geometry: new Point(coordinates),
  });
  markerFeature.setStyle(markerStyle);

  const markerLayer = new VectorLayer({
    source: new VectorSource({
      features: [markerFeature],
    }),
  });

  // Ajouter le marqueur à la carte
  mapInstance.value.addLayer(markerLayer);

  if (isUserLocation) {
    clearOldLayers(); // Supprimer toutes les anciennes couches
    userMarkerLayer.value = markerLayer;
    addRangeCircles(lon, lat); // Ajouter les cercles autour de l'utilisateur
  } else {
    locationMarkersLayers.value.push(markerLayer); // Ajouter aux marqueurs de lieux
  }

  // Centrer la carte sur la position
  mapInstance.value.getView().setCenter(coordinates);
  mapInstance.value.getView().setZoom(16);
};

// Fonction pour obtenir la position actuelle
const getLocation = async () => {
  try {
    if (
      Capacitor.getPlatform() === "android" ||
      Capacitor.getPlatform() === "ios"
    ) {
      const { granted } = await Geolocation.requestPermissions();
      if (!granted) {
        // alert("L'autorisation de géolocalisation est requise.");
        // return;
      }
    }

    const position = await Geolocation.getCurrentPosition();
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    updateMap(lon, lat, true); // Ajouter la position utilisateur
  } catch (error) {
    console.error("Erreur de géolocalisation", error);
    alert("Impossible de récupérer votre position.");
  }
};

// Fonction pour rechercher une adresse
const searchAddress = async () => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${address.value}`
    );
    const data = await response.json();

    if (data.length > 0) {
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);

      updateMap(lon, lat, false); // Ajouter le marqueur pour l'adresse
    } else {
      alert("Adresse non trouvée.");
    }
  } catch (error) {
    console.error("Erreur lors de la recherche de l'adresse", error);
  }
};

onMounted(() => {
  // Initialiser la carte
  mapInstance.value = new OlMap({
    target: map.value,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        }),
      }),
    ],
    view: new View({
      center: fromLonLat([-1.6778, 48.112]), // Rennes
      zoom: 16,
    }),
  });
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
}
</style>
