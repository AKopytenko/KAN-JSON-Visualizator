import { createApp }    from 'vue'
import App              from './KJV.vue'
import store            from './store'
import VueApexCharts from "vue3-apexcharts"

import 'bootstrap'

createApp(App)
    .use(store)
    .use(VueApexCharts)
    .mount('#kjv')