<template>
  <div class="c-circle-wrap clearfix">
    <h3 class="c-title">{{title}}</h3>
    <div class="c-echarts-box" :id="id"></div>
  </div>
</template>

<script>
// import { requestGetShareData } from '@/api/carMoniter'
export default {
	name: 'DrivingCarEcharts',
	props: {
	    title: String,
        id: String
	},
	data () {
		return {
			echarts: null,
			echartsOption: {
				grid:{
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 20
                },
                xAxis: {
                    type: 'category',
                    splitLine: {
                        show:false
                    },
                    axisLine:{
                        lineStyle:{
                            color:'rgba(211, 134, 0 , 0.4)'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        interval: 5,
                        textStyle: {
                        	color: "#918d84"
                        }
                    },
                    data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
                },
                yAxis:  {
                	type: 'value',
                    show: false
                },
                series: [{
                    name: "昨日在使车辆",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    symbolSize: 2,
                    lineStyle: {
                    	color: '#575757',
                    	width: 1
                    },
                    areaStyle: {
            			color: 'rgba(87, 87, 87, .1)'
            		},
                    data: [10, 12, 21, 54, 260, 830, 710, 10, 12, 21, 54, 260, 830, 710, 10, 12, 21, 54, 260, 830, 710, 10, 12, 21, 21]
                },{
                    name: "今日在使车辆",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    symbolSize: 2,
                    lineStyle: {
                    	color: '#37ba7b',
                    	width: 1
                    },
                    areaStyle: {
            			color: 'rgba(55, 186, 123, .1)'
            		},
                    data: [30, 182, 434, 791, 390, 30, 10, 30, 182, 434, 791, 390, 30, 10, 30]
                }]
			}		
		}
	},
	watch: {
	},
	created() {
		
	},
	mounted() {
		this.echarts = this.$echarts.init(document.getElementById(this.id));
		this.echarts.setOption(this.echartsOption);
	},
	methods: {
		
	}
}
</script>
<style lang="scss" scoped>

</style>
