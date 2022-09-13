<template>

    <div class="container">

        <!-- <KJVUploader />

        <KJVDiagram /> -->

        <KJVTable />

    </div>

</template>

<script>

// import KJVUploader  from '@/components/KJVUploader.vue'
// import KJVDiagram   from '@/components/KJVDiagram.vue'
import KJVTable     from '@/components/KJVTable.vue'

export default {

    name: 'KJV',

    components: {

        // KJVUploader,
        // KJVDiagram,
        KJVTable
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/layout.scss';
</style>