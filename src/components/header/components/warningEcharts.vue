<template>
    <div>
        <ul class="echarts-list-wrap clearfix">
            <li class="echarts-list box" v-for="(item, index) in filterEchartsDis">
                <p class="echarts-list-title">{{item.scatName}}</p>
                <line-echarts v-if="item.scatName === '预警趋势' || item.scatName === '故障趋势' || item.scatName === '车辆故障趋势' || item.scatName === '路侧故障趋势'" :type="type" :lineEchartsData="item.data" :resizeLineFlag="resizeLineFlag" :activeName="activeName"></line-echarts>
                <pies-echarts  v-if="item.scatName === '预警种类' "  :type="type" :pieEchartsData="item.data" :resizePiesFlag="resizePiesFlag" :activeName="activeName"></pies-echarts>
                <bar-echarts v-if="item.scatName === 'TOP5预警列表' || item.scatName === 'TOP5故障列表' "  :type="type" :barEchartsData="item.data" :resizeBarFlag="resizeBarFlag" :activeName="activeName"></bar-echarts>
            </li>
        </ul>
    </div> 
</template>
<script>
import barEcharts from './echarts/barEcharts';
import lineEcharts from './echarts/lineEcharts';
import piesEcharts from './echarts/piesEcharts';
import {getWarningDis, getFaultDis} from '@/api/header';
import Moment from 'moment';
export default {
    props: {
        searchKey: Object,
        type: Number,
        activeName: String
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
            resizePiesFlag: false
        };
    },
    components: {
        barEcharts,
        lineEcharts,
        piesEcharts
    },
    created() {
        if (this.type === 1) {
            this.fetchWarningDis();
        } else {
            this.fetchFaultDis();
        }
        let _this = this;
		window.onresize = function(){ // 定义窗口大小变更通知事件
            _this.resizeLineFlag = true;
            _this.resizeBarFlag = true;
            _this.resizePiesFlag = true;
        };
    },
    computed: {
        filterEchartsDis() {
            if (this.type === 1) {
                return this.waringDisEcharts;
            } else if (this.type === 2) {
                return this.faultDisEcharts;
            }
        }
     },
    methods: {
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
                this.lineEchartsData = this.faultDisEcharts[1].data;
                // console.log('this.FaultDisEcharts ---- -====', this.faultDisEcharts);
            });
        },
        alreadyRender(classifyFlag) {
			this[classifyFlag] = false;
			// console.log(classifyFlag+'监听完毕');
		}
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/echarts.scss";
</style>
