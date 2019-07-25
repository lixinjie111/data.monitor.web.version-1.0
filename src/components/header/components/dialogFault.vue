<template>
    <div class="c-dialog-wrapper">
        <div class="c-dialog-container">
            <div class="c-dialog-header">
                <span class="c-dialog-title">故障信息</span>
                <i class="c-dialog-close" @click="closeDialog"></i>
            </div>
            <div class="c-dialog-content">
                <div class="c-scroll-wrap">
                    <div class="c-scroll-inner">
                        <el-tabs type="border-card"  @tab-click="handleClick">
                            <el-tab-pane label="故障列表" name="tableOne">
                                <!-- 预警table表格组件 -->
                                <!-- <car-warning-table :type="type"></car-warning-table> -->
                            </el-tab-pane>
                            <el-tab-pane label="故障分析" name="tableTwo">
                                <!-- 预警分析echart图表 -->
                                <!-- <car-fault-echarts :type="type" ></car-fault-echarts> -->
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import CarWarningTable from './carWarningTable';
// import CarFaultEcharts from './carFaultEcharts';
export default {
    name: "DialogFault",
    props: {
       type: Number
    },
    // components: {
    //     CarWarningTable,
    //     CarFaultEcharts
    // },
    data() {
        return {
           
        }
    },
    mounted(){
    },
    methods: {
        closeDialog() {
            this.$emit("closeDialogFault");
        },
        handleClick(tab, event) {
            console.log(this.activeName);
        }
    }
}
</script>
<style scoped lang="scss">
@import '@/assets/scss/theme.scss';
.c-dialog-content {
    padding: 0;
    &:before {
        right: 5px;
    }
}
</style>