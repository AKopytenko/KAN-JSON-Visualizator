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
                            <div class="row table__row">
                                <div class="col-12 col-xl-1">№ п/п</div>
                                <div class="col-12 col-xl-1">Номер вагона</div>
                                <div class="col-12 col-xl-2">Индекс поезда</div>
                                <div class="col-12 col-xl-1">Номер поезда</div>
                                <div class="col-12 col-xl-2">Статус</div>
                                <div class="col-12 col-xl-2">Дата-время операции</div>
                                <div class="col-12 col-xl-1">№ накладной</div>
                                <div class="col-12 col-xl-1">ИД накладной</div>
                                <div class="col-12 col-xl-1 text-xl-end">stateId</div>
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

            editRow:        null,
            showEditRow:    false,

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

                if(this.searchText.length > 2) {

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
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-table';
</style>