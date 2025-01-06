<template>
  <div>
    <h1>Carte de Paris avec OpenLayers</h1>
    <!-- La carte prend la hauteur et la largeur de son conteneur -->
    <div ref="map" style="height: 500px;"></div>

    <!-- Informations sur l'état actuel de la carte -->
    <ul>
      <li>center : {{ currentCenter }}</li>
      <li>zoom : {{ currentZoom }}</li>
      <li>rotation : {{ currentRotation }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';  // Importer la fonction de conversion de coordonnées

// Définir les valeurs initiales pour la carte
const map = ref(null);
const currentCenter = ref([-1.6778, 48.1120]); // Coordonnées de la Place de la République, Rennes
const currentZoom = ref(16); // Niveau de zoom initial
const currentRotation = ref(0); // Rotation de la carte (0 = sans rotation)

onMounted(() => {
  // Initialiser la carte avec OpenLayers
  const mapInstance = new OlMap({
    target: map.value, // Le conteneur HTML de la carte
    layers: [
      new TileLayer({
        source: new OSM(), // Charger les tuiles OpenStreetMap
      }),
    ],
    view: new View({
      // Convertir les coordonnées de Paris (en EPSG:4326) en EPSG:3857 pour OpenLayers
      center: fromLonLat(currentCenter.value), 
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
