import { ref }              from 'vue'
import { defineStore }      from 'pinia'
import { useUploaderStore } from '@/stores/uploader'

export const useTableStore = defineStore('tableStore', () => {

    const uploaderStore     = useUploaderStore()

    const tableEditProcess  = ref(false)
    const tableEditMsg      = ref({})

    async function updateTable(payload) {

        try {

            const fileUpdated = uploaderStore.uploadFile.map( item => item.ordNumber == payload.ordNumber ? item = payload : item )

            uploaderStore.setFile(fileUpdated)

            tableEditMsg.value = { success: true, text: "Запись успешно обновлена" }

        } catch(e) {

            tableEditMsg.value = { success: false, text: e }
        }
    }

    const setTableEditProcess   = data => tableEditProcess.value  = data
    const setTableEditMsg       = data => tableEditMsg.value      = data

    return {

        tableEditProcess,
        tableEditMsg, 
        updateTable, 
        setTableEditProcess,
        setTableEditMsg
    }
})
