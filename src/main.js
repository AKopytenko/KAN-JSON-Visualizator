import { createApp }    from 'vue'
import { createPinia }  from 'pinia'

import App              from './KJV.vue'
import VueApexCharts    from "vue3-apexcharts"

import 'bootstrap'

createApp(App)
    .use(createPinia())
    .use(VueApexCharts)
    .mount('#kjv')