<template>
	<div class="c-dialog-wrapper c-wraning-dialog">
        <div class="c-dialog-container">
            <div class="c-dialog-header">
                <span class="c-dialog-title">{{type === 1 ? '预警信息' : '故障信息'}}</span>
                <i class="c-dialog-close" @click="closeDialog"></i>
            </div>
            <div class="c-dialog-content" >
                <!-- <div class="c-scroll-wrap"> -->
                    <!-- <div class="c-scroll-inner"> -->
                        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                            <el-tab-pane :label="type === 1 ? '预警列表' : '故障列表'" name="tabOne">
                                <!-- 预警table表格组件 -->
                                <warning-fault-table :type="type"></warning-fault-table>
                            </el-tab-pane>
                            <el-tab-pane :label="type === 1 ? '预警分析' : '故障分析'" name="tabTwo">
                                <!-- 预警分析echart图表 -->
                                <warning-fault-echarts :type="type" :activeName="activeName"></warning-fault-echarts>
                            </el-tab-pane>
                        </el-tabs>
                    <!-- </div> -->
                <!-- </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import WarningFaultTable from './warningFaultTable';
import WarningFaultEcharts from './warningFaultEcharts';
export default {
	name: "DialogWarning",
    props: {
        type: Number
    },
    components: {
        WarningFaultTable,
        WarningFaultEcharts
    },
    data() {
        return {
            activeName: 'tabOne'
        }
    },
    mounted(){
    },
    methods: {
        handleClick(tab, event) {
            // console.log(this.activeName);
        },
        closeDialog() {
            this.$emit("closeDialogWarning");
        }
    }
}
</script>
<style lang="scss">
@import '@/assets/scss/theme.scss';
.c-wraning-dialog {
  .c-dialog-content {
    padding: 0!important;
    &:before {
      // right: 5px;
      background: none!important;
    }
  }
}
</style>


