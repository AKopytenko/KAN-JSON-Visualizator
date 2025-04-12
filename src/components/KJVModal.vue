<template>
    <div class="kjv-modal__mask">
        <div class="kjv-modal__wrapper">
            <div 
                class="kjv-modal__container" 
                :class="containerClasses"
            >
                <div class="kjv-modal__header">
                    <slot name="header">
                        <div class="kjv-modal__header-text">
                            {{ header }}
                        </div>
                    </slot>
                    <div class="kjv-modal__header-close material-icons" @click="$emit('closeModal', true)">
                        clear
                    </div>
                </div>
                <div class="kjv-modal__body">
                    <slot name="body"></slot>
                </div>
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    header: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: false
    },
    show: {
        type: Boolean,
        required: false,
        default: true
    }
});

const emit = defineEmits(['closeModal']);

const containerClasses = computed(() => ({
    'kjv-modal__container--md': props.size === 'md',
    'kjv-modal__container--lg': props.size === 'lg',
    'kjv-modal__container--xl': props.size === 'xl'
}));

let modal = null;

const handleClickOutside = (event) => {
    const modalBody = document.querySelector('.kjv-modal__container');
    if (!modalBody.contains(event.target)) {
        emit('closeModal', true)
    }
};

const handleEscapeKey = event => {
    if (event.code === "Escape") {
        emit('closeModal', true)
    }
};

onMounted(() => {

    const scrollbarWidth = window.innerWidth - document.body.offsetWidth;
    
    // Убираем x-скролбар
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Переносим модальное окно в корень body
    modal = document.querySelector('.kjv-modal__mask');
    document.body.appendChild(modal);

    // Клик вне модального окна
    const modalWrapper = document.querySelector('.kjv-modal__wrapper');
    modalWrapper.addEventListener('mousedown', handleClickOutside);

    // Закрытие по Esc
    document.addEventListener('keyup', handleEscapeKey);
});

onBeforeUnmount(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    if (modal) {
        document.body.removeChild(modal);
    }

    // Удаляем обработчики событий
    const modalWrapper = document.querySelector('.kjv-modal__wrapper');
    if (modalWrapper) {
        modalWrapper.removeEventListener('mousedown', handleClickOutside);
    }
    document.removeEventListener('keyup', handleEscapeKey);
});
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-modal.scss';
</style>