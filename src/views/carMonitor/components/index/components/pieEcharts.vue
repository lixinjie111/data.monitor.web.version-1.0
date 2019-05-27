
<template>
	<ul class="echarts-list-wrap clearfix">
		<li class="echarts-list">
			<p class="echarts-list-title">车型品牌分布</p>
			<div class="echarts-list-box" id="echarts-pie"></div>
		</li>
		<!-- <li class="echarts-list">
			<p class="echarts-list-title">车辆自动驾驶等级分布</p>
			<div class="echarts-list-box"></div>
		</li>
		<li class="echarts-list">
			<p class="echarts-list-title">车辆用途分布</p>
			<div class="echarts-list-box"></div>
		</li>
		<li class="echarts-list">
			<p class="echarts-list-title">车辆动力类型分布</p>
			<div class="echarts-list-box"></div>
		</li> -->
	</ul>
</template>

<script>
// import { requestGetShareData } from './api/share'
export default {
	name: 'PieEcharts',
	props: {
		dialogVisible: Boolean
	},
	data () {
		return {
			echarts: null,
			echartsOption: {
				tooltip: {
			        trigger: 'item',
			        formatter: "{b}: {c} <br/>占比: {d}%",
			        textStyle: {
			        	color: "#dc8c00"
			        	// fontWeight: "bold"
			        }
			    },
			 	grid: {
			 		right: "10%"
			 	},
			    legend: {
			        orient: 'vertical',
			        right: '2%',
			        y: 'center',
			        itemGap: 0,
			        padding: [0, 30, 0, 0],
			        textStyle: {
			        	color: '#ccc',
			        	lineHeight: 20,
			        	fontFamily: 'MicrosoftYaHei'
			        }
			    },
			    color: ["#139cbe", "#41b27e", "#9ccc68", "#f7ca49", "#9496a1", "#4666f1"],
			    series: [
			        {
			            // name:'adfasdfasf',
			            type:'pie',
			            radius: ['40%', '70%'],
			            center: ['37%', '51%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: true,
			                    position: 'inside',
			                	formatter:function(data){
			                		return data.percent > 10 ? data.percent.toFixed(1)+'%' : '';
			                	},
			                	color: '#fff',
			                },
			                // normal: {
			                //     show: false,
			                //     position: 'center'
			                // },
			                emphasis: {
			                    show: true,
			                    textStyle: {
			                        fontSize: '12'
			                    }
			                },
			            },
			            labelLine: {
			                normal: {
			                    show: true
			                }
			            },
			            data:[
			                {value:1548, name:'直接访问'},
			                {value:1032, name:'邮件营销'},
			                {value:534, name:'联盟广告'},
			                {value:235, name:'视频广告'},
			                {value:154, name:'搜索引擎'},
			                {value:99, name:'搜索引擎2'}
			            ]
			        }
			    ]
			}
		}
	},
	watch: {
      	deep: true,
		dialogVisible: {
			handler(newVal, oldVal) {
				if(newVal) {
					setTimeout(() => {
						if(!this.echarts) {
							console.log("初始化echarts-pie实例");
							this.echarts = this.$echarts.init(document.getElementById("echarts-pie"));
							this.echarts.setOption(this.echartsOption);
						}
						// console.log("重新设置echarts-pie参数");
						// this.echarts.setOption(this.echartsOption);
					}, 100);
				}
			}
		}
	},
	created() {
	},
	mounted() {
	},
	methods: {
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/echarts.scss";
</style>
