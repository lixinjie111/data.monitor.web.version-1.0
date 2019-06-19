<template>

    <component v-bind:level="1" v-bind:is="currentView">
      <!-- 组件在 vm.currentview 变化时改变！ -->
      Hello world!
    </component>

</template>
<script>
  const MyComponent = {
    render: function (createElement) {
      return createElement(
        'h'+this.level,
        this.$slots.default
      )
    },
    props:{
      level:{
        type:Number
      }
    }
  };
  // 注册
  //Vue.component('my-component', MyComponent);
  export default {
    name: 'bar',
    data () {
      return {

        currentView: MyComponent
      }
    },
    methods:{

    }
  };
</script>
