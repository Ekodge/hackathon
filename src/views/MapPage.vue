<template>
  <div>
    <h1>Carte avec OpenLayers et Géolocalisation</h1>

    <!-- Formulaire pour saisir l'adresse -->
    <input v-model="address" @keyup.enter="searchAddress" placeholder="Entrez une adresse" />

    <!-- La carte prend la hauteur et la largeur de son conteneur -->
    <div ref="map" style="height: 500px;"></div>

    <!-- Informations sur l'état actuel de la carte -->
    <ul>
      <li>center : {{ currentCenter }}</li>
      <li>zoom : {{ currentZoom }}</li>
      <li>rotation : {{ currentRotation }}</li>
    </ul>

    <!-- Bouton pour obtenir la localisation -->
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
import { fromLonLat } from 'ol/proj';  // Importer la fonction de conversion de coordonnées
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style'; // Importer les styles pour personnaliser le point
import 'ol/ol.css';

const address = ref('');
const map = ref(null);
const currentCenter = ref([-1.6778, 48.1120]); // Coordonnées de la Place de la République, Rennes
const currentZoom = ref(16); // Niveau de zoom initial
const currentRotation = ref(0); // Rotation de la carte (0 = sans rotation)
const marker = ref(null); // Référence au marqueur

let mapInstance; // Déclarer mapInstance en dehors de onMounted pour qu'elle soit accessible partout

const searchAddress = async () => {
  // Appel au service Nominatim d'OpenStreetMap pour le géocodage de l'adresse
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address.value}`);
  const data = await response.json();

  if (data.length > 0) {
    // Extraire les coordonnées (latitude et longitude)
    const lon = parseFloat(data[0].lon);
    const lat = parseFloat(data[0].lat);

    // Placer le point sur la carte
    updateMap(lon, lat);
  } else {
    alert('Adresse non trouvée');
  }
};

const updateMap = (lon, lat) => {
  // Convertir les coordonnées en EPSG:3857
  const coordinates = fromLonLat([lon, lat]);

  // Si un marqueur existe déjà, le mettre à jour
  if (marker.value) {
    marker.value.getGeometry().setCoordinates(coordinates);
  } else {
    // Créer une nouvelle feature pour le marqueur
    const pointFeature = new Feature({
      geometry: new Point(coordinates),
    });

    // Créer une couche vectorielle et y ajouter le point
    const vectorSource = new VectorSource({
      features: [pointFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 10, // Rayon du point
          fill: new Fill({ color: 'blue' }), // Remplissage bleu
          stroke: new Stroke({ color: 'black', width: 2 }), // Contour noir de 2px
        }),
      }),
    });

    // Ajouter la couche vectorielle à la carte
    mapInstance.addLayer(vectorLayer);

    // Stocker le marqueur pour le mettre à jour plus tard
    marker.value = pointFeature;
  }

  // Centrer la carte sur la nouvelle position et ajuster le zoom
  mapInstance.getView().setCenter(coordinates);
  mapInstance.getView().setZoom(16); // Zoom sur la position
};

const getLocation = () => {
  console.log("Demande de géolocalisation...");
  // Vérifier si la géolocalisation est disponible
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Position récupérée :", position);
        const lon = position.coords.longitude;
        const lat = position.coords.latitude;
        updateMap(lon, lat); // Mettre à jour la carte avec la position récupérée
      },
      (error) => {
        console.error("Erreur de géolocalisation : ", error.message);
        alert("Impossible de récupérer votre position. Assurez-vous que votre GPS est activé.");
      }
    );
  } else {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
  }
};

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
