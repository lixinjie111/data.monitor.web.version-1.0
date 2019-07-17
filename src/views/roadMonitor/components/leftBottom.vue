<template>
  <div class="road-items">
    <div class="road-item">
      <h3 class="c-title road-title">道路级别</h3>
      <div id="roadLevel" class="road-pie-style">

      </div>
    </div>
    <div class="road-item">
      <h3 class="c-title road-title">道路分类</h3>
      <div id="roadClassify" class="road-pie-style">

      </div>
    </div>
  </div>
</template>
<script>
  import {roadLevel,roadCategory} from '@/api/roadMonitor'
    export default {
        data() {
            return {
              levelPie:{},
              classifyPie:{}
            }
        },
        methods: {
          defaultOption(data) {
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
                right: '15%',
                y: 'center',
                itemGap: 0,
                textStyle: {
                  color: '#ccc',
                  lineHeight: 30,
                  fontFamily: 'MicrosoftYaHei',
                  padding:[0,8]
                }
              },
              color: ["#4666f1", "#35a376", "#91bb66", "#e5bf4d", "#9496a1" ],
              series: [
                {
                  type:'pie',
                  radius: ['45%', '65%'],
                  center: ['30%', '48%'],
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
                  /*data: data*/
                   data:[
                       {value:1548, name:'高速'},
                       {value:1032, name:'国道'},
                       {value:534, name:'省道'},
                       {value:235, name:'城市道路'},
                       {value:154, name:'乡道'}
                   ]
                }
              ]
            };
            return option;
          },
          getRoadLevel(){
            roadLevel().then(res=>{
              let result = res.data;
              let data = [];
              result.forEach(item=>{
                let obj = {};
                obj.value = item.data;
                obj.name = item.scatName;
                data.push(obj);
              })
              let option = this.defaultOption(data);
              this.levelPie.setOption(option);
            });
          },
          getRoadCategory(){
            roadCategory().then(res=>{
              let result = res.data;
              let data = [];
              result.forEach(item=>{
                let obj = {};
                obj.value = item.value;
                obj.name = item.name;
                data.push(obj);
              })
              let option = this.defaultOption(data);
              this.classifyPie.setOption(option);
            });
          }
        },
        mounted() {
         this.levelPie =  this.$echarts.init(document.getElementById("roadLevel"));
         this.classifyPie =  this.$echarts.init(document.getElementById("roadClassify"));
         /*let option = this.defaultOption();
          this.levelPie.setOption(option);
          this.classifyPie.setOption(option);*/
         this.getRoadLevel();
         this.getRoadCategory();
        }
    }
</script>
<style lang="scss" scoped>
  .road-title{
    margin-top: 0px!important;
    padding:0px !important;
  }
  .road-item{
    /*border:1px solid #5e5970;
    margin-top: 20px;
    padding: 20px 20px 50%;*/
    padding-bottom:50%;
    position: relative;
    .road-pie-style{
      position: absolute;
      left: 0;
      top: 60px;
      right: 0;
      bottom:0;
    }
  }
</style>
