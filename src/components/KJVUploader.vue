<template>

    <div class="kjv-uploader">

        <form action="/" @submit.prevent="uploadFile()" class="kjv-uploader__form">

            <input type="file" accept=".txt" class="form-control kjv-uploader__form-input" id="kjvFile">

        </form>

    </div>

</template>

<script>
export default {

    name: 'KJVUploader',

    data() {

        return {

            file: null
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-uploader';
</style>