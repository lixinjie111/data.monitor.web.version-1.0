
/*var stopImgOpts = [];
var random = 0.1;
var i=0;*/
class Curve{
  static  i = 0;
  static stopImgOpts = [];
  constructor(){

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
  static animate(ctx,random,color,percent,i,start,end) {
    var _this = this;

    /* ctx.clearRect( 0, 0, 800, 800 );*/

    ctx.lineWidth = 0.1;
    ctx.shadowColor="#8fab4f";                //设置或返回用于阴影的颜色
    ctx.shadowBlur=10;
    ctx.strokeStyle = "#6fab3c";
     var random = 0.2;
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
      cancelAnimationFrame(this.stopImgOpts[i]);
    }
    console.log("percent----"+percent)
    this.stopImgOpts[i] = requestAnimationFrame(function() {
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
  static generatorImg(imgCtx,random,img,imgPercent,start,end,type) {
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
      window.cancelAnimationFrame(stop);
      imgCtx.clearRect( 10, 10, 1000, 1000 );
      return ;
    }
    var stop = requestAnimationFrame(function() {
      _this.generatorImg(imgCtx,random,img,imgPercent,start,end,type)
    });
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
  static generateForward(container,start,end,width,height,random,type){

   /* if(this.random<1){*/
      var color = 'rgb( ' +
        ( Math.random() * 255 >> 0 ) + ',' +
        ( Math.random() * 255 >> 0 ) + ',' +
        ( Math.random() * 255 >> 0 ) +
        ' )';
    var container = document.getElementById("canvasContainer");
    var random = 0.1;
    var i=0;
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
    random = random+0.1;
    //创建曲线canvas标签
    var lineObj = document.createElement('canvas');
    lineObj.id='canvas'+this.i;
    lineObj.className = 'canvas';
    container.appendChild(lineObj);
    //获取曲线的canvas对象
    var lineCanvas = document.getElementById( lineObj.id );
    var lineCtx = lineCanvas.getContext( '2d' );
    //设置或返回阴影距形状的垂直距离
     lineCtx.globalCompositeOperation = 'destination-out';
    /* lineCanvas.width='400';
     lineCanvas.height='200';*/
    lineCanvas.width=width*2;
    lineCanvas.height=height*2;
    /*lineCtx.translate(-1, 0.5);*/
    lineCanvas.style.width=width+'px';
    lineCanvas.style.height=height+'px';
    lineCtx.scale(2,2);

    //创建图像canvas标签
    var canvasObj = document.createElement('canvas');
    canvasObj.id='imgCanvas'+this.i;
    canvasObj.className = 'canvas';
    container.appendChild(canvasObj);
    //获取图像canvas对象
    var imgCanvas = document.getElementById( canvasObj.id );
    var imgCtx = imgCanvas.getContext( '2d' );

    imgCanvas.width=width*2;
    imgCanvas.height=height*2;
    /*lineCtx.translate(-1, 0.5);*/
    imgCanvas.style.width=width+'px';
    imgCanvas.style.height=height+'px';
    imgCtx.scale(2,2);

    //创建图像
    var imgObj = document.createElement('img');
    imgObj.id='plan'+this.i;
    imgObj.src = './static/images/circle.png';
    imgObj.style.display='none';
    container.appendChild(imgObj);

      //获取图像
      var img = document.getElementById(imgObj.id);
      this.animate(lineCtx,random,color,0,this.i,start,end);
      this.generatorImg(imgCtx,random,img,0,start,end,type);
      this.i++;
      this.random = this.random+0.1;

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

  static drawPath(ctx, start, end, curveness, percent){
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
  static drawImage( ctx, start, end, curveness, percent,img,type) {

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


    ctx.strokeStyle= '#f473ff';
    ctx.font = '10px Adobe Ming Std';
    ctx.strokeText(type,(b[ 0 ]-5),(b[ 1 ]-10));
    ctx.stroke();

    img.onload = function () {
      ctx.drawImage(img,(b[ 0 ]),(b[ 1 ]),10,10);
    }






  }

  static clearALL() {
    this.i=0;
    var allCanvas = document.querySelectorAll(".canvas");
    console.log(allCanvas);

    for (var i=0;i<this.stopImgOpts.length;i++){
      cancelAnimationFrame(this.stopImgOpts[i]);
    }

    allCanvas.forEach(function (item) {
      item.getContext("2d").clearRect(0,0,1000,1000);
    });

  }






}
export default  Curve;




