
<template>
	<ul class="echarts-list-wrap clearfix">
		<li class="echarts-list" v-for="(item, index) in responseData">
			<p class="echarts-list-title">{{item.scatName}}</p>
			<div class="echarts-list-box" :id="item.id"></div>
		</li>
	</ul>
</template>

<script>
import { getVehStat } from '@/api/carMonitor'
export default {
	name: 'PieEcharts',
	props: {
		dialogVisible: Boolean
	},
	data () {
		return {
			loaded: false,
			responseData: []
		}
	},
	watch: {
      	deep: true,
		dialogVisible: {
			handler(newVal, oldVal) {
				if(newVal) {
					this.loaded = true;
				}
			}
		},
		loaded: {
			handler(newVal, oldVal) {
				if(newVal) {
					this.getVehStat();
				}
			}
		}
	},
	methods: {
		getVehStat() {
            // console.log('获取车辆分析');
			getVehStat().then(res => {

				let _responseData = res.data.data,
					_defaultOption = this.defaultOption();

				this.responseData = _responseData.map((item, index) => {
					item.id = "echarts-pie-" + index;
					return item;
				});

				setTimeout(() => {
					this.responseData.forEach(item => {
						if(item.data.length > 0) {
							item.data.forEach(items => {
								items.value = items.count;
							});
							let _echarts = this.$echarts.init(document.getElementById(item.id)),
								_option = this.defaultOption(item.data);
							_echarts.setOption(_option);
						}
					});
				}, 0);
			});
		},
		defaultOption(data) {
			let option = {
					tooltip: {
				        trigger: 'item',
				        formatter: "{b}: {c} <br/>占比: {d}%",
				        textStyle: {
				        	color: "#dc8c00"
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
				            data: data
				            // data:[
				            //     {value:1548, name:'直接访问'},
				            //     {value:1032, name:'邮件营销'},
				            //     {value:534, name:'联盟广告'},
				            //     {value:235, name:'视频广告'},
				            //     {value:154, name:'搜索引擎'},
				            //     {value:99, name:'搜索引擎2'}
				            // ]
				        }
				    ]
				};
			return option;
		}
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/echarts.scss";
</style>
