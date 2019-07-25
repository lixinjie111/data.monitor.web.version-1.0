
<template>
	<ul class="echarts-list-wrap clearfix">
		<li class="echarts-list" v-for="(item, index) in lineFilterData">
			<p class="echarts-list-title">{{item.scatName}}</p>
			<div class="echarts-list-box" :id="item.id"></div>
		</li>
	</ul>
</template>

<script>
export default {
	name: 'LineEcharts',
	props: {
        lineEchartsData: Array,
        activeName: String,
        resizeLineFlag: Boolean,
        type: Number
    },
	data () {
		return {
            loaded: false,
            lineFilterData: []
		}
	},
	watch: {
      	deep: true,
        activeName(newVal, oldVal) {
            if(newVal == 'tabTwo') {
                // let _option = this.defaultOption();
                // if(!this.myLineChart) {
                //     this.myLineChart = this.$echarts.init(document.getElementById('myLineChart'));
                // }
                // this.myLineChart.setOption(_option);
                this.drawLine();
            }
        },
        resizeLineFlag: {
			handler(newVal, oldVal) {
				if(newVal) {
					// console.log('改变窗口');
					// this.changeRander();
					this.$emit("alreadyRender",'resizeLineFlag');
				}
			}
		}
    },
    computed: {
        filterData() {
            return this.lineEchartsData;
        }
    },
	methods: {
        drawLine() {
            this.lineFilterData = this.filterData.map((item, index) => {

                item.id = "echarts-line-" + index;
                item.echarts = null;
                item.data.forEach(items => {
                    items.value = items.count;
                });
                return item;
            });
            console.log(' this.lineFilterData', this.lineFilterData);
            setTimeout(_ => {
                this.lineFilterData.map(item => {
                    if(item.data.length > 0) {
                        if(!item.echarts) {
                            item.echarts = this.$echarts.init(document.getElementById(item.id));
                        }
                        let _option = this.defaultOption(item.data);
                        item.echarts.setOption(_option);
                    }
                });
            }, 1000);
            
        },
        // dealData(data) {
        //     console.log('data', data);
        //     data.map(x => {

        //     })
        //     console.log('this.lineFilterData --- duogeshuzu', this.lineFilterData);
        // },
		// changeRander() {
		// 	this.lineEchartsData.forEach(item => {
        //     	if(item.echarts) {
		// 			item.echarts.resize();
        //     	}else {
        //     		if(item.data.length > 0) {
		// 				item.echarts = this.$echarts.init(document.getElementById(item.id));
		// 				let _option = this.defaultOption(item.data);
		// 				item.echarts.setOption(_option);
		// 			}
		// 		}
		// 	});
		// },
		defaultOption(data) {
            let option = {
                xAxis: {
                    type: 'category',
                    show: false
                },
                yAxis:  {
                    type: 'value',
                    show: false
                },
                series: {
                    type: 'line',
                    smooth: true,
                    color: '#37ba7b',
                    // symbol: 'circle',
                    lineStyle: {
                        color: '#37ba7b',
                        width: 1
                    },
                    markLine: {
                        symbol: 'circle'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    areaStyle: {
                        color: 'rgba(55, 186, 123, .1)'
                    },
                    data: data
                }
            };
            return option;
        }
	}
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/echarts.scss";
</style>
