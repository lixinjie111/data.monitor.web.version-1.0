<template>
<div>
    <el-form size="mini" :inline="true" ref="form" :model="searchKey" style="text-align: right;margin-bottom:10px">
        <el-form-item label="预警时间:" style="margin: 0 5px 0 0;">
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
    <div class="c-dialog-content" style="margin-top: 20px; top: 90px;bottom:20px;padding: 0 0 0 15px">
        <div class="c-scroll-wrap">
            <div class="c-scroll-inner">
                <!-- 预警 -->
                <ul class="echarts-list-wrap clearfix">
                    <!-- 折线图 -->
                    <li class="echarts-list"  v-for="(item, index) in lineEchartsData" :key="item.scatType">
                        <p class="echarts-list-title">{{item.scatName}}</p>
                        <line-echarts :type="type" :lineEchartsData="item.data" :count="count" :activeName="activeName" :id="'line' + index" v-if="item.data.length"></line-echarts>
                        <p class="echarts-list-box echarts-empty" v-else>暂无数据</p>
                    </li>
                    <!-- 饼图 -->
                    <li class="echarts-list" v-for="(item, index) in pieEchartsData" :key="item.scatType">
                        <p  class="echarts-list-title">{{item.scatName}}</p>
                        <pies-echarts :type="type"  :pieEchartsData="item.data" :count="count" :activeName="activeName" :id="'pie' + index" v-if="item.data.length"></pies-echarts>
                        <p class="echarts-list-box echarts-empty" v-else>暂无数据</p>     
                    </li>
                    <!-- 横向柱状图 -->
                    <li class="echarts-list" v-for="(item, index) in barEchartsData" :key="item.scatType">
                        <p  class="echarts-list-title">{{item.scatName}}</p>
                        <bar-echarts  :type="type"  :barEchartsData="item.data" :count="count" :activeName="activeName" :id="'bar' + index" v-if="item.data.length"></bar-echarts>
                        <p class="echarts-list-box echarts-empty" v-else>暂无数据</p>     
                    </li>
                </ul>
            </div>
        </div>
    </div>
   
   
</div>
</template>
<script>
// import { getWarningDis } from '@/api/header';
// import warningEcharts from './warningEcharts';
import barEcharts from './echarts/barEcharts';
import lineEcharts from './echarts/lineEcharts';
import piesEcharts from './echarts/piesEcharts';
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
        piesEcharts
    },
    data() {
        return {

            count: 0,

            pieEchartsData: [],
            lineEchartsData: [],
            barEchartsData: [],

            waringDisEcharts: [],
            faultDisEcharts: [],

            resizeFlag: false,
            searchKey: {
                startTime: '',
                endTime: '',
                // warningTime: [new Date(2019, 6, 11), new Date(2019, 6, 23)]
                warningTime: [new Date(), new Date()],
            },
            searchHistory: {},
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
            _this.count += 5;
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
                this.lineEchartsData.push(this.waringDisEcharts[0]);
                this.pieEchartsData.push(this.waringDisEcharts[1]);
                this.barEchartsData.push(this.waringDisEcharts[2]);

                this.count += 1;
            });
        },
        fetchFaultDis() {
            this.FaultDisEcharts = [];
            this.lineEchartsData = {};
            this.barEchartsData = [];
            this.pieEchartsData = [];
            let params = {
                'startTime': Moment(this.searchKey.warningTime[0]).format('YYYY-MM-DD'),
                'endTime': Moment(this.searchKey.warningTime[1]).format('YYYY-MM-DD'),
            };
            this.searchHistory = this.searchKey;
            getFaultDis(params).then(res => {
                this.faultDisEcharts = res.data.dataList;
                this.lineEchartsData = new Object(this.faultDisEcharts.slice(0,3))
                this.barEchartsData.push(this.faultDisEcharts[3]);

                this.count += 1;
            });
        }
		
    }
}
</script>
<style scoped lang="scss">
@import "@/assets/scss/theme.scss";
@import "@/assets/scss/echarts.scss";
.echarts-list-wrap {
    .echarts-list {
        margin-bottom: 18px;
        margin-top: 0;
    }
    .echarts-list-title {
        text-align: left;
    }
    .echarts-empty {
        font-size: 16px;
        color: #ccc;
        @include layoutMode(both);
    }
}
</style>
