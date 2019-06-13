<template>
  <div class="c-dialog-wrapper" v-show="dialogVisible">
    <div class="c-dialog-container" >
      <div class="c-dialog-header">
        <span class="c-dialog-title">{{title}}</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class="c-dialog-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  import {getDeviceList,getVideoByNum,getSideTree,getDevListByRoadId,getDeviceCountByCity} from '@/api/sideDeviceMonitor'
  const isProduction = process.env.NODE_ENV === 'production'
    export default {
      name: "SideDialog",
        data() {
            return {

            }
        },

        props:{
          dialogVisible: {
            type: Boolean,
            default:false
          },
          eventList:{
            type:Array,
            default() {
              return [];
            }
          },
          title:{
            type:String,
            default:""
          }
        },
        methods: {

          closeDialog(){
            this.$emit("closeDialog");
          }
        },
        watch:{
          dialogVisible(){
            if(this.dialogVisible){

            }
          }
        },
        mounted() {

        }
    }
</script>


<style lang="scss" scoped>

  .single-dialog-wrapper{
    position: absolute;
    width: 100%;
    height:100%;
    background-color: #262626;
  }

</style>
