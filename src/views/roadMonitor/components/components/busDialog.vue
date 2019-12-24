<template>
  <div class="c-dialog-wrapper">
    <div class="c-dialog-container">
      <div class="c-dialog-header">
        <span class="c-dialog-title">智慧公交</span>
        <i class="c-dialog-close" @click="closeDialog"></i>
      </div>
      <div class="c-dialog-content m-side-dialog-content">
            <ul  class="lightBox" v-for="(item,index) in busListData" :key="index">
              <li :class="item.position">
                <div class="light"  
                  v-for="subItem in item.list"
                  :key="subItem.id"
                  :class="initClass(subItem)" 
                  :id="subItem.id" >
                  <img :src="'static/images/smartlight/'+subItem.twords+'.png'" alt="">
                </div>
                  <!-- v-show="subItem.flag" -->
              </li>
            </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lightData:[]
    };
  },
  props: ['wescoketData', 'busListData'],
  components: {
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
    initData(selectedItem){
      this.lightData=[];
      if(selectedItem){
        for(var key in this.wescoketData){
          if(this.wescoketData[key].lightId==selectedItem.lightId){
            this.lightData.push(this.wescoketData[key]);//某一个信号灯
          }
        }
        if(this.lightData.length<1){
          return '';
        }
        let _arr=[];
        if(selectedItem.tpPhaseList){
          selectedItem.tpPhaseList.forEach(item3=>{
            if(this.lightData){
                this.lightData.forEach(item4=>{
                  if(item3.phaseId==item4.phaseID){
                      _arr.push({'phaseID':item4.phaseID,"light":item4.light})
                    }
                })
            }
          })
        }
        this.busListData.forEach(item=>{
          item.list.forEach(item1=>{
            if(_arr){
                var count=0;
                _arr.forEach(item2=>{
                if(item1.id==item2.phaseID){
                  count++;
                  item1.flag=true;
                  item1.light=item2.light;
                  if(count==1){
                    item1['lightId']=selectedItem.lightId;
                    return item1;
                  }
                }
              })
            }
            
          })
        })
      }
        //this.$forceUpdate();
        
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
   
  },
  destroyed() {
    this.webSocket && this.webSocket.close();
  }
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
          background:red
        }
        &.lightGreen{
          background:green
        }
        &.lightYellow{
          background:yellow
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