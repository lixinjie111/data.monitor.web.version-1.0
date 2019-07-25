
<template>
	<!-- <ul class="echarts-list-wrap clearfix">
		<li class="echarts-list">
			<div class="echarts-list-box" id="myChart"></div>
		</li>
	</ul> -->
	<div class="echarts-list-box" id="myChart"></div>
</template>

<script>
export default {
	props: {
		pieEchartsData: Array,
		activeName: String,
		resizePiesFlag: Boolean
	},
	data () {
		return {
			myChart: null,
			loaded: false
		}
	},
	watch: {
		deep: true,
		activeName(newVal, oldVal) {
			if(newVal == 'tabTwo') {
				let _option = this.defaultOption();
				if(!this.myChart) {
					this.myChart = this.$echarts.init(document.getElementById('myChart'));
				}
				this.myChart.setOption(_option);
			}
		},
		resizePiesFlag: {
			handler(newVal, oldVal) {
				if(newVal) {
					// console.log('改变窗口');
					this.changeRander();
					this.$emit("alreadyRender",'resizePiesFlag');
				}
			}
		}
	}, 
	computed: {
		filterData() {
			let _filterData = [];
			this.pieEchartsData.map(x => {
				let obj = {};
				obj.value = x.count;
				obj.name = x.name;
				_filterData.push(obj);
			});
			// console.log('_filterData', _filterData);
			return _filterData;
		}
	},
	methods: {
		// 根据窗口大小重新渲染
		changeRander() {
			let _option = this.defaultOption();
			// if (!this.myChart) {
			// 	this.myChart = this.$echarts.init(document.getElementById('myChart'));
			// }
			this.myChart = this.$echarts.init(document.getElementById('myChart'));
			this.myChart.setOption(_option);
		},
		// 饼图右侧展示前5个数据
		dealData() {
			let arr = [];
			this.filterData.map((x, index) => {
				if (index < 5) {
					arr.push(x.name);
				}
			});
			return arr;
		},
		defaultOption() {
			let option = {
              tooltip: {
                trigger: 'item',
                formatter: function(params) {
                  return '<div>'+params.name+': <span style="color: #dc8c00;">'+params.value+'</span></div><div>占比: <span style="color: #dc8c00;">'+params.percent+'%</span></div>'
                }
              },
              legend: {
                itemWidth:5,
                itemHeight:15,
                orient: 'vertical',
                right: '5%',
                y: 'center',
                // itemGap: 0,
                textStyle: {
                  color: '#ccc',
                  lineHeight: 10,
                  fontFamily: 'MicrosoftYaHei',
                  padding:[0,8]
				},
				data: this.dealData()
              },
              color: ["#4666f1", "#35a376", "#91bb66", "#e5bf4d", "#9496a1" ],
              series: [
                {
                  	type:'pie',
					radius: ['45%', '70%'],
					center: ['30%', '48%'],
                  	avoidLabelOverlap: false,
                  	label: {
						normal: {
							show: true,
							position: 'inside',
							formatter:function(data){
								return data.percent > 5 ? data.percent.toFixed(1)+'%' : '';
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
                  data: this.filterData
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