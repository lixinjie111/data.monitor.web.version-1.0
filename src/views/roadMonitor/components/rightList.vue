<template>
  <div class="c-info-style">
      <template v-if="resultData.length">
        <div class="c-size-style" v-for="item in resultData" :key="item.crossId">
          <div class="c-size-inner">
            <div class="c-mask-title" >
              <a class="title" href="javascript:;" @click="queryCrossDetail(item)">路口：{{item.crossId || item.crossName}}</a>
            </div>
            <map-detail :id="'map'+item.crossId" class="c-map-video-style" :reqData="item"></map-detail>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="c-size-style" v-for="item in new Array(4)">
          <div class="c-size-inner">
            <div class="c-mask-tip">
              暂无数据
            </div>
          </div>
        </div>
      </template>
  </div>
</template>
<script>
  import {typeCross} from '@/api/roadMonitor'
  import ConvertCoord from '@/assets/js/utils/coordConvert.js'
  import mapDetail from './components/mapDetail.vue'
    export default {
      components:{
        mapDetail
      },
        data() {
            return {
              resultData: []
            }
        },
        methods: {
          queryCrossDetail(item) {
            var _this = this;
            this.$emit("queryCrossDetail",item);
          },
          getTypeCross(){
            typeCross().then(res=>{
              this.resultData=res.data;
            });
          },
        },
        mounted() {
          this.getTypeCross();
        },
    }
</script>

