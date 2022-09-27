export default {

    state: {

        file: [],
        uploadFileProcess: false,
        uploadFileMsg: null
    },

    actions: {

        /**
        * [READ] Добавляет в приложение задачи из localStorage при заходе или обновлении страницы
        * 
        * @param {Object} state - служебное свойство VueX (текущее состояние хранилища), не передаётся при вызове 
        */
        async readFile ({state}) {

           try {

               const localData = await JSON.parse(localStorage.getItem('KJV_DATA'))

               localData ? 
                   state.file = localData : 
                   state.file = []

           } catch {

               state.fileMsg = { success: false, text: 'Ошибка чтения локальный данных!' }
           }
       }
    },

    mutations: {

        setFile: (state, data) => {

            state.file = data
            localStorage.setItem( 'KJV_DATA', JSON.stringify(data) )
        }
    }
}