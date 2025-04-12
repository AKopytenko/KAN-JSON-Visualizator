import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUploaderStore = defineStore('uploaderStore', () => {

    const uploadFile        = ref([])
    const uploadFileProcess = ref(false)
    const uploadFileMsg     = ref({})

    /**
    * [READ] Добавляет в приложение задачи из localStorage при заходе или обновлении страницы
    * 
    * @param {Object} state - служебное свойство VueX (текущее состояние хранилища), не передаётся при вызове 
    */
    async function readFile() {

        try {

            const localData = await JSON.parse(localStorage.getItem('KJV_DATA'))

            localData ? 
                uploadFile.value = localData : 
                uploadFile.value = []

        } catch {

            uploadFileMsg.value = { success: false, text: 'Ошибка чтения локальный данных!' }
        }
    }

    function setFile(data) {

        uploadFile.value = data
        localStorage.setItem('KJV_DATA', JSON.stringify(data))
    }

    return {

        uploadFile,
        uploadFileProcess,
        uploadFileMsg,
        readFile,
        setFile
    }
})
