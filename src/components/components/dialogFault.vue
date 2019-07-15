<template>
    <div class="c-dialog-wrapper">
        <div class="c-dialog-container">
            <div class="c-dialog-header">
                <span class="c-dialog-title">故障信息</span>
                <i class="c-dialog-close" @click="closeDialog"></i>
            </div>
            <div class="c-dialog-content">
                <div class="c-scroll-wrap">
                    <ul class="c-scroll-inner">
                        故障
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "DialogFault",
    props: {
        
    },
    data() {
        return {
           
        }
    },
    mounted(){
    },
    methods: {
        closeDialog() {
            this.$emit("closeDialogFault");
        }
    }
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/theme.scss';

</style>