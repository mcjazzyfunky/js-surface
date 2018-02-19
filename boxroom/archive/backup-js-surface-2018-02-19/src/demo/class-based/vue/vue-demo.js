import { Adapter } from 'js-surface';

if (Adapter.name !== 'vue') {
    document.getElementById('main-content').innerHTML =
        'This demo only works with Vue.<br/>'
        + 'To start the demo, please switch the adapter to "vue".';
} else {
    System.import('./class-based/vue/vue-demo-include.js');
}
