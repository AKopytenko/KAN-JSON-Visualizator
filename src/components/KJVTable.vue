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

        <div class="my-4 container has-rounded has-shadow kjv-table__helper">
            <div class="row">   
                <div class="col">
                    <strong>Помощь:</strong>
                    <ul class="kjv-table__helper-list">
                        <li class="kjv-table__helper-list-item">Двойной клик по строке - переход к редактированию записи;</li>
                        <li class="kjv-table__helper-list-item">Клик по заголовку колонки - сортировка.</li>
                    </ul>
                </div>
            </div>
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

<script setup>
import { computed, ref } from 'vue'
import { useUploaderStore } from '@/stores/uploader'
import KJVModal from '@/components/KJVModal'
import KJVTableEdit from '@/components/KJVTableEdit'

const uploaderStore = useUploaderStore()

const editRow       = ref(null)
const showEditRow   = ref(false)
const orderedBy     = ref({
    ordNumber:      null,
    carNumber:      null,
    trainIndex:     null,
    trainNumber:    null,
    lastOperDt:     null,
    invoiceNumber:  null,
    invoiceId:      null,
    stateId:        null
})

const searchMode = ref("all")
const searchText = ref("")

const uploadFile = computed(() => uploaderStore.uploadFile)

const filteredList = computed(() => {

    let result = uploadFile.value
    
    if (!result) return []
    
    // Фильтрация по поиску
    if (searchText.value.length > 1) {
        if (searchMode.value === 'all') {
            result = result.filter(item => 
                String(item.carNumber).includes(searchText.value) || 
                String(item.trainIndex).includes(searchText.value) || 
                String(item.trainNumber).includes(searchText.value) || 
                String(item.invoiceNumber).includes(searchText.value) || 
                String(item.invoiceId).includes(searchText.value)
            )
        } else {
            result = result.filter(item => 
                String(item[searchMode.value]).includes(searchText.value)
            )
        }
    }
    
    // Сортировка
    const sortKey = Object.keys(orderedBy.value).find(key => orderedBy.value[key])
    if (sortKey) {
        const direction = orderedBy.value[sortKey]
        result = [...result].sort((a, b) => getComparator(a, b, sortKey, direction))
    }
    
    return result
})

const getComparator = (a, b, sortKey, direction) => {

    const order = direction === 'asc' ? 1 : -1
    
    switch(sortKey) {
        case 'ordNumber':
        case 'carNumber':
        case 'trainNumber':
        case 'invoiceId':
        case 'stateId':
            return (a[sortKey] == b[sortKey] ? 0 : (a[sortKey] > b[sortKey] ? 1 : -1)) * order
        
        case 'trainIndex': {
            const aVal = a.trainIndex ? String(a.trainIndex).replace(/^0+/, '') : 0
            const bVal = b.trainIndex ? String(b.trainIndex).replace(/^0+/, '') : 0
            return (aVal == bVal ? 0 : (aVal > bVal ? 1 : -1)) * order
        }
        
        case 'carStatus':
        case 'invoiceNumber': {
            const aStr = a[sortKey] || ''
            const bStr = b[sortKey] || ''
            return (aStr === bStr ? 0 : (aStr > bStr ? 1 : -1)) * order
        }
        
        case 'lastOperDt': {
            const aDate = new Date(a.lastOperDt).getTime()
            const bDate = new Date(b.lastOperDt).getTime()
            return (aDate == bDate ? 0 : (aDate > bDate ? 1 : -1)) * order
        }
        
        default:
            return 0
    }
}

const sortBy = (mode) => {

    // Изменение порядка сортировки
    Object.keys(orderedBy.value).forEach(key => {
        if (key !== mode) orderedBy.value[key] = null
    })
    
    if (orderedBy.value[mode] === 'asc') {
        orderedBy.value[mode] = 'desc'
    } else {
        orderedBy.value[mode] = 'asc'
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-table.scss';
</style>