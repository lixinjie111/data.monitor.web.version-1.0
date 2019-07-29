
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
		dialogVisible: Boolean,
		resizeFlag: Boolean
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
					if(this.loaded) {
						this.changeRander();
					}else {
						this.loaded = true;
					}
				}
			}
		},
		loaded: {
			handler(newVal, oldVal) {
				if(newVal) {
					this.getVehStat();
				}
			}
		},
		resizeFlag: {
			handler(newVal, oldVal) {
				if(newVal) {
					// console.log('改变窗口');
					this.changeRander();
					this.$emit("alreadyRender",'resizeFlagPie');
				}
			}
		}
	},
	methods: {
		getVehStat() {
            // console.log('获取车辆分析');
			getVehStat().then(res => {

				let _responseData = res.data.data;
					// _defaultOption = this.defaultOption();

				this.responseData = _responseData.map((item, index) => {
					item.id = "echarts-pie-" + index;
					item.echarts = null;
					item.data.forEach(items => {
						items.value = items.count;
					});
					return item;
				});
				console.log('_responseData', _responseData);
				setTimeout(() => {
					this.responseData.forEach(item => {
						if(item.data.length > 0) {
							if(!item.echarts) {
								item.echarts = this.$echarts.init(document.getElementById(item.id));
							}
							let _option = this.defaultOption(item.data);
							item.echarts.setOption(_option);
						}
					});
				}, 0);
			});
		},
		changeRander() {
			this.responseData.forEach(item => {
            	if(item.echarts) {
					item.echarts.resize();
            	}else {
            		if(item.data.length > 0) {
						item.echarts = this.$echarts.init(document.getElementById(item.id));
						let _option = this.defaultOption(item.data);
						item.echarts.setOption(_option);
					}
				}
			});
		},
		defaultOption(data) {
			let option = {
					tooltip: {
				        trigger: 'item',
				        formatter: function(params) {
				        	return '<div>'+params.name+': <span style="color: #dc8c00;">'+params.value+'</span></div><div>占比: <span style="color: #dc8c00;">'+params.percent+'%</span></div>'
				        }
				        // formatter: "{b}: {c} <br/>占比: {d}%",
				        // textStyle: {
				        // 	color: "#dc8c00"
				        // }
				    },
				 	grid: {
				 		right: "10%"
				 	},
				    legend: {
		                itemWidth: 5,
		                itemHeight: 15,
				        orient: 'vertical',
				        right: '2%',
				        y: 'center',
				        itemGap: 0,
				        padding: [0, 30, 0, 0],
				        textStyle: {
				        	color: '#ccc',
				        	lineHeight: 20,
				        	fontFamily: 'MicrosoftYaHei',
                  			padding:[0,8]
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
