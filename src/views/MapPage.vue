<template>
  <div>
    <h1>Carte avec OpenLayers et Géocodage d'Adresse</h1>

    <!-- Formulaire pour saisir l'adresse -->
    <input v-model="address" @keyup.enter="searchAddress" placeholder="Entrez une adresse" />

    <!-- La carte prend la hauteur et la largeur de son conteneur -->
    <div ref="map" style="height: 500px;"></div>

    <!-- Informations sur l'état actuel de la carte -->
    <!-- <ul>
      <li>center : {{ currentCenter }}</li>
      <li>zoom : {{ currentZoom }}</li>
      <li>rotation : {{ currentRotation }}</li>
    </ul> -->

    <!-- Bouton pour activer la géolocalisation -->
    <button @click="getLocation">Obtenir ma position</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import Circle from 'ol/geom/Circle'; // Importer pour dessiner les cercles
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import 'ol/ol.css';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const address = ref('');
const map = ref(null);
const currentCenter = ref([-1.6778, 48.1120]); // Coordonnées de la Place de la République, Rennes
const currentZoom = ref(16); // Niveau de zoom initial
const currentRotation = ref(0); // Rotation de la carte (0 = sans rotation)
const userMarker = ref(null); // Marqueur pour la position de l'utilisateur
const rangeCircles = ref([]); // Références aux cercles de portée
const locationMarkers = ref([]); // Liste des marqueurs des lieux recherchés

// Fonction pour ajouter un cercle transparent autour de la position de l'utilisateur
const addRangeCircles = (lon, lat) => {
  // Supprimer les anciens cercles (si existants)
  rangeCircles.value.forEach((circleLayer) => {
    mapInstance.removeLayer(circleLayer);
  });
  rangeCircles.value = [];

  // Coordonnées en EPSG:3857
  const coordinates = fromLonLat([lon, lat]);

  // Couleurs et rayons (en mètres)
  const ranges = [
    { radius: 5000, color: 'rgba(0, 255, 0, 0.2)' }, // Vert transparent pour 5 km
    { radius: 10000, color: 'rgba(255, 165, 0, 0.2)' }, // Orange transparent pour 10 km
    { radius: 20000, color: 'rgba(255, 0, 0, 0.2)' }, // Rouge transparent pour 20 km
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

    mapInstance.addLayer(circleLayer);
    rangeCircles.value.push(circleLayer);
  });
};

// Fonction pour mettre à jour la carte
const updateMap = (lon, lat, isUserLocation = false) => {
  // Convertir les coordonnées en EPSG:3857
  const coordinates = fromLonLat([lon, lat]);

  // Déterminer le style en fonction du type de point (utilisateur ou lieu)
  const pointStyle = new Style({
    image: new CircleStyle({
      radius: isUserLocation ? 5 : 10, // Réduire la taille du cercle bleu pour l'utilisateur (5px)
      fill: new Fill({ color: isUserLocation ? 'blue' : 'orange' }), // Bleu pour l'utilisateur, orange pour le lieu
      stroke: new Stroke({ color: 'black', width: 2 }), // Contour noir de 2px
    }),
  });

  if (isUserLocation) {
    // Mettre à jour ou créer le marqueur de l'utilisateur
    if (userMarker.value) {
      userMarker.value.getGeometry().setCoordinates(coordinates);
    } else {
      const userPointFeature = new Feature({
        geometry: new Point(coordinates),
      });
      userPointFeature.setStyle(pointStyle);

      const userVectorSource = new VectorSource({
        features: [userPointFeature],
      });

      const userVectorLayer = new VectorLayer({
        source: userVectorSource,
      });

      mapInstance.addLayer(userVectorLayer);
      userMarker.value = userPointFeature; // Stocker le marqueur de l'utilisateur
    }

    // Ajouter les cercles de portée autour de la position de l'utilisateur
    addRangeCircles(lon, lat);
  } else {
    // Ajouter un nouveau marqueur pour les lieux recherchés
    const locationPointFeature = new Feature({
      geometry: new Point(coordinates),
    });
    locationPointFeature.setStyle(pointStyle);

    const locationVectorSource = new VectorSource({
      features: [locationPointFeature],
    });

    const locationVectorLayer = new VectorLayer({
      source: locationVectorSource,
    });

    mapInstance.addLayer(locationVectorLayer);

    // Ajouter le marqueur à la liste des marqueurs de lieux
    locationMarkers.value.push(locationPointFeature);
  }

  // Centrer la carte sur la nouvelle position
  mapInstance.getView().setCenter(coordinates);
  mapInstance.getView().setZoom(16); // Zoom sur la position
};

// Fonction pour obtenir la position actuelle
const getLocation = async () => {
  try {
    if (Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      const { granted } = await Geolocation.requestPermissions();
      if (!granted) {
        alert("L'autorisation de géolocalisation est nécessaire pour continuer.");
        return;
      }
    }

    const position = await Geolocation.getCurrentPosition();
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    // Mettre à jour la carte avec la position récupérée
    updateMap(lon, lat, true);
  } catch (error) {
    console.error('Erreur de géolocalisation', error);
    alert('Impossible de récupérer votre position. Assurez-vous que la géolocalisation est activée.');
  }
};

// Fonction pour rechercher une adresse
const searchAddress = async () => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address.value}`);
    const data = await response.json();

    if (data.length > 0) {
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);

      // Ajouter un marqueur pour le lieu recherché
      updateMap(lon, lat);
    } else {
      alert('Adresse non trouvée');
    }
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'adresse', error);
  }
};

let mapInstance;

onMounted(() => {
  // Initialiser la carte avec un style minimaliste
  mapInstance = new OlMap({
    target: map.value,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', // Style Toner Lite
        }),
      }),
    ],
    view: new View({
      center: fromLonLat(currentCenter.value), // Convertir les coordonnées
      zoom: currentZoom.value,
      rotation: currentRotation.value,
    }),
  });

  // Suivre les changements de la carte pour les afficher
  mapInstance.getView().on('change:center', () => {
    const center = mapInstance.getView().getCenter();
    currentCenter.value = center;
  });

  mapInstance.getView().on('change:zoom', () => {
    currentZoom.value = mapInstance.getView().getZoom();
  });

  mapInstance.getView().on('change:rotation', () => {
    currentRotation.value = mapInstance.getView().getRotation();
  });
});
</script>

<style scoped>
/* Style pour la carte */
#map {
  position: relative;
  width: 100%;
  height: 500px;
}
</style>
