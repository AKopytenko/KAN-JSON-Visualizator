<template>

    <div class="my-4 p-3 kjv-table">

        <div class="mt-2 mb-4 input-group flex-nowrap has-rounded has-shadow kjv-table__search">
            <select class="form-select kjv-table__search-select" v-model="searchMode">
                <option value="all">Все поля</option>
                <option value="carNumber">Номер вагона</option>
                <option value="trainIndex">Индекс поезда</option>
                <option value="trainNumber">Номер поезда</option>
                <option value="invoiceNumber">№ накладной</option>
                <option value="invoiceId">ИД накладной</option>
            </select>
            <input id="KJVSearchText" type="text" class="form-control kjv-table__search-input" placeholder="..." v-model="searchText">
            <label for="KJVSearchText" class="input-group-text kjv-table__search-clear" id="basic-addon2" @click="searchText = ''">{{ searchText.length == 0 ? 'Поиск' : '&times;' }}</label>
        </div>

        <div class="container has-rounded has-shadow kjv-table__data">
            <div class="row">
                <div class="col">
                    <div class="table m-0">
                        <div class="d-none d-xl-block table__head">
                            <div class="row table__head-row">
                                <div class="col-12 col-xl-1 table__head-col" @click="sortBy('ordNumber')">
                                    № п/п
                                    <span class="material-icons" v-if="orderedBy.ordNumber">
                                        {{ orderedBy.ordNumber == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-1 table__head-col" @click="sortBy('carNumber')">
                                    Номер вагона
                                    <span class="material-icons" v-if="orderedBy.carNumber">
                                        {{ orderedBy.carNumber == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-2 table__head-col" @click="sortBy('trainIndex')">
                                    Индекс поезда
                                    <span class="material-icons" v-if="orderedBy.trainIndex">
                                        {{ orderedBy.trainIndex == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-1 table__head-col" @click="sortBy('trainNumber')">
                                    Номер поезда
                                    <span class="material-icons" v-if="orderedBy.trainNumber">
                                        {{ orderedBy.trainNumber == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-2 table__head-col" @click="sortBy('carStatus')">
                                    Статус
                                    <span class="material-icons" v-if="orderedBy.carStatus">
                                        {{ orderedBy.carStatus == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-2 table__head-col" @click="sortBy('lastOperDt')">
                                    Дата-время операции
                                    <span class="material-icons" v-if="orderedBy.lastOperDt">
                                        {{ orderedBy.lastOperDt == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-1 table__head-col" @click="sortBy('invoiceNumber')">
                                    № накладной
                                    <span class="material-icons" v-if="orderedBy.invoiceNumber">
                                        {{ orderedBy.invoiceNumber == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-1 table__head-col" @click="sortBy('invoiceId')">
                                    ИД накладной
                                    <span class="material-icons" v-if="orderedBy.invoiceId">
                                        {{ orderedBy.invoiceId == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                                <div class="col-12 col-xl-1 text-xl-end table__head-col" @click="sortBy('stateId')">
                                    stateId
                                    <span class="material-icons" v-if="orderedBy.stateId">
                                        {{ orderedBy.stateId == 'asc' ? 'arrow_drop_down' : 'arrow_drop_up' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="table__body">
                            <template v-if="filteredList.length">
                                <div 
                                    class="row table__row" 
                                    v-for="(row, index) in filteredList" 
                                    :key="index" 
                                    :class="{ 'table__row--odd' : index % 2 == 0 }"
                                    @dblclick="editRow = row, showEditRow = true"
                                >
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-1 table__col">
                                        <div class="table__col-label d-block d-xl-none">№ п/п: </div>
                                        {{ row.ordNumber || "-" }}
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-1">
                                        <div class="table__col-label d-block d-xl-none">Номер вагона: </div>
                                        {{ row.carNumber || "-" }}
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-2">
                                        <div class="table__col-label d-block d-xl-none">Индекс поезда: </div>
                                        {{ row.trainIndex || "-" }}
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-1">
                                        <div class="table__col-label d-block d-xl-none">Номер поезда: </div>
                                        {{ row.trainNumber || "-" }}
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-2">
                                        <div class="table__col-label d-block d-xl-none">Статус: </div>
                                        {{ row.carStatus || "-" }}
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-2">
                                        <div class="table__col-label d-block d-xl-none">Дата-время операции: </div>
                                        {{ 
                                            row.lastOperDt ? 
                                                new Date(row.lastOperDt).toLocaleString() : 
                                                "-"
                                        }}
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-1">
                                        <div class="table__col-label d-block d-xl-none">№ накладной: </div>
                                        {{ row.invoiceNumber || "-" }}
                                    </div>
                                    <div class="col-12 col-sm-6 col-md-4 col-xl-1">
                                        <div class="table__col-label d-block d-xl-none">ИД накладной: </div>
                                        {{ row.invoiceId || "-" }}
                                    </div>
                                    <div class="col-12 col-xl-1 text-xl-end">
                                        <div class="table__col-label d-block d-xl-none">stateId: </div>
                                        {{ row.stateId || "-" }}
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="row table__row table__row--odd">
                                    <div class="col">
                                        Записей не обнаружено...
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <transition name="bounce">
            <KJVModal 
                v-if="showEditRow"
                header="Редактирование"
                size="lg"
                @closeModal="showEditRow = false"
            >
                <template v-slot:body>
                    <KJVTableEdit :editRow="editRow" @closeModal="showEditRow = false" />
                </template>
            </KJVModal>
        </transition>

    </div>

</template>

<script>
import { mapState } from 'vuex'
import KJVModal     from '@/components/KJVModal'
import KJVTableEdit from '@/components/KJVTableEdit'

export default {

    name: 'KJVTable',

    data() {

        return {

            editRow: null,
            showEditRow: false,

            orderedBy: {

                ordNumber: null,
                carNumber: null,
                trainIndex: null,
                trainNumber: null,
                lastOperDt: null,
                invoiceNumber: null,
                invoiceId: null,
                stateId: null
            },

            searchMode:     "all",
            searchText:     ""
        }
    },

    components: {

        KJVModal,
        KJVTableEdit
    },

    computed: {

        ...mapState({

            file: state => state.uploader.file
        }),

        filteredList() {

            let result = this.file

            if(result) {

                if(this.searchText.length > 1) {

                    if(this.searchMode == 'all') {

                        result = this.file.filter(item => {

                            if(
                                String(item.carNumber).includes(this.searchText)        || 
                                String(item.trainIndex).includes(this.searchText)       || 
                                String(item.trainNumber).includes(this.searchText)      || 
                                String(item.invoiceNumber).includes(this.searchText)    || 
                                String(item.invoiceId).includes(this.searchText)
                            ) {

                                return item
                            }
                        })

                    } else {

                        result = this.file.filter(item => String(item[this.searchMode]).includes(this.searchText))
                    }
                }

                return result

            } else {

                return []
            }
        }
    },

    methods: {

        sortBy(mode) {

            let orderDirection

            // Изменение порядка сортировки
            Object.keys(this.orderedBy).map(key => {
                if(key !== mode) this.orderedBy[key] = null
            })

            if(this.orderedBy[mode] == 'asc') {
                orderDirection = '<'
                this.orderedBy[mode] = 'desc'
            } else {
                orderDirection = '>'
                this.orderedBy[mode] = 'asc'
            }

            switch(mode) {

                case 'ordNumber': this.filteredList.sort((cur, prev) => {
                    return cur.ordNumber == prev.ordNumber ? 
                        0 : 
                        eval(cur.ordNumber + orderDirection + prev.ordNumber) ? 1 : -1
                })
                break

                case 'carNumber': this.filteredList.sort((cur, prev) => {
                    return cur.carNumber == prev.carNumber ? 
                        0 :
                        eval(cur.carNumber + orderDirection + prev.carNumber) ? 1 : -1
                })
                break

                case 'trainIndex': this.filteredList.sort((cur, prev) => {
                    cur = cur.trainIndex ? String(cur.trainIndex).replace(/^0+/, '') : 0
                    prev = prev.trainIndex ? String(prev.trainIndex).replace(/^0+/, '') : 0
                    return cur == prev ?
                        0 :
                        eval(cur + orderDirection + prev) ? 1 : -1
                })
                break

                case 'trainNumber': this.filteredList.sort((cur, prev) => {
                    return cur.trainNumber == prev.trainNumber ?
                        0 :
                        eval(cur.trainNumber + orderDirection + prev.trainNumber) ? 1 : -1
                })
                break

                case 'carStatus': this.filteredList.sort((cur, prev) => {

                    cur = cur.carStatus || ''
                    prev = prev.carStatus || ''

                    if(cur == prev) {

                        return 0

                    } else {

                        return orderDirection == '>' ?
                            cur > prev ? -1 : 1 :
                            cur < prev ? -1 : 1
                    }   
                })
                break

                case 'lastOperDt': this.filteredList.sort((cur, prev) => {
                    cur = new Date(cur.lastOperDt).getTime()
                    prev = new Date(prev.lastOperDt).getTime()
                    return cur == prev ?
                        0 :
                        eval(cur + orderDirection + prev) ? 1 : -1
                })
                break

                case 'invoiceNumber': this.filteredList.sort((cur, prev) => {

                    cur = cur.invoiceNumber || ''
                    prev = prev.invoiceNumber || ''

                    if(cur == prev) {

                        return 0

                    } else {

                        return orderDirection == '>' ?
                            cur > prev ? -1 : 1 :
                            cur < prev ? -1 : 1
                    }   
                })
                break

                case 'invoiceId': this.filteredList.sort((cur, prev) => {
                    return cur.invoiceId == prev.invoiceId ?
                        0 :
                        eval(cur.invoiceId + orderDirection + prev.invoiceId) ? 1 : -1
                })
                break

                case 'stateId': this.filteredList.sort((cur, prev) => {
                    return cur.stateId == prev.stateId ?
                        0 :
                        eval(cur.stateId + orderDirection + prev.stateId) ? 1 : -1
                })
                break
            }
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-table';
</style>