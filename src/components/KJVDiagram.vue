<template>
    <div class="kjv-diagram my-4 p-3">
        <div class="kjv-diagram__wrapper p-3 has-shadow has-rounded text-center">
            <h3 class="mt-2 mb-4 kjv-diagram__header">Распределение данных по STATE ID</h3>
            <apexchart width="500" type="pie" :options="options" :series="series" style="margin: 0 auto"></apexchart>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {

    name: 'KJVDiagram',

    computed: {

        ...mapState({

            file: state => state.uploader.file
        }),

        options() {

            return {

                chart: {

                    id: 'kjv',
                    type: 'pie'
                },

                labels: []
            }
        },

        series() {

            return []
        }
    },

    mounted() {

        let labels = {}

        this.file.map(item => {

            !labels[item.stateId] ?
                labels[item.stateId] = [ item ] :
                labels[item.stateId].push(item)
        })

        const labelsKeys = Object.keys(labels)

        labelsKeys.map( label => {

            this.series.push(labels[label].length)
            this.options.labels.push('stateId ' + label)
        })
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-diagram';
</style>