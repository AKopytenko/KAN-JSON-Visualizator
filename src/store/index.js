import { createStore } from 'vuex'

import diagram   from '@/store/modules/diagram'  // Диаграмма
import table     from '@/store/modules/table'    // Данные в таблице
import uploader  from '@/store/modules/uploader' // Компонент загрузки файлов с JSON

export default createStore({

    modules: {

        diagram,
        table,
        uploader
    }
})
