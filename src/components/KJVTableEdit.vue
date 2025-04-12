<template>
    <form class="kjv-table-edit" action="" @submit.prevent="submitForm()">
        <div 
            class="alert" 
            :class="{
                'alert-danger' : !tableEditMsg.success,
                'alert-success' : tableEditMsg.success
            }"
            v-if="tableEditMsg.text"
        >
            {{ tableEditMsg.text }}
        </div>

        <div 
            class="alert alert-danger" 
            v-if="formErrors.length"
        >
            <div class="alert__text">
                Ошибка заполнение формы: 
                <span class="alert__text-item" v-for="(error, index) in formErrors" :key="error">
                    {{ error }}{{ index !== formErrors.length - 1 ? ', ' : '' }} 
                </span>
            </div>
        </div>

        <div class="row">
            <div class="form-group mb-4 col-12 col-md-6">
                <label for="ordNumber">№ п/п</label>
                <input type="text" class="form-control" id="ordNumber" :value="editRow.ordNumber" disabled>
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="carNumber">Номер вагона</label>
                <input type="text" class="form-control" id="carNumber" v-model="formData.carNumber" :class="{ 'invalid' : formInvalids.carNumber }">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="trainIndex">Индекс поезда</label>
                <input type="text" class="form-control" id="trainIndex" v-model="formData.trainIndex">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="trainNumber">Номер поезда</label>
                <input type="text" class="form-control" id="trainNumber" v-model="formData.trainNumber">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="carStatus">Статус</label>
                <input type="text" class="form-control" id="carStatus" v-model="formData.carStatus">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="lastOperDt">Дата-время операции</label>
                <input type="datetime-local" class="form-control" id="lastOperDt" v-model="formData.lastOperDt">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="invoiceNumber">№ накладной</label>
                <input type="text" class="form-control" id="invoiceNumber" v-model="formData.invoiceNumber" :class="{ 'invalid' : formInvalids.invoiceNumber }">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="invoiceId">ИД накладной</label>
                <input type="text" class="form-control" id="invoiceId" v-model="formData.invoiceId" :class="{ 'invalid' : formInvalids.invoiceId }">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="stateId">stateId</label>
                <input type="text" class="form-control" id="stateId" v-model="formData.stateId">
            </div>
        </div>

        <div class="mt-4 btns text-end">
            <button class="btn" type="button" @click.prevent="$emit('closeModal')">Отмена</button>
            <button class="btn btn--primary ms-4" type="submit">Сохранить</button>
        </div>
    </form>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useTableStore } from '@/stores/table'

const tableStore = useTableStore()

const props = defineProps({
    editRow: {
        type: Object,
        required: true
    }
})

// Реактивные данные формы
const formData = ref({
    carNumber:      '',
    trainIndex:     '',
    trainNumber:    '',
    carStatus:      '',
    invoiceId:      '',
    invoiceNumber:  '',
    stateId:        '',
    lastOperDt:     ''
})

const formInvalids = ref({})
const formErrors = ref([])

const tableEditMsg = computed(() => tableStore.tableEditMsg)

const setStartZero = (value) => {
    value = String(value)
    return value.length == 1 ? '0' + value : value
}

const submitForm = () => {

    formInvalids.value = {}
    formErrors.value = []

    let data = {
        ordNumber: props.editRow.ordNumber
    }

    if(formData.value.carNumber.length) {
        data.carNumber = formData.value.carNumber
    } else {
        formInvalids.value.carNumber = true
        formErrors.value.push("Не заполнено поле 'Номер вагона'")
    }

    if(formData.value.invoiceNumber.length) {
        data.invoiceNumber = formData.value.invoiceNumber
    } else {
        formInvalids.value.invoiceNumber = true
        formErrors.value.push("Не заполнено поле '№ накладной'")
    }

    if(formData.value.invoiceId.length) {
        data.invoiceId = formData.value.invoiceId
    } else {
        formInvalids.value.invoiceId = true
        formErrors.value.push("Не заполнено поле 'ИД накладной'")
    }

    if(formData.value.trainIndex)     data.trainIndex     = formData.value.trainIndex
    if(formData.value.trainNumber)    data.trainNumber    = formData.value.trainNumber
    if(formData.value.carStatus)      data.carStatus      = formData.value.carStatus
    if(formData.value.lastOperDt)     data.lastOperDt     = formData.value.lastOperDt
    if(formData.value.stateId)        data.stateId        = formData.value.stateId

    if(!formErrors.value.length) {
        tableStore.updateTable(data)
    }
}

onMounted(() => {

    formData.value.carNumber        = props.editRow.carNumber
    formData.value.trainIndex       = props.editRow.trainIndex
    formData.value.trainNumber      = props.editRow.trainNumber
    formData.value.carStatus        = props.editRow.carStatus
    formData.value.invoiceId        = props.editRow.invoiceId
    formData.value.invoiceNumber    = props.editRow.invoiceNumber
    formData.value.stateId          = props.editRow.stateId

    if(props.editRow.lastOperDt) {

        const d = new Date(props.editRow.lastOperDt)

        let year = d.getFullYear(),
            month = setStartZero(d.getMonth() + 1),
            day = setStartZero(d.getDate()),
            hours = d.getHours(),
            minutes = d.getMinutes()

        formData.value.lastOperDt = `${year}-${month}-${day}T${hours}:${minutes}`
    }
})

onBeforeUnmount(() => {

    tableStore.setTableEditProcess(false)
    tableStore.setTableEditMsg({})
})
</script>