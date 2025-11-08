import MapView from '../views/MapView.vue';
import ExploreView from '../views/ExploreView.vue';

export default [
  { path: '/', name: 'map', component: MapView },
  { path: '/explore', name: 'explore', component: ExploreView }
];
