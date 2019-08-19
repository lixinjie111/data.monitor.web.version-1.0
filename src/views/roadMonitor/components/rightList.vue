<template>
  <div class="c-info-style">
      <div class="c-size-style" v-for="item in resultData" :key="item.crossId">
        <div class="c-mask-style" >
          <p @click="queryCrossDetail(item)">路口：{{item.crossId}}</p>
        </div>
        <map-detail :id="'map'+item.crossId" class="c-map-style" :reqData="item"></map-detail>
      </div>
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
              resultData:''
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


