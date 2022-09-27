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
                <input type="text" class="form-control" id="carNumber" v-model="carNumber" :class="{ 'invalid' : formInvalids.carNumber }">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="trainIndex">Индекс поезда</label>
                <input type="text" class="form-control" id="trainIndex" v-model="trainIndex">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="trainNumber">Номер поезда</label>
                <input type="text" class="form-control" id="trainNumber" v-model="trainNumber">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="carStatus">Статус</label>
                <input type="text" class="form-control" id="carStatus" v-model="carStatus">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="lastOperDt">Дата-время операции</label>
                <input type="datetime-local" class="form-control" id="lastOperDt" v-model="lastOperDt">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="invoiceNumber">№ накладной</label>
                <input type="text" class="form-control" id="invoiceNumber" v-model="invoiceNumber" :class="{ 'invalid' : formInvalids.invoiceNumber }">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="invoiceId">ИД накладной</label>
                <input type="text" class="form-control" id="invoiceId" v-model="invoiceId" :class="{ 'invalid' : formInvalids.invoiceId }">
            </div>

            <div class="form-group mb-4 col-12 col-md-6">
                <label for="stateId">stateId</label>
                <input type="text" class="form-control" id="stateId" v-model="stateId">
            </div>

        </div>

        <div class="mt-4 btns text-end">
            <button class="btn">Отмена</button>
            <button class="btn btn--primary ms-4" type="submit">Сохранить</button>
        </div>

    </form>

</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {

    name: 'KJVTableEdit',

    props: {

        editRow: {

            type: Object,
            required: true
        }
    },

    data() {

        return {

            carNumber:      '',
            trainIndex:     '',
            trainNumber:    '',
            carStatus:      '',
            invoiceId:      '',
            invoiceNumber:  '',
            stateId:        '',
            lastOperDt:     '',

            formInvalids: {},
            formErrors: []
        }
    },

    computed: {

        ...mapState({

            tableEditPeocess:   state => state.table.tableEditPeocess,
            tableEditMsg:       state => state.table.tableEditMsg
        })
    },

    methods: {

        ...mapActions([

            'updateRow'
        ]),

        ...mapMutations([

            'setTableEditProcess',
            'setTableEditMsg'
        ]),

        /**
         * setStartZero
         * 
         * Ставит ведущий ноль в месяц и число
         * 
         * @param {Number} value - входящее значение
         * @return {String} - входящее число >=2 или двухзначное число с ведущим нулём
         */
        setStartZero(value) {

            value = String(value)

            return value.length == 1 ? '0' + value : value
        },

        submitForm() {

            this.formInvalids = {}
            this.formErrors = []

            let data = {

                ordNumber: this.editRow.ordNumber
            }

            if(this.carNumber.length) {

                data.carNumber = this.carNumber

            } else {

                this.formInvalids.carNumber = true
                this.formErrors.push("Не заполнено поле 'Номер вагона'")
            }

            if(this.invoiceNumber.length) {

                data.invoiceNumber = this.invoiceNumber

            } else {

                this.formInvalids.invoiceNumber = true
                this.formErrors.push("Не заполнено поле '№ накладной'")
            }

            if(this.invoiceId.length) {

                data.invoiceId = this.invoiceId

            } else {

                this.formInvalids.invoiceId = true
                this.formErrors.push("Не заполнено поле 'ИД накладной'")
            }

            if(this.trainIndex)     data.trainIndex     = this.trainIndex
            if(this.trainNumber)    data.trainNumber    = this.trainNumber
            if(this.carStatus)      data.carStatus      = this.carStatus
            if(this.lastOperDt)     data.lastOperDt     = this.lastOperDt

            if(!this.formErrors.length) {

                this.updateRow(data)
            }
        }
    },

    mounted() {

        this.carNumber      = this.editRow.carNumber
        this.trainIndex     = this.editRow.trainIndex
        this.trainNumber    = this.editRow.trainNumber
        this.carStatus      = this.editRow.carStatus
        this.invoiceId      = this.editRow.invoiceId
        this.invoiceNumber  = this.editRow.invoiceNumber
        this.stateId        = this.editRow.stateId

        if(this.editRow.lastOperDt) {

            console.log('Входное: ', this.editRow.lastOperDt)

            const d     = new Date(this.editRow.lastOperDt)

            let year    = d.getFullYear(),
                month   = this.setStartZero(d.getMonth() + 1),
                day     = this.setStartZero(d.getDate()),
                hours   = d.getHours(),
                minutes = d.getMinutes()

            this.lastOperDt = `${year}-${month}-${day}T${hours}:${minutes}`

            console.log(this.lastOperDt)

        } else {

            this.lastOperDt = null
        }
    },

    beforeUnmount() {

        this.setTableEditProcess(false)
        this.setTableEditMsg({})
    }
}
</script>