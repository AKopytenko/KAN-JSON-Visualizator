<template>

    <div class="container">

        <KJVTable />
        <KJVDiagram v-if="file.length" />
        <KJVUploader />

    </div>

</template>

<script>

import { mapActions, mapState } from 'vuex'

import KJVTable     from '@/components/KJVTable.vue'
import KJVDiagram   from '@/components/KJVDiagram.vue'
import KJVUploader  from '@/components/KJVUploader.vue'

export default {

    name: 'KJV',

    components: {

        KJVTable,
        KJVDiagram,
        KJVUploader
    },

    computed: {

        ...mapState({

            file: state => state.uploader.file
        })
    },

    methods: {

        ...mapActions([

            'readFile'
        ])
    },

    mounted() {

        if(localStorage.getItem('KJV_DATA')) {

            console.log('Есть дата')

            this.readFile()
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/layout.scss';
</style>