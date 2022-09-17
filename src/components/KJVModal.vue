<template>
    <div class="kjv-modal__mask">
        <div class="kjv-modal__wrapper">
            <div 
                class="kjv-modal__container" 
                :class="{ 
                    'kjv-modal__container--md' : size && size == 'md',
                    'kjv-modal__container--lg' : size && size == 'lg',
                    'kjv-modal__container--xl' : size && size == 'xl'
                }
            ">
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

<script>
import { mapGetters } from 'vuex'

export default {

    name: 'KJVModal',

    data() {

        return {

            modal: null
        }
    },

    props: {

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
    },

    emits: [

        'closeModal'
    ],

    computed: {

        ...mapGetters([

            'getTranslate'
        ])
    },

    mounted() {

        const self = this

        const modalWrapper      = document.getElementsByClassName('kjv-modal__wrapper')[0]
        const modalBody         = document.getElementsByClassName('kjv-modal__container')[0]
        const scrollbarWidth    = window.innerWidth - document.body.offsetWidth

        // Убираем x-скролбар
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${scrollbarWidth}px`

        // Переносим модальное окно в корень body [головняк с позиционированием = disable]
        this.modal = document.getElementsByClassName('kjv-modal__mask')[0]
        document.body.appendChild(this.modal)

        // Клик вне модального окна закрывает его
        modalWrapper.addEventListener('mousedown', function(event) {

            if(!modalBody.contains(event.target)) {

                self.$emit('closeModal', true)
            }
        })

        // Закрытие модального окна по нажатию Esc
        document.addEventListener('keyup', event => event.code == "Escape" ? this.$emit('closeModal', true) : null )
    },

    beforeUnmount() {

        document.body.style.overflow = ''
        document.body.style.paddingRight = ''

        document.body.removeChild(this.modal)
    }
}
</script>

<style lang="scss">
@import '@/assets/styles/scss/components/kjv-modal.scss';
</style>