<template>
  <div class="c-dialog-wrapper">
    <div class="c-dialog-container">
      <div class="c-dialog-header">
        <span class="c-dialog-title">智慧公交</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class="c-dialog-content m-side-dialog-content">
            <template v-if="hasData">
              <ul  class="lightBox" v-for="(item,index) in busListData" :key="index" >
                <li :class="item.position">
                  <div class="light"  
                    v-for="subItem in item.list"
                    :key="subItem.id"
                    :class="initClass(subItem)"
                    v-show="subItem.flag" 
                    :id="subItem.id" >
                    <img :src="'static/images/smartlight/'+subItem.twords+'.png'" alt="">
                  </div>
                </li>
              </ul>
            </template>
            <template v-else>
              暂无数据
            </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lightData:[],
      busList:[],
      hasData:false,
    };
  },
  props: ['wescoketData', 'busListData','selectedItem'],
  created() {
    this.busList=this.busListData;
    console.log(this.selectedItem)
    this.initData();
  },
  methods: {
    initClass(subItem){
      if(!subItem.flag){
        return ''
      }
      if(subItem.light=='RED'){
        return 'lightRed'
      }else if(subItem.light=='YELLOW'){
        return 'lightYellow'
      }else if(subItem.light=='GREEN'){
        return 'lightGreen'
      }else{
        return ''
      }
    },
    initData(){
      if(this.selectedItem){
        if(this.selectedItem.tpPhaseList){
          this.busList.forEach(item=>{//循环初始数据没有的相位id隐藏
              item.list.forEach(item1=>{
                this.selectedItem.tpPhaseList.forEach(item2=>{
                  if(item1.id==item2.phaseId){
                    item1.flag=true;
                    this.hasData=true;
                  }
                })
              })
          })
        }else{
            this.busList.forEach(item=>{//循环初始数据没有的相位id隐藏
              item.list.forEach(item1=>{
                  item1.flag=true;
                  this.hasData=true;
              })
          })
        }
        for(var key in this.wescoketData){
          this.selectedItem.tpPhaseList.forEach(item2=>{
            let _id=this.selectedItem.id+"_"+item2.phaseId;
              if(key==_id){
                let realData=this.wescoketData[key];
                this.busList.forEach(item3=>{
                    item.list.forEach(item4=>{
                        if(item4.id==realData.phaseID){
                          item4.flag=true;
                          item4.light=realData.light;
                        }
                    })
                })
              }
            })
        }
      }
      this.$forceUpdate();
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/theme.scss";
@import "@/assets/scss/dialog.scss";
.m-side-dialog-content {
  padding: 0;
  background-color: #000;
  @include layoutMode();
  .lightBox{
    position: absolute;
    width:400px;
    height: 400px;
    li{
      position: absolute;
      height: 40px;
      background-color:#000;
       @include layoutMode();
      .light{
        width: 20px;
        height: 20px;
        border-radius:50%;
        margin:2px;
        padding:5px;
        background:gray;
        &.lightRed{
          background:#d41010
        }
        &.lightGreen{
          background:#00ff86
        }
        &.lightYellow{
          background:#fda53f
        }
        img{
          display: block;
          width:100%;
        }
      }
    }
    .east{
      right:0;
      top:50%;
      transform:translateX(50%)
    }
    .south{
      bottom:0;
      left:50%;
      transform:translateY(50%) translateX(-50%)
    }
    .west{
      left:0;
      top:50%;
      transform:translateX(-50%)
    }
    .north{
      top:0;
      left:50%;
       transform:translateY(-50%) translateX(-50%)
    }
    .northeast{
      right:0;
      top:0;
      transform:translateX(50%) translateY(-50%)
    }
    .northwest{
      left:0;
      top:0;
      transform:translateX(-50%) translateY(-50%)
    }
    .southeast{
      right:0;
      bottom:0;
      transform:translateX(50%) translateY(50%)
    }
    .southwest{
      left:0;
      bottom:0;
      transform:translateX(-50%) translateY(50%)
    }

  }
}
</style>