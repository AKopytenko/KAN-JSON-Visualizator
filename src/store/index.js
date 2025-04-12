import { createStore } from 'vuex'

import table     from '@/store/modules/table'    // Данные в таблице
import uploader  from '@/store/modules/uploader' // Компонент загрузки файлов с JSON

export default createStore({

    modules: {

        table,
        uploader
    }
})
