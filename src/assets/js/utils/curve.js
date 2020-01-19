class Curve{ 
  constructor(){

    this.stop1=null;
    this.stop2=null;
    this.drawArr = {
      'GPS+CAN':{
        points:[],
        firstdraw:true,
      },
      'BSM':{
        points:[],
        firstdraw:true,
      },
      'PER':{
        points:[],
        firstdraw:true,
      },
      'EVENT':{
        points:[],
        firstdraw:true,
      },
      'SPAT':{
        points:[],
        firstdraw:true,
      },
      'RSM/RCU':{
        points:[],
        firstdraw:true,
      },
    };
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
  animate(ctx,random,color,percent,start,end) {
    // console.log("开始时间-----"+new Date().getTime())
    //console.log("order------"+this.order);
    var _this = this;
    /* ctx.clearRect( 0, 0, 800, 800 );*/
    ctx.lineWidth = 0.1;
    /*ctx.shadowColor="#d28605";                //设置或返回用于阴影的颜色
    ctx.shadowBlur=10;*/
    ctx.strokeStyle = color;
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
    if(percent==60){
      cancelAnimationFrame(this.stop1);
      return;
    }
    this.stop1= requestAnimationFrame(function() {
      _this.animate(ctx,random,color,percent,start,end);
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

    if(imgPercent>60){
      this.drawArr[type].firstdraw = false;
      imgCtx.clearRect( 10, 10, 1000, 1000 );
      window.cancelAnimationFrame(this.stop2);
      return ;
    }
  
  
    imgCtx.clearRect(0, 0, 800, 800);
    imgCtx.beginPath();
    /* var random = 0.2;*/
    if(this.drawArr[type].firstdraw){
      this.drawImage(
        imgCtx,
        start,
        end,
        random,
        imgPercent,
        img,
        type
      );
    }
    // else{
    //   if(this.drawArr[type].points[imgPercent]){
    //     imgCtx.drawImage(img,this.drawArr[type].points[imgPercent][0],this.drawArr[type].points[imgPercent][1],20,20);
    //   }else{
    //     console.log(imgPercent)
    //     console.log(this.drawArr[type].points[imgPercent])
    //   }
     
    // }
    
    imgCtx.stroke();
    imgPercent = ( imgPercent + 1 ) % 100;   
    this.stop2 = requestAnimationFrame(function() { 
      _this.generatorImg(imgCtx,random,img,imgPercent,start,end,type);  
    });
  

    // function tick() {
       
    // 　　requestAnimationFrame(tick);
    // 　　now = Date.now();
    // 　　delta = now - then;
    // 　　if (delta > interval) {
    // 　　　　// 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
    // 　　　　then = now - (delta % interval);
    //        _this.generatorImg(imgCtx,random,img,imgPercent,start,end,type)
    // 　　}
    // }
    // tick();


    // let step = (timestamp, elapsed) => {
    //     if (elapsed > 1000 / 24) {
    //         elapsed = 0
    //     }
    //    console.log(111111)
    //     window.requestAnimationFrame(
    //         _timestamp => step(_timestamp, elapsed + _timestamp - timestamp)
    //     )
    // };
    // this.stop2 = requestAnimationFrame(timestamp => step(timestamp, 0));
  }
  drawLines(random,color,order,i,start,end){
    var lineCanvas = document.getElementById(order +i);
    var lineCtx = lineCanvas.getContext( '2d' );
    lineCtx.globalCompositeOperation = 'destination-out';
    lineCanvas.width=1200;
    lineCanvas.height=400;
    lineCanvas.style.width='600px';
    lineCanvas.style.height='200px';
    lineCtx.scale(2,2);
    this.animate(lineCtx,random,color,1,start, end);
  }


  drawImgs(random,type,order,i,start,end,color){
    var imgCanvas = document.getElementById(order+'Img'+i);
    var imgCtx = imgCanvas.getContext( '2d' );
    imgCanvas.height = imgCanvas.height;
    imgCtx.clearRect( 0, 0, 1000, 1000 );
    imgCanvas.width=1200;
    imgCanvas.height=400;
    imgCanvas.style.width='600px';
    imgCanvas.style.height='200px';
    imgCtx.scale(2,2);
    //获取图像
    var img = document.getElementById(order+"Plan"+i);
   
    if(this.drawArr[type].firstdraw){
      this.generatorImg(imgCtx,random,img,1,start, end,type);
    }else{
      let imgPercent = 0
   
      let stoptimeer = setInterval(() => {
        if(imgPercent>59){
          imgCtx.clearRect( 10, 10, 1000, 1000 );
          return ;
        }  
        imgCtx.clearRect(0, 0, 800, 800);
        imgCtx.beginPath();  
        imgCtx.drawImage(img,this.drawArr[type].points[imgPercent][0],this.drawArr[type].points[imgPercent][1],20,20);           
        imgCtx.stroke(); 
        imgPercent++;
      }, 50);
    }
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

    var t = percent / 60;

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

    var t = percent / 60;

    var p0 = start;
    var p1 = cp;
    var p2 = end;

    var v01 = [ p1[ 0 ] - p0[ 0 ], p1[ 1 ] - p0[ 1 ] ];     // 向量<p0, p1>
    var v12 = [ p2[ 0 ] - p1[ 0 ], p2[ 1 ] - p1[ 1 ] ];     // 向量<p1, p2>

    var q0 = [ p0[ 0 ] + v01[ 0 ] * t, p0[ 1 ] + v01[ 1 ] * t ];
    var q1 = [ p1[ 0 ] + v12[ 0 ] * t, p1[ 1 ] + v12[ 1 ] * t ];

    var v = [ q1[ 0 ] - q0[ 0 ], q1[ 1 ] - q0[ 1 ] ];       // 向量<q0, q1>

    var b = [ q0[ 0 ] + v[ 0 ] * t, q0[ 1 ] + v[ 1 ] * t ];

    this.drawArr[type].points.push([(b[ 0 ]-10),(b[ 1 ]-10)]);

    ctx.drawImage(img,(b[ 0 ]-10),(b[ 1 ]-10),20,20);

  }

}
export default  Curve;




