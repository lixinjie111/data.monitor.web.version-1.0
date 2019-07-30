<template>
	<div class="echarts-list-box" :id="id"></div>
</template>

<script>
export default {
	props: {
		pieEchartsData: Array,
		activeName: String,
		id: String,
		count: Number
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
                this.initEcharts();
            }
        },
		count(newVal, oldVal) {
            if(newVal-oldVal > 3) {
            	this.changeRander();
			}else {
            	this.initEcharts();
			}
		}
	},
    mounted() {
    	console.log("------------------------");
        this.initEcharts();
    },
	methods: {
		// 根据窗口大小重新渲染
		changeRander() {
            if (this.myChart) {
                this.myChart.resize();
            } else {
                this.initEcharts();
            }
		},
		initEcharts() {
    		console.log("?????????????????????????????????");
			let _option = this.defaultOption();
			if(!this.myChart) {
				this.myChart = this.$echarts.init(document.getElementById(this.id));
			}
			this.myChart.setOption(_option);
		},
		// 饼图右侧展示前5个数据
		legendData() {
			let arr = [];
			this.pieEchartsData.map((x, index) => {
				if (index < 5) {
					arr.push(x.name);
				}
			});
			return arr;
		},
        dealData() {
            let arr = [];
            this.pieEchartsData.map(x => {
                arr.push({
					name: x.name,
					value: x.count
				});
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
				},
				data: this.legendData()
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
                  data: this.dealData()
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