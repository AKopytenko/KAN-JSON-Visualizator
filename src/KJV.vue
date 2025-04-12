<template>
    <div class="container">
        <KJVTable />
        <KJVDiagram v-if="uploadFile.length" />
        <KJVUploader />
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useUploaderStore } from '@/stores/uploader'

import KJVTable from '@/components/KJVTable.vue'
import KJVDiagram from '@/components/KJVDiagram.vue'
import KJVUploader from '@/components/KJVUploader.vue'

const uploaderStore = useUploaderStore()

const uploadFile = computed(() => uploaderStore.uploadFile)

onMounted(() => {

    if (localStorage.getItem('KJV_DATA')) {
        uploaderStore.readFile()
    }
})
</script>

<style lang="scss">
@import '@/assets/styles/scss/layout.scss';
</style>