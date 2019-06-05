<template>
  <div class="side-device-info">
    <div class="side-device-style">
      <div class="side-device-size" @click="dialogVisible=true">
        <video-player class="vjs-custom-skin" :options="option1" :width="330" :height="210"></video-player>
      </div>
      <div class="side-device-size">
        <!--<tusvn-map :target-id="'mapMonitor'" ref="tusvnMap" >

        </tusvn-map>-->
      </div>
    </div>
    <div class="c-dialog-wrapper" v-show="dialogVisible">
      <div class="c-dialog-container" >
        <div class="c-dialog-header">
          <span class="c-dialog-title">路侧点数据</span>
          <i class="c-dialog-close" @click="dialogVisible = false"></i>
        </div>
        <div class="c-dialog-content">
          <div class="side-device-left">
            <ul class="device-left-ul clearfix">
              <li>
                <el-select v-model="provinceValue" placeholder="请选择" :size="mini">
                  <el-option
                    v-for="item in provinceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </li>
              <li>
                <el-select v-model="cityValue" placeholder="请选择" :size="mini">
                  <el-option
                    v-for="item in cityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </li>
            </ul>
            <div>
              <div class="side-device-detail">
                <span>路侧点总数:</span>
                <span class="device-detail-style">203</span>
              </div>
              <div class="side-device-detail">
                <span>路侧设备数:</span>
                <span class="device-detail-style">1204</span>
              </div>
            </div>
            <div class="device-distribute">
              <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
          <div class="side-device-right">
            <tusvn-map :target-id="'deviceMap'" ref="tusvnMap" >

            </tusvn-map>
            <div class="side-device-list">
              <p class="side-device-title">设备列表</p>
              <div class="device-list-style">
                <div class="table-header-group">
                  <ul class="table-row">
                    <li class="table-cell device-num">设备编号</li>
                    <li class="table-cell device-style">联网状态</li>
                    <li class="table-cell device-style">开启监控</li>
                  </ul>
                </div>
                <div class="table-row-group">
                  <ul class="table-row">
                    <li class="table-cell device-num">
                      <img src="@/assets/images/monitorManage/monitor-3.png" class="monitor-device-img-1"/>
                      <span class="monitor-device-text">N-191-302</span>
                    </li>
                    <li class="table-cell">
                      <span class="monitor-device-symbol"></span>
                    </li>
                    <li class="table-cell">
                      <el-switch
                        v-model="value"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </li>
                  </ul>
                  <ul class="table-row">
                    <li class="table-cell device-num">
                      <img src="@/assets/images/monitorManage/monitor-4.png" class="monitor-device-img-2"/>
                      <span class="monitor-device-text">N-191-302</span>
                    </li>
                    <li class="table-cell">
                      <span class="monitor-device-symbol"></span>
                    </li>
                    <li class="table-cell">
                      <el-switch
                        v-model="value"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                      </el-switch>
                    </li>
                  </ul>
                </div>
              </div>
              <p class="side-device-title">监控视频</p>
              <div class="device-video-style">
                <video-player class="vjs-custom-skin" :options="option3" ></video-player>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--下拉框-->
    <div>

    </div>
  </div>
</template>
<script>
  import VideoPlayer from "../../../../node_modules/vue-video-player/src/player.vue";

  const isProduction = process.env.NODE_ENV === 'production'
  import TusvnMap from '@/components/Tusvn3DMap2'
    export default {
        data() {
            return {
              option1:{},
              option2:{},
              option3:{},
              provinceOptions: [{
                value: '1',
                label: '上海'
              }],
              provinceValue: '',
              cityOptions:[{
                value: '1',
                label: '黄浦区'
              },{
                value: '2',
                label: '徐汇区'
              },{
                value: '3',
                label: '长宁区'
              },{
                value: '4',
                label: '静安区'
              }],
              cityValue:'',
              dialogVisible:false,
              data: [{
                id: 1,
                label: '一级 1',
                children: [{
                  id: 4,
                  label: '二级 1-1',
                  children: [{
                    id: 9,
                    label: '三级 1-1-1'
                  }, {
                    id: 10,
                    label: '三级 1-1-2'
                  }]
                }]
              }, {
                id: 2,
                label: '一级 2',
                children: [{
                  id: 5,
                  label: '二级 2-1'
                }, {
                  id: 6,
                  label: '二级 2-2'
                }]
              }],
              defaultProps: {
                children: 'children',
                label: 'label'
              },

            }
        },
        components:{
          VideoPlayer,
          TusvnMap
        },
        methods: {
          getPlayerOptions(){
            var option={
              overNative: true,
              autoplay: true,
              controls: true,
              fluid: true,
              techOrder: ['flash', 'html5'],
              sourceOrder: true,
              flash: {
                swf: isProduction ? '/dataMonitor/static/media/video-js.swf' : '/static/media/video-js.swf'
              },
              sources: [
                {
                  type: 'rtmp/mp4',
                  src: ''
                }
              ],
              muted:true,
              width:'100%',
              height:'100%'
            }
            return option;
          }
        },
        mounted() {

         /* var options = this.getPlayerOptions();
          options.sources[0].src = 'rtmp://113.208.118.61:11935/hls/34020000001320000002_3402000000132000000201_0200000002';
          this.option3 =options;*/
          /*var sources2 = [{
            type: 'rtmp/mp4',
            src: 'rtmp://113.208.118.61:11935/hls/34020000001320000002_3402000000132000000201_0200000002'
          }]
          var options2 = this.getPlayerOptions();
          this.option2 = Object.assign(options2,sources2);*/
        }
    }
</script>
<style>
   .vjs-custom-skin > .video-js .vjs-big-play-button{
    display: none;
  }
  .side-device-size .video-js{
    height: 210px;
  }
  .device-video-style .video-js{
    height: 240px;
  }
  .device-left-ul .el-input__inner{
    backgound-color:#5e5970;
    border:1px solid #5e5970;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    border-radius: 0px;
  }
  .device-distribute .el-tree{
    background: #262626;
    color: #cccccc;
  }
  .device-distribute .el-tree-node__expand-icon{
    color: #5e5970;
  }
  .device-distribute .el-tree-node__content:hover{
    background-color: #262626;
  }
  .device-distribute .el-tree-node:focus>.el-tree-node__content{
    background-color: #262626;
  }
</style>
<style lang="scss" scoped>

  .side-device-info{
    position: absolute;
    right:20px;
    .side-device-style{
      margin-bottom: 30px;
    }
    .side-device-size{
      width: 330px;
      height: 210px;
    }
  }
  .side-device-left{
    width: 264px;
    height: 100%;

    .device-left-ul{
      margin-bottom: 30px;
      li{
        float: left;
        width: 90px;
        margin-right:10px;
        height:30px;
      }
    }
    .side-device-detail{
      display: inline-block;
    }
    .device-detail-style{
      color: #dc8c00;
    }
    .device-distribute{
      margin-top: 40px;
    }
  }
  .side-device-right{
    position: absolute;
    top: 0;
    left: 296px;
    bottom: 0;
    right: 0;
  }
  .side-device-list{
    position: absolute;
    top: 36px;
    right: 0;
    width: 400px;
    .side-device-title{
      position: relative;
      font-size: 16px;
      color: #ffffff;
      padding-left: 10px;
      &:before{
        content: '';
        width: 2px;
        height: 16px;
        position: absolute;
        top:50%;
        left:0;
        margin-top: -8px;
        background:#37ba7b ;
      }
    }
    .device-list-style{
      display:table;
      border:1px solid #5e5970;
      border-collapse:collapse;
      width: 370px;
      text-align: center;
      .table-header-group{
        display:table-header-group;
        font-weight:bold;

      }
      .table-row{
        display:table-row;
        border-bottom:1px solid #5e5970;
        .table-cell{
          display:table-cell;
          padding:0 5px;
        }
        .device-num{
          width:40%;
          text-align: left;
        }
        .device-style{
          width:30%;
        }
      }
      .table-row-group{
        display:table-row-group;
      }
      .monitor-device-symbol{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #19cd2e;
        display: inline-block;
      }
      .monitor-device-img-1{
        width:20px;
      }
      .monitor-device-img-2{
        width:16px;
        padding: 0px 2px;
      }
      .monitor-device-text{
        font-size: 14px;
        color: #ccc;
      }
    }
    .device-video-style{
      width: 370px;
      height: 240px;
      border:1px solid #5e5970;
    }
  }
</style>
