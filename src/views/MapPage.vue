<template>
  <div class="container">
    <div class="controls">
      <input v-model="address" @keyup.enter="searchAddress" placeholder="Entrez une adresse" />
      <button @click="getLocation">Obtenir ma position</button>
      <button @click="loadAndRecalculateShops">Charger et recalculer les positions</button>
    </div>
    <div ref="map" class="map"></div>
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
const mapInstance = ref(null);
const locationMarkersLayers = ref([]);
const rangeCirclesLayers = ref([]);
const shops = ref([]);

// Fonction pour supprimer toutes les couches liées (marqueurs et cercles)
const clearOldLayers = () => {
  locationMarkersLayers.value.forEach((layer) => mapInstance.value.removeLayer(layer));
  rangeCirclesLayers.value.forEach((layer) => mapInstance.value.removeLayer(layer));
  locationMarkersLayers.value = [];
  rangeCirclesLayers.value = [];
};

// Fonction pour ajouter un marqueur
const addMarker = (lon, lat, color = "orange", shopId = null, type = "") => {
  const coordinates = fromLonLat([lon, lat]);

  const defaultStyle = new Style({
    image: new CircleStyle({
      radius: 10,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: "black", width: 2 }),
    }),
  });

  const hoverStyle = new Style({
    image: new CircleStyle({
      radius: 12, // Légèrement plus grand pour un effet visuel
      fill: new Fill({ color: "yellow" }),
      stroke: new Stroke({ color: "black", width: 2 }),
    }),
  });

  const markerFeature = new Feature({
    geometry: new Point(coordinates),
    type, // Type de marqueur (ex. : shop, user, range)
    shopId, // Associe l'ID du magasin pour l'interaction
  });

  markerFeature.setStyle(defaultStyle);
  markerFeature.set("defaultStyle", defaultStyle);
  markerFeature.set("hoverStyle", hoverStyle);

  const markerLayer = new VectorLayer({
    source: new VectorSource({ features: [markerFeature] }),
  });

  markerLayer.setZIndex(2);

  mapInstance.value.addLayer(markerLayer);
  locationMarkersLayers.value.push(markerLayer);
};

// Fonction pour ajouter des cercles autour de la position de l'utilisateur
const addRangeCircles = (lon, lat) => {
  const coordinates = fromLonLat([lon, lat]);
  const ranges = [
    { radius: 5000, color: "rgba(0, 255, 0, 0.2)" }, // 5 km
    { radius: 10000, color: "rgba(255, 165, 0, 0.2)" }, // 10 km
    { radius: 20000, color: "rgba(255, 0, 0, 0.2)" }, // 20 km
  ];

  ranges.forEach(({ radius, color }) => {
    const circleFeature = new Feature({
      geometry: new Circle(coordinates, radius),
      type: "range",
    });

    const circleLayer = new VectorLayer({
      source: new VectorSource({ features: [circleFeature] }),
      style: new Style({
        fill: new Fill({ color }),
        stroke: new Stroke({ color, width: 1 }),
      }),
    });

    circleLayer.setZIndex(1);

    mapInstance.value.addLayer(circleLayer);
    rangeCirclesLayers.value.push(circleLayer);
  });
};

// Fonction pour obtenir la position actuelle
const getLocation = async () => {
  try {
    if (Capacitor.getPlatform() === "android" || Capacitor.getPlatform() === "ios") {
      const { granted } = await Geolocation.requestPermissions();
      if (!granted) {
        alert("L'autorisation de géolocalisation est requise.");
        return;
      }
    }

    const position = await Geolocation.getCurrentPosition();
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    clearOldLayers();
    addRangeCircles(lon, lat);
    addMarker(lon, lat, "blue", null, "user");

    mapInstance.value.getView().setCenter(fromLonLat([lon, lat]));
    mapInstance.value.getView().setZoom(14);
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

      clearOldLayers();
      addMarker(lon, lat);
    } else {
      alert("Adresse non trouvée.");
    }
  } catch (error) {
    console.error("Erreur lors de la recherche de l'adresse", error);
  }
};

// Fonction pour calculer la distance entre deux points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Fonction pour charger les shops et recalculer les positions
const loadAndRecalculateShops = async () => {
  try {
    const position = await Geolocation.getCurrentPosition();
    const userLon = position.coords.longitude;
    const userLat = position.coords.latitude;
    shops.value = [];

    const response = await fetch(`http://localhost:3000/api/shop/`);
    const data = await response.json();

    for (const shop of data) {
      if (!shop.posCalcule) {
        try {
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${shop.address}`
          );
          const geoData = await geoResponse.json();

          if (geoData.length > 0) {
            shop.posX = parseFloat(geoData[0].lon);
            shop.posY = parseFloat(geoData[0].lat);
            shop.posCalcule = true;

            await fetch(`http://localhost:3000/api/shop/${shop.id}/update`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ posX: shop.posX, posY: shop.posY, posCalcule: true }),
            });
          }
        } catch (error) {
          console.error(`Erreur lors du recalcul des coordonnées pour ${shop.name}`, error);
        }
      }

      const distance = calculateDistance(userLat, userLon, shop.posY, shop.posX);
      if (distance <= shop.dist) {
        shops.value.push(shop);
        addMarker(shop.posX, shop.posY, "orange", shop.id, "shop");
      }
    }

    console.log("Magasins filtrés :", shops.value);
  } catch (error) {
    console.error("Erreur lors du chargement des magasins", error);
    alert("Impossible de charger les magasins.");
  }
};

onMounted(() => {
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
      center: fromLonLat([-1.6778, 48.112]),
      zoom: 16,
    }),
  });

  // Gestion des clics sur les marqueurs
  mapInstance.value.on("click", (event) => {
    const clickedFeature = mapInstance.value.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );

    if (clickedFeature && clickedFeature.get("type") === "shop") {
      const shopId = clickedFeature.get("shopId");
      if (shopId) {
        window.location.href = `/shop/${shopId}`;
      }
    }
  });

  let lastHoveredFeature = null;

  // Gestion globale du survol des marqueurs
  mapInstance.value.on("pointermove", (event) => {
    const hoveredFeature = mapInstance.value.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature
    );

    if (hoveredFeature && hoveredFeature.get("type") === "shop") {
      if (lastHoveredFeature && lastHoveredFeature !== hoveredFeature) {
        lastHoveredFeature.setStyle(lastHoveredFeature.get("defaultStyle"));
      }
      hoveredFeature.setStyle(hoveredFeature.get("hoverStyle"));
      mapInstance.value.getTargetElement().style.cursor = "pointer";
      lastHoveredFeature = hoveredFeature;
    } else if (lastHoveredFeature) {
      lastHoveredFeature.setStyle(lastHoveredFeature.get("defaultStyle"));
      mapInstance.value.getTargetElement().style.cursor = "default";
      lastHoveredFeature = null;
    }

    if (hoveredFeature) {
      console.log("Hovered feature type:", hoveredFeature.get("type")); // Vérifiez les valeurs ici
      console.log("Hovered feature shopId:", hoveredFeature.get("shopId"));
    }
  });
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 94px);
}

.controls {
  padding: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.map {
  flex: 1;
  width: 100%;
}
</style>
