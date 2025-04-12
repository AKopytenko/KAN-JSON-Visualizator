<template>
    <div class="kjv-diagram my-4 p-3">
        <div class="kjv-diagram__wrapper p-3 has-shadow has-rounded text-center">
            <h3 class="mt-2 mb-4 kjv-diagram__header">Распределение данных по STATE ID</h3>
            <apexchart 
                width="500" 
                type="pie" 
                :options="chartOptions" 
                :series="chartSeries"
                style="margin: 0 auto"
            ></apexchart>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const file = computed(() => store.state.uploader.file);

const chartSeries = ref([]);
const chartLabels = ref([]);

const chartOptions = computed(() => ({
    chart: {
        id: 'kjv',
        type: 'pie'
    },
    labels: chartLabels.value
}));

onMounted(() => {
    const labels = {};

    file.value.forEach(item => {
        if (!labels[item.stateId]) {
            labels[item.stateId] = [item];
        } else {
            labels[item.stateId].push(item);
        }
    });

    const labelsKeys = Object.keys(labels);
    
    labelsKeys.forEach(label => {
        chartSeries.value.push(labels[label].length);
        chartLabels.value.push('stateId ' + label);
    });
});
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-diagram.scss';
</style>