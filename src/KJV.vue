<template>
    <div class="container">
        <KJVTable />
        <KJVDiagram v-if="file.length" />
        <KJVUploader />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import KJVTable from '@/components/KJVTable.vue'
import KJVDiagram from '@/components/KJVDiagram.vue'
import KJVUploader from '@/components/KJVUploader.vue'

const store = useStore()

const file = computed(() => store.state.uploader.file)

const readFile = () => store.dispatch('readFile')

onMounted(() => {

    if (localStorage.getItem('KJV_DATA')) {
        readFile()
    }
})
</script>

<style lang="scss">
@import '@/assets/styles/scss/layout.scss';
</style>