<template>
<div>
    <el-form size="mini" :inline="true" ref="form" :model="searchKey" style="text-align: right;position: relative;z-index:22222">
        <el-form-item label="预警时间:" class="warning-label">
            <div class="block">
                <el-date-picker
                    @change="handleChange"
                    v-model="searchKey.warningTime"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions">
                </el-date-picker>
            </div>
        </el-form-item>
    </el-form>
    <!-- <div class="c-dialog-wrapper"> -->
         <div class="c-dialog-content">
            <!-- 预警 -->
            <div class="c-scroll-wrap" v-if="type === 1 && this.waringDisEcharts">
                <ul class="echarts-list-wrap clearfix">
                    <li class="echarts-list">
                       <p class="title" style="background-color:rgba(204, 204, 204, 0.1)" v-if="this.waringDisEcharts[0]">{{this.waringDisEcharts[0].scatName}}</p>
                        <line-echarts :type="type" :lineEchartsData="lineEchartsData" :resizeLineFlag="resizeLineFlag" :activeName="activeName"></line-echarts>
                    </li>
                     <li class="echarts-list" v-if="this.waringDisEcharts[1]">
                       <p  class="title" style="background-color:rgba(204, 204, 204, 0.1)">{{this.waringDisEcharts[1].scatName}}</p>
                        <pies-echarts :type="type" :pieEchartsData="pieEchartsData" :resizePiesFlag="resizePiesFlag" :activeName="activeName"></pies-echarts>     
                    </li>
                    <li class="echarts-list" v-if="this.waringDisEcharts[2]">
                       <p  class="title" style="background-color:rgba(204, 204, 204, 0.1)">{{this.waringDisEcharts[2].scatName}}</p>
                        <bar-echarts  :type="type" :barEchartsData="barEchartsData" :resizeBarFlag="resizeBarFlag" :activeName="activeName"></bar-echarts>     
                    </li>
                </ul>
            </div> 
            <!-- 故障 -->
            <div class="c-scroll-wrap" v-if="type === 2 && this.faultDisEcharts">
                <ul class="c-scroll-inner">
                    <li class="echarts-classify-wrap">
                        <more-line-echarts :type="type" :lineEchartsData="lineEchartsData" :resizeLineFlag="resizeLineFlag" :activeName="activeName"></more-line-echarts>
                    </li>
                </ul>
                <ul class="echarts-list-wrap clearfix"> 
                     <li class="echarts-list">
                        <p  class="title" style="background-color: rgba(204, 204, 204, 0.1)" v-if="this.faultDisEcharts[3]">{{this.faultDisEcharts[3].scatName}}</p>
                        <bar-echarts  :type="type" :barEchartsData="barEchartsData" :resizeBarFlag="resizeBarFlag" :activeName="activeName"></bar-echarts>
                    </li>
                </ul>
            </div>
        </div>
    <!-- </div> -->
   
</div>
</template>
<script>
// import { getWarningDis } from '@/api/header';
// import warningEcharts from './warningEcharts';
import barEcharts from './echarts/barEcharts';
import lineEcharts from './echarts/lineEcharts';
import piesEcharts from './echarts/piesEcharts';
import moreLineEcharts from './echarts/moreLineEcharts';
import {getWarningDis, getFaultDis} from '@/api/header';
import Moment from 'moment';
export default {
    props: {
        type: Number,
        activeName: String
    },
    components: {
        barEcharts,
        lineEcharts,
        piesEcharts,
        moreLineEcharts
    },
    data() {
        return {
            waringDisEcharts: [],
            pieEchartsData: [],
            lineEchartsData: [],
            barEchartsData: [],
            faultDisEcharts: [],
            resizeLineFlag: false,
            resizeBarFlag: false,
            resizePiesFlag: false,
            searchKey: {
                startTime: '',
                endTime: '',
                warningTime: [new Date(2019, 6, 11), new Date(2019, 6, 23)]
            },
            searchHistory: {},
            waringDisEcharts: [],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            }
        }
    },
    created() {
        let _this = this;
		window.onresize = function(){ // 定义窗口大小变更通知事件
            _this.resizeFlagPie = true;
            _this.resizeFlagVertical = true;
            _this.resizeFlagHorizontal = true;
        };
        if (this.type === 1) {
            this.fetchWarningDis();
        } else {
            this.fetchFaultDis();
        }
    },
    methods: {
        handleChange(val) {
            this.searchKey.startTime = val[0];
            this.searchKey.endTime = val[1];
            if (this.type === 1) {
                this.fetchWarningDis();
            } else {
                this.fetchFaultDis();
            }
        },
        alreadyRender(classifyFlag) {
			this[classifyFlag] = false;
			// console.log(classifyFlag+'监听完毕');
        },
        fetchWarningDis() {
            this.waringDisEcharts = [];
            this.lineEchartsData = [];
            this.barEchartsData = [];
            this.pieEchartsData = [];
            let params = {
                'startTime': Moment(this.searchKey.warningTime[0]).format('YYYY-MM-DD'),
                'endTime': Moment(this.searchKey.warningTime[1]).format('YYYY-MM-DD'),
            };
            this.searchHistory = this.searchKey;
            getWarningDis(params).then(res => {
                this.waringDisEcharts = res.data.dataList;
                this.lineEchartsData = this.waringDisEcharts[0].data;
                this.pieEchartsData = this.waringDisEcharts[1].data;
                this.barEchartsData = this.waringDisEcharts[2].data;
                console.log('this.waringDisEcharts', this.waringDisEcharts);
            });
        },
        fetchFaultDis() {
            this.FaultDisEcharts = [];
            this.lineEchartsData = [];
            this.barEchartsData = [];
            this.pieEchartsData = [];
            let params = {
                'startTime': Moment(this.searchKey.warningTime[0]).format('YYYY-MM-DD'),
                'endTime': Moment(this.searchKey.warningTime[1]).format('YYYY-MM-DD'),
            };
            this.searchHistory = this.searchKey;
            getFaultDis(params).then(res => {
                this.faultDisEcharts = res.data.dataList;
                this.lineEchartsData = this.faultDisEcharts.slice(0,3);
                this.barEchartsData = this.faultDisEcharts[3].data;
                console.log('this.barEchartsData -==== ', this.barEchartsData);
            });
        }
		
    },
    computed: {
        filterEchartsDis() {
            if (this.type === 1) {
                return this.waringDisEcharts;
            } else {
                return this.faultDisEcharts;
            }
        }
    }
}
</script>
<style scoped lang="scss">
@import "@/assets/scss/echarts.scss";
.warning-echarts {
    text-align: right;
    position: absolute;
    right: 0px;
    top: 0px;
    float: right;
    .warning-label {
        line-height: 0;
    } 
}
</style>
