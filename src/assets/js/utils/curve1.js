class Curve1{

  /*static stop1;
  static stop2;*/
  /*static progress = false;*/

  constructor(start,end,width,height,random,type,i,order){
    this.start = start;
    this.end = end;
    this.width = width;
    this.height = height;
    this.random = random;
    this.type = type;
    this.i = i;
    this.order = order;
    this.stop1=null;
    this.stop2=null;
    /*this.linePercent = 0;
    this.imgPercent = 0;*/
  }
  /**
   * 动画画曲线
   *
   * @param {obj} ctx canvas对象
   * @param {String} random 曲度
   * @param {String} color 曲线的颜色
   * @param {Number} percent 整数
   * @param {Number} i  第几个定时任务
   * @param {Array.<Number>} start  开始坐标
   * @param {Array.<Number>} end  结束坐标
   */
  animate(ctx,random,color,percent,i,start,end) {
    // console.log("开始时间-----"+new Date().getTime())
    //console.log("order------"+this.order);
    var _this = this;
    /* ctx.clearRect( 0, 0, 800, 800 );*/
    ctx.lineWidth = 0.1;
    /*ctx.shadowColor="#d28605";                //设置或返回用于阴影的颜色
    ctx.shadowBlur=10;*/
    ctx.strokeStyle = "#696766";
    /* var random = 0.2;*/
    /*ctx.lineWidth = 0.1;
    ctx.shadowColor=color;                //设置或返回用于阴影的颜色
    ctx.shadowBlur=10;
    ctx.strokeStyle = color;*/
    this.drawPath(
      ctx,
      start,
      end,
      random,
      percent
    );
    ctx.stroke();
    percent = ( percent + 1 ) % 100;
    if(percent==99){
      // console.log("结束时间-----"+new Date().getTime())
      /*console.log("该对象已完成");*/
      /*console.log("sessionStorage key-----"+_this.order+i)*/
      // sessionStorage.setItem(_this.order+i,i);
      /*Curve1.k = this.i;*/
      if(i==9){
        /*console.log("i====="+i+",order"+this.order)*/
        _this.clearLines();
      }
      cancelAnimationFrame(this.stop1);
      return;
    }
    this.stop1= requestAnimationFrame(function() {
      _this.animate(ctx,random,color,percent,i,start,end);
    });
  }


  /**
   * 产生图片
   *
   * @param {obj} imgCtx canvas对象
   * @param {String} random 曲度
   * @param {String} color 曲线的颜色
   * @param {Number} imgPercent 整数
   * @param {Number} i  第几个定时任务
   * @param {Array.<Number>} start  开始坐标
   * @param {Array.<Number>} end  结束坐标
   */
  generatorImg(imgCtx,random,img,imgPercent,start,end,type) {
    var _this = this;
    imgCtx.clearRect(0, 0, 800, 800);
    imgCtx.beginPath();
    /* var random = 0.2;*/
    this.drawImage(
      imgCtx,
      start,
      end,
      random,
      imgPercent,
      img,
      type
    );
    imgCtx.stroke();
    imgPercent = ( imgPercent + 1 ) % 100;
    if(imgPercent==99){
      imgCtx.clearRect( 10, 10, 1000, 1000 );
      window.cancelAnimationFrame(this.stop2);
      return ;
    }
    this.stop2 = requestAnimationFrame(function() {
      _this.generatorImg(imgCtx,random,img,imgPercent,start,end,type)
    });
  }

  generateLines(ctx,random,color,percent,i,start,end){
    var _this = this;
    var time = setInterval(()=> {
      var percent = ( ++_this.linePercent ) % 100;
      if(percent==99){
        clearInterval(time);
        return;
      }
      _this.animate(ctx,random,color,percent,i,start,end);
    },20);
  }
  generateImgs(imgCtx,random,img,imgPercent,start,end,type){
    var _this = this;
    var time = setInterval(()=> {
      var percent = ( ++_this.imgPercent ) % 100;
      if(percent==99){
        clearInterval(time);
        return;
      }
      _this.generatorImg(imgCtx,random,img,percent,start,end,type);
    },20);
  }
  static generateColor () {

    var colors = [];
    // 生成随机颜色
    for ( var i = 0; i < 10; i++ )  {
      colors.push(
        'rgb( ' +
        ( Math.random() * 255 >> 0 ) + ',' +
        ( Math.random() * 255 >> 0 ) + ',' +
        ( Math.random() * 255 >> 0 ) +
        ' )'
      );
    }
    return colors;
  }



  /**
   * 绘制动画方法
   *
   * @param {String} id 容器id
   * @param {Array.<Number>} start  开始坐标
   * @param {Array.<Number>} end  结束坐标
   */
  generateForward(){
    if(this.i>=10){
      return;
    }
   /* if(this.random<1){*/
      var color = 'rgb( ' +
        ( Math.random() * 255 >> 0 ) + ',' +
        ( Math.random() * 255 >> 0 ) + ',' +
        ( Math.random() * 255 >> 0 ) +
        ' )';
    /* var container = document.getElementById("canvasContainer");
     var random = 0.1;
     var i=0;*/
    /*var colors = generateColor();*/
    /*for(i;i<5;i++){
      random = random+0.1;
      //创建曲线canvas标签
      var lineObj = document.createElement('canvas');
      lineObj.id='canvas'+i;
      lineObj.className = 'canvas';
      lineObj.width='800';
      lineObj.height='800';
      container.appendChild(lineObj);
      //获取曲线的canvas对象
      var lineCanvas = document.getElementById( lineObj.id );
      var lineCtx = lineCanvas.getContext( '2d' );


      //创建图像canvas标签
      var canvasObj = document.createElement('canvas');
      canvasObj.id='imgCanvas'+i;
      canvasObj.className = 'canvas';
      canvasObj.width='800';
      canvasObj.height='800';
      container.appendChild(canvasObj);
      //获取图像canvas对象
      var imgCanvas = document.getElementById( canvasObj.id );
      var imgCtx = imgCanvas.getContext( '2d' );

      //创建图像
      var imgObj = document.createElement('img');
      imgObj.id='plan'+i;
      imgObj.src = './static/images/plane.jpg';
      imgObj.style.display='none';
    container.appendChild(imgObj);

    //获取图像
    var img = document.getElementById(imgObj.id);


    if(random<1){

      animate(lineCtx,random,colors[i],0);
      generatorImg(imgCtx,random,img,0);


      /!* reverseAnimate(random,'#b33db5');
       generatorReverseImg(random,img,imgPercent);*!/
    }
  }
 */
    /*var timer = setInterval(function () {*/
    /*random = random+0.1;*/
    //创建曲线canvas标签
   /* var lineObj = document.createElement('canvas');
    lineObj.id='canvas'+this.i;
    lineObj.className = 'canvas';
    this.container.appendChild(lineObj);*/
    //获取曲线的canvas对象
    //console.log("this.order---"+this.order);
    var lineCanvas = document.getElementById(this.order+this.i);
    //console.log("lineCanvas---"+lineCanvas);
    /*var lineCanvas = document.getElementById("up0");*/
    var lineCtx = lineCanvas.getContext( '2d' );
    //设置或返回阴影距形状的垂直距离
     lineCtx.globalCompositeOperation = 'destination-out';
    /* lineCanvas.width='400';
     lineCanvas.height='200';*/
    lineCanvas.width=this.width*2;
    lineCanvas.height=this.height*2;
    /*lineCtx.translate(-1, 0.5);*/
    lineCanvas.style.width=this.width+'px';
    lineCanvas.style.height=this.height+'px';
    lineCtx.scale(2,2);

    //创建图像canvas标签
   /* var canvasObj = document.createElement('canvas');
    canvasObj.id='imgCanvas'+this.i;
    canvasObj.className = 'canvas';
    this.container.appendChild(canvasObj);*/
    //获取图像canvas对象
    var imgCanvas = document.getElementById(this.order+'Img'+this.i);
    var imgCtx = imgCanvas.getContext( '2d' );

    imgCanvas.width=this.width*2;
    imgCanvas.height=this.height*2;
    /*lineCtx.translate(-1, 0.5);*/
    imgCanvas.style.width=this.width+'px';
    imgCanvas.style.height=this.height+'px';
    imgCtx.scale(2,2);

    //创建图像
   /* var imgObj = document.createElement('img');
    imgObj.id='plan'+this.i;
    imgObj.src = './static/images/circle.png';
    imgObj.style.display='none';
    this.container.appendChild(imgObj);
    console.log("order------"+this.order);*/
      //获取图像
      var img = document.getElementById(this.order+"Plan"+this.i);
      this.animate(lineCtx,this.random,color,0,this.i,this.start,this.end);
      this.generatorImg(imgCtx,this.random,img,0,this.start,this.end,this.type);
      /*this.generateLines(lineCtx,this.random,color,0,this.i,this.start,this.end);
      this.generateImgs(imgCtx,this.random,img,0,this.start,this.end,this.type);*/
      /*this.random = this.random+0.1;*/

    /*}else{
      setTimeout(clearALL, 1000);
      clearInterval(timer);
    }*/
  }

  /**
   * 绘制一条曲线路径
   * @param  {Object} ctx canvas渲染上下文
   * @param  {Array<number>} start 起点
   * @param  {Array<number>} end 终点
   * @param  {number} curveness 曲度(0-1)
   * @param  {number} percent 绘制百分比(0-100)
   */

  drawPath(ctx, start, end, curveness, percent){
    ctx.clearRect( 10, 10, 800, 800 );
    var cp = [
      ( start[ 0 ] + end[ 0 ] ) / 2 - ( start[ 1 ] - end[ 1 ] ) * curveness,
      ( start[ 1 ] + end[ 1 ] ) / 2 - ( end[ 0 ] - start[ 0 ] ) * curveness
    ];

    var t = percent / 100;

    var p0 = start;
    var p1 = cp;
    var p2 = end;

    var v01 = [ p1[ 0 ] - p0[ 0 ], p1[ 1 ] - p0[ 1 ] ];     // 向量<p0, p1>
    var v12 = [ p2[ 0 ] - p1[ 0 ], p2[ 1 ] - p1[ 1 ] ];     // 向量<p1, p2>

    var q0 = [ p0[ 0 ] + v01[ 0 ] * t, p0[ 1 ] + v01[ 1 ] * t ];
    var q1 = [ p1[ 0 ] + v12[ 0 ] * t, p1[ 1 ] + v12[ 1 ] * t ];

    var v = [ q1[ 0 ] - q0[ 0 ], q1[ 1 ] - q0[ 1 ] ];       // 向量<q0, q1>

    var b = [ q0[ 0 ] + v[ 0 ] * t, q0[ 1 ] + v[ 1 ] * t ];
    ctx.moveTo( p0[ 0 ], p0[ 1 ] );

    ctx.quadraticCurveTo(
      q0[ 0 ], q0[ 1 ],
      b[ 0 ], b[ 1 ]
    );

  }
  drawImage( ctx, start, end, curveness, percent,img,type) {

    //console.log("curveness----"+curveness);
    var cp = [
      ( start[ 0 ] + end[ 0 ] ) / 2 - ( start[ 1 ] - end[ 1 ] ) * curveness,
      ( start[ 1 ] + end[ 1 ] ) / 2 - ( end[ 0 ] - start[ 0 ] ) * curveness
    ];

    var t = percent / 100;

    var p0 = start;
    var p1 = cp;
    var p2 = end;

    var v01 = [ p1[ 0 ] - p0[ 0 ], p1[ 1 ] - p0[ 1 ] ];     // 向量<p0, p1>
    var v12 = [ p2[ 0 ] - p1[ 0 ], p2[ 1 ] - p1[ 1 ] ];     // 向量<p1, p2>

    var q0 = [ p0[ 0 ] + v01[ 0 ] * t, p0[ 1 ] + v01[ 1 ] * t ];
    var q1 = [ p1[ 0 ] + v12[ 0 ] * t, p1[ 1 ] + v12[ 1 ] * t ];

    var v = [ q1[ 0 ] - q0[ 0 ], q1[ 1 ] - q0[ 1 ] ];       // 向量<q0, q1>

    var b = [ q0[ 0 ] + v[ 0 ] * t, q0[ 1 ] + v[ 1 ] * t ];

    ctx.drawImage(img,(b[ 0 ]-5),(b[ 1 ]-5),10,10);



    if(type=='GPS'){
      ctx.strokeStyle= '#6ec9fd';
    }
    if(type=='CAN'){
      ctx.strokeStyle= '#3db765';
    }
    if(type=='radar'){
      ctx.strokeStyle= '#d47b24';
    }
    if(type=='event'){
      ctx.strokeStyle= '#f75b30';
    }
    ctx.font = '10px Adobe Ming Std';
    /*console.log("x"+b[ 0 ]+"---y"+b[ 1 ]);*/
    ctx.strokeText(type,(b[ 0 ]-5),(b[ 1 ]-10));
    ctx.stroke();

   /* img.onload = function () {
      ctx.drawImage(img,(b[ 0 ]),(b[ 1 ]),10,10);
    }
*/





  }

  clearLines() {
    /*this.i=0;*/
    var allCanvas;
    var lineCtx;
    console.log("进入了？"+this.i)
    this.isClear=true;
    if(this.order=='up'){

      /* allCanvas= document.querySelectorAll(".upCanvas");*/
      var obj0 = document.getElementById("up0");
      obj0.height = 0;
      obj0.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj1 = document.getElementById("up1");
      obj1.height = 0;
      obj1.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj2 = document.getElementById("up2");
      obj2.height = 0;
      obj2.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj3 = document.getElementById("up3");
      obj3.height = 0;
      obj3.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj4 = document.getElementById("up4");
      obj4.height = 0;
      obj4.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj5 = document.getElementById("up5");
      obj5.height = 0;
       obj5.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj6 = document.getElementById("up6");
      obj6.height = 0;
      obj6.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj7 = document.getElementById("up7");
      obj7.height = 0;
        obj7.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj8 = document.getElementById("up8");
      obj8.height = 0;
      obj8.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      var obj9 = document.getElementById("up9");
      obj9.height = 0;
      obj9.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );
      //清除所有节点
      /* console.log("startTime---"+new Date().getTime());*/
      /*for(var i=allCanvas.length-1;i>=0;i--){
        /!*container.removeChild(allCanvas[i]);*!/
      /!*  sessionStorage.removeItem('up'+i);*!/
        console.log("id===="+allCanvas[i].id);
        lineCtx = allCanvas[i].getContext( '2d' );
        /!*lineCtx.height=lineCtx.height;*!/
        lineCtx.strokeStyle='rgba(0,0,0,0)';
        lineCtx.clearRect( 0, 0, 1000, 1000 );
      }*/
      /*console.log("endTime---"+new Date().getTime());*/
    }
    if(this.order=='down'){
      allCanvas= document.querySelectorAll(".downCanvas");
      var obj0 = document.getElementById("down0");
      obj0.height = 0;
      /*obj0.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj1 = document.getElementById("down1");
      obj1.height = 0;
      /*obj1.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj2 = document.getElementById("down2");
      obj2.height = 0;
      /*obj2.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj3 = document.getElementById("down3");
      obj3.height = 0;
      /*obj3.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj4 = document.getElementById("down4");
      obj4.height = 0;
      /*obj4.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj5 = document.getElementById("down5");
      obj5.height = 0;
      /* obj5.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj6 = document.getElementById("down6");
      obj6.height = 0;
      /*obj6.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj7 = document.getElementById("down7");
      obj7.height = 0;
      /*  obj7.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj8 = document.getElementById("down8");
      obj8.height = 0;
      /*obj8.getContext( '2d' ).clearRect( 0, 0, 1200, 1000 );*/
      var obj9 = document.getElementById("down9");
      obj9.height = 0;
    }
  }

}
export default  Curve1;




