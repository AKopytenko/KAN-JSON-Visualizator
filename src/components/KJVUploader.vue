<template>
    <div class="kjv-uploader my-4 p-3">
        <div class="kjv-uploader__wrapper p-3 has-shadow has-rounded">
            <h3 class="kjv-uploader__header">Скачать / загрузить данные</h3>
            <div class="kjv-uploader__descr">
                Вы можете загрузить данные для анализа из файла JSON, а так же скачать уже отредактированные данные в файл 
                для конфиденциального переноса между устройствами без использования локальных сетей и Интернет.
            </div>

            <div class="mt-3 btns kjv-uploader__buttons">
                <button 
                    type="button"
                    class="btn btn-primary me-2 kjv-uploader__download"
                    :disabled="!file.length"
                    @click.prevent="downloadFile"
                >
                    Скачать
                </button>

                <button 
                    type="button"
                    class="btn btn-primary me-2 kjv-uploader__upload"
                    data-bs-toggle="modal" 
                    data-bs-target="#importFileModal" 
                    aria-hidden="true"
                    @click.prevent="uploadFileMsg = null"
                >
                    Загрузить
                </button>
            </div>
        </div>

        <div class="modal fade kjv-uploader__modal" id="importFileModal" tabindex="-1" aria-labelledby="uploadFileModalLabel" aria-hidden="true">
            <div class="modal-dialog kjv-uploader__modalDialog">
                <div class="modal-content kjv-uploader__modalContent">
                    <div class="modal-header kjv-uploader__modalHeader">
                        <h5 class="modal-title kjv-uploader__modalTitle" id="uploadFileModalLabel">Загрузка данных</h5>
                        <button type="button" class="btn-close kjv-uploader__modalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form class="kjv-uploader__modalForm" action="/" method="post" id="uploadFileForm" @submit.prevent="uploadFile($event)">
                        <div class="modal-body kjv-uploader__modalBody">
                            <div class="kjv-uploader__result" v-if="uploadFileMsg">
                                <div 
                                    class="alert"
                                    :class="{
                                        'alert-success' : uploadFileMsg.success,
                                        'alert-danger' : !uploadFileMsg.success
                                    }"
                                >
                                    {{ uploadFileMsg.text }}
                                </div>
                            </div>
                            <div class="kjv-uploader__error" v-if="formErrors.length">
                                <div class="alert alert-danger">
                                    <div v-for="error in formErrors" :key="error">
                                        {{ error }}
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 kjv-uploader__formGroup">
                                <label for="uploadFileMethod" class="form-label kjv-uploader__formLabel">Метод загрузки:</label>
                                <select 
                                    id="uploadFileMethod" 
                                    class="form-select kjv-uploader__formInput"
                                    :class="{ 'is-invalid': 'uploadFileMethod' in invalidFields }" 
                                    @change="checkValid($event)"
                                >
                                    <option value="" selected>...</option>
                                    <option value="push">Добавить</option>
                                    <option value="rewrite">Перезаписать</option>
                                </select>
                                <div class="mt-3 mb-4 kjv-uploader__formDescr">
                                    <div class="my-2 kjv-uploader__formDescrItem">
                                        <strong>Добавить</strong> 
                                        <div class="kjv-uploader__formDescrItemText">Данные из файла будут добавлены к загруженным ранее</div>
                                    </div>
                                    <div class="my-2 kjv-uploader__formDescrItem">
                                        <strong>Перезаписать</strong> 
                                        <div class="kjv-uploader__formDescrItemText">Ранее загруженные данные будут УДАЛЕНЫ и перезаписаны данными из файла</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 kjv-uploader__formGroup">
                                <label for="uploadFile" class="form-label kjv-uploader__formLabel">Файл:</label>
                                <input
                                    type="file" 
                                    id="uploadFile" 
                                    class="form-control kjv-uploader__formInput" 
                                    accept=".txt"
                                    :class="{ 'is-invalid': 'uploadFile' in invalidFields }" 
                                    @change="checkValid($event)"
                                >
                            </div>
                        </div>
                        <div class="modal-footer kjv-uploader__modalFooter">
                            <button type="button" class="btn btn-light kjv-uploader__modalBtn" data-bs-dismiss="modal">Отмена</button>
                            <button type="submit" class="btn btn-primary kjv-uploader__modalBtn">Загрузить</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUploaderStore } from '@/stores/uploader'

const uploaderStore = useUploaderStore();

const invalidFields = ref({})
const formErrors = ref([])
const uploadFileMsg = ref(null)

const file = computed(() => uploaderStore.uploadFile)

const downloadFile = () => {

    const targetsString = JSON.stringify(file.value)
    const targetsFile = new Blob([targetsString], {type: 'application/json'})
    
    const now = new Date()
    const year = now.getFullYear()
    const month = ('0' + (Number(now.getMonth()) + 1)).slice(-2)
    const day = ('0' + now.getDate()).slice(-2)
    const hours = ('0' + now.getHours()).slice(-2)
    const minutes = ('0' + now.getMinutes()).slice(-2)
    const seconds = ('0' + now.getSeconds()).slice(-2)

    const a = document.createElement('a')
    a.href = URL.createObjectURL(targetsFile)
    a.download = `KJVFileImport__${year}-${month}-${day}_${hours}-${minutes}-${seconds}.txt`
    a.click()
}

const uploadFile = (event) => {

    const fields = event.target.elements
    let data = {}

    invalidFields.value = {}
    formErrors.value = []

    if(fields.uploadFileMethod.value) {
        data.method = fields.uploadFileMethod.value
    } else {
        invalidFields.value.uploadFileMethod = true
        formErrors.value.push('Выберите тип загрузки')
    }

    if(fields.uploadFile.value) {
        const file = fields.uploadFile.files[0]
        const fileType = file.type
        const fileExt = file.name.split('.').pop()
        
        if(fileType === 'text/plain' || fileExt === 'txt') {
            data.file = file
        } else {
            invalidFields.value.uploadFile = true
            formErrors.value.push('Неверный формат файла! Выберите файл с расширением *.txt')
        }
    } else {
        invalidFields.value.uploadFile = true
        formErrors.value.push('Выберите файл для загрузки')
    }

    if(formErrors.value.length === 0) {
        const reader = new FileReader()

        reader.onload = (event) => {
            try {
                const fileContent = JSON.parse(event.target.result)

                if(data.method === 'rewrite') {
                    processRewriteData(fileContent)
                } else {
                    processPushData(fileContent)
                }
            } catch {
                uploadFileMsg.value = { 
                    success: false, 
                    text: 'Ошибка! Проверьте правильность структуры данных в файле' 
                }
            }
        }

        reader.readAsText(data.file)
    }
}

const processRewriteData = (fileContent) => {

    const rows = fileContent.map(row => {

        if(!('carNumber' in row)) {
            throw new Error('Invalid data structure')
        }
        
        return {
            carNumber: row.carNumber,
            trainIndex: row.trainIndex || null,
            trainNumber: row.trainNumber || null,
            carStatus: row.carStatus || null,
            invoiceId: row.invoiceId || null,
            invoiceNumber: row.invoiceNumber || null,
            stateId: row.stateId || null,
            lastOperDt: row.lastOperDt || null,
            ordNumber: row.ordNumber || null
        }
    })

    uploaderStore.setFile(rows)
    uploadFileMsg.value = { success: true, text: 'Данные успешно загружены' }
}

const processPushData = (fileContent) => {

    let ordNumber = 1

    if(file.value.length) {
        const allIDs = file.value.map(row => row.ordNumber)
        ordNumber = Math.max(...allIDs) + 1
    }

    const newRows = fileContent.map(row => {
        if(!('carNumber' in row)) {
            throw new Error('Invalid data structure')
        }

        return {
            carNumber: row.carNumber,
            trainIndex: row.trainIndex || null,
            trainNumber: row.trainNumber || null,
            carStatus: row.carStatus || null,
            invoiceId: row.invoiceId || null,
            invoiceNumber: row.invoiceNumber || null,
            stateId: row.stateId || null,
            lastOperDt: row.lastOperDt || null,
            ordNumber: ordNumber++
        }
    })

    const combinedRows = [...file.value, ...newRows]
    uploaderStore.setFile(combinedRows)
    uploadFileMsg.value = { success: true, text: 'Данные успешно загружены' }
}

const checkValid = (event) => {
    event.target.classList.remove('is-invalid')
}

onMounted(() => {
    const importFileModal = document.getElementById('importFileModal')
    
    importFileModal.addEventListener('show.bs.modal', () => {
        formErrors.value = []
        invalidFields.value = {}
        uploadFileMsg.value = null
        document.querySelector('#uploadFileForm').reset()
    })
})
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-uploader.scss';
</style>