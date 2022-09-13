import { createApp }    from 'vue'
import App              from './KJV.vue'
import store            from './store'

import 'bootstrap'

createApp(App)
    .use(store)
    .mount('#kjv')