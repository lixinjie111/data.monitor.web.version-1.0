<template>
    <div style="width: 100%; height: 100%; left: 0px; top: 0px; ">
        <div :id="targetId"  style="height:100%;width:100%;"></div>
    </div>
</template>
<script>


import _ from 'lodash';



export default {
    name:"Tusvn3DMap2",
    props:["targetId","background","navMode","minX","minY","minZ","maxX","maxY","maxZ","defualtZ"],
    data(){
        return {
            mapoption:{
                doc: this.targetId,
                background:this.background == undefined? "black":this.background,
                navMode: this.navMode == undefined? Pt.EarthControls:Pt.OrbitControls   //    Pt.EarthControls  Pt.OrbitControls
            }
            ,viewer:null
            ,scene:null
            ,viewVector1:{x:this.minX,y:this.minY,z:this.minZ}
            ,viewVector2:{x:this.maxX,y:this.maxY,z:this.maxZ}


            ,shps:{}
            ,models:{}
            ,deviceModels:{
            }

            ,modelPersonArr:[]
            ,cacheModelNum:200
            ,interval:1
            ,count:0

            // ,websocketUrl:"ws://10.0.1.57:9999/ws"
            // ,websocketUrl:"ws://192.168.1.132:9998/ws"
            // ,websocketUrl:"ws://120.133.21.14:29998/ws"
            // ,websocketUrl:"ws://10.0.1.57:9982/mon"
            ,websocketUrl:"ws://192.168.1.68:9982/mon"
            ,hostWebsocket:null
            ,tweens: {}

            ,mainCarVID:"B21E-00-023"
            ,carBusinessData:{}
            ,action:'track'//hostVehicle  track
            ,vehicleIds:'B21E-00-017,B21E-00-018,B21E-00-019,B21E-00-020,B21E-00-021,B21E-00-022,B21E-00-023,B21E-00-024'
            ,defualtRadius:100
            ,defualtPitch:-0.8
            ,defualtZ:this.defualtZ==undefined?12.816:this.defualtZ
            ,rcuId:"2046A1037E1F"

            ,matStdObjects : new THREE.MeshStandardMaterial( { color: 0x7337E3, roughness: 1, metalness: 0 } )
            ,person : new THREE.MeshStandardMaterial( { color: 0xC4B17A, roughness: 1, metalness: 0 } )
            ,fontface:"宋体"
            ,fontSize:60

            ,pitch:0
            ,yaw:0
            ,roll:Math.PI*(65/90)
            // ,lastUtmPosition: null
            // ,nowUtmPosition: null
            // ,utmposition: null

            ,sourceProject:"EPSG:4326"
            // ,destinatePorject:"+proj=utm +zone=50 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"//北京
            ,destinatePorject:"+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"//上海
        }
    },
    watch:{
    },
    methods: {
        initMap:function(){
            this.viewer = dl.init(this.mapoption);
            this.scene = dl.scene;

            // //上海自测
            // this.addShape("intersection","./static/map3d/dl_shcsq_zc/Intersection.shp",dl.styles.intersection.color)
            // this.addShape("Crosswalk","./static/map3d/dl_shcsq_zc/Crosswalk.shp",dl.styles.crosswalk.color)
            // this.addShape("lane_marking","./static/map3d/dl_shcsq_zc/Lane_marking.shp",dl.styles.lane_marking.color)
            // this.addShape("lane_arrow","./static/map3d/dl_shcsq_zc/Direction_arrow.shp",dl.styles.lane_arrow.color)
            // this.addShape("lane_boundary","./static/map3d/dl_shcsq_zc/Lane_boundary.shp",dl.styles.lane_boundary.color)

            // //添加路灯
            // this.addModel('street_lamp_two_0','./static/map3d/models/street_lamp_two.3ds',325605.9620401191,3462422.087016858,this.defualtZ);
            // this.addModel('street_lamp_two_1','./static/map3d/models/street_lamp_two.3ds',325644.5698510726,3462439.737268414,this.defualtZ);
            // this.addModel('street_lamp_two_2','./static/map3d/models/street_lamp_two.3ds',325678.213173572,3462456.845491925,this.defualtZ);
            // this.addModel('street_lamp_two_3','./static/map3d/models/street_lamp_two.3ds',325714.8015379905,3462475.9571395535,this.defualtZ);
            // this.addModel('street_lamp_two_4','./static/map3d/models/street_lamp_two.3ds',325751.7192636788,3462494.9147299756,this.defualtZ);
            // this.addModel('street_lamp_two_5','./static/map3d/models/street_lamp_two.3ds',325791.2291744284,3462513.0858777757,this.defualtZ);
            // this.addModel('street_lamp_two_6','./static/map3d/models/street_lamp_two.3ds',325839.45728057146,3462528.673690394,this.defualtZ);
            // this.addModel('street_lamp_two_7','./static/map3d/models/street_lamp_two.3ds',325871.50033267133,3462535.577747621,this.defualtZ);
            // this.addModel('street_lamp_two_8','./static/map3d/models/street_lamp_two.3ds',325927.26942355325,3462540.7501094346,this.defualtZ);
            // this.addModel('street_lamp_two_9','./static/map3d/models/street_lamp_two.3ds',325971.1791292096,3462539.308385897,this.defualtZ);
            // this.addModel('street_lamp_two_10','./static/map3d/models/street_lamp_two.3ds',326011.51930734934,3462530.549954456,this.defualtZ);
            // this.addModel('street_lamp_two_11','./static/map3d/models/street_lamp_two.3ds',326060.29745298775,3462517.6961886724,this.defualtZ);
            // this.addModel('street_lamp_two_12','./static/map3d/models/street_lamp_two.3ds',326110.0640013865,3462499.7403886765,this.defualtZ);
            // this.addModel('street_lamp_two_13','./static/map3d/models/street_lamp_two.3ds',326146.8028378673,3462478.6396884797,this.defualtZ);
            // this.addModel('street_lamp_two_14','./static/map3d/models/street_lamp_two.3ds',326184.09992171597,3462451.135337721,this.defualtZ);
            // this.addModel('street_lamp_two_15','./static/map3d/models/street_lamp_two.3ds',326213.6642104323,3462424.026798547,this.defualtZ);
            // this.addModel('street_lamp_two_16','./static/map3d/models/street_lamp_two.3ds',326239.9417744168,3462394.325700396,this.defualtZ);
            // this.addModel('street_lamp_two_17','./static/map3d/models/street_lamp_two.3ds',326261.54341858963,3462364.523596104,this.defualtZ);
            // this.addModel('street_lamp_two_18','./static/map3d/models/street_lamp_two.3ds',326283.7656650753,3462325.9076287984,this.defualtZ);
            // this.addModel('street_lamp_two_19','./static/map3d/models/street_lamp_two.3ds',326293.7409365265,3462305.101613318,this.defualtZ);
            // this.addModel('street_lamp_two_20','./static/map3d/models/street_lamp_two.3ds',326317.89209304436,3462233.2914442807,this.defualtZ);
            // this.addModel('street_lamp_two_21','./static/map3d/models/street_lamp_two.3ds',326338.3463113972,3462166.509419441,this.defualtZ);
            // this.addModel('street_lamp_two_22','./static/map3d/models/street_lamp_two.3ds',326360.74210184,3462124.440723257,this.defualtZ);
            // this.addModel('street_lamp_two_23','./static/map3d/models/street_lamp_two.3ds',326381.50148141605,3462094.623117925,this.defualtZ);
            // this.addModel('street_lamp_two_24','./static/map3d/models/street_lamp_two.3ds',326404.88685793115,3462064.49447238,this.defualtZ)



            // this.addModel('street_lamp_two_opposite_0','./static/map3d/models/street_lamp_two.3ds',326539.9124336911,3461961.7054950483,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_1','./static/map3d/models/street_lamp_two.3ds',326513.87203228497,3461985.7805497725,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_2','./static/map3d/models/street_lamp_two.3ds',326481.66853339976,3462015.608493991,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_3','./static/map3d/models/street_lamp_two.3ds',326437.26901612466,3462057.088796324,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_4','./static/map3d/models/street_lamp_two.3ds',326407.9536514446,3462091.627984262,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_5','./static/map3d/models/street_lamp_two.3ds',326376.1808195288,3462139.740524388,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_6','./static/map3d/models/street_lamp_two.3ds',326350.5054369998,3462201.284972825,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_7','./static/map3d/models/street_lamp_two.3ds',326336.9131020676,3462244.3383032307,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_8','./static/map3d/models/street_lamp_two.3ds',326348.00984258053,3462274.3429545504,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_9','./static/map3d/models/street_lamp_two.3ds',326342.11978901166,3462296.5981887174,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_10','./static/map3d/models/street_lamp_two.3ds',326312.36564479594,3462319.9917033706,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_11','./static/map3d/models/street_lamp_two.3ds',326293.32005615474,3462357.6330448994,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_12','./static/map3d/models/street_lamp_two.3ds',326269.8965779829,3462393.1162129235,this.defualtZ);
            // // this.addModel('street_lamp_two_opposite_13','./static/map3d/models/street_lamp_two.3ds',326269.5184563148,3462393.419889987,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_14','./static/map3d/models/street_lamp_two.3ds',326254.2686340613,3462413.4506998067,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_15','./static/map3d/models/street_lamp_two.3ds',326225.2493836086,3462442.6320404094,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_16','./static/map3d/models/street_lamp_two.3ds',326183.79399392195,3462476.6293645953,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_17','./static/map3d/models/street_lamp_two.3ds',326152.984818381,3462497.958909394,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_18','./static/map3d/models/street_lamp_two.3ds',326109.57493707456,3462521.876607037,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_19','./static/map3d/models/street_lamp_two.3ds',326064.91023163777,3462539.4207325154,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_20','./static/map3d/models/street_lamp_two.3ds',326018.01353881694,3462553.284279363,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_21','./static/map3d/models/street_lamp_two.3ds',325971.39649421745,3462560.897562495,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_22','./static/map3d/models/street_lamp_two.3ds',325938.60034148674,3462562.482200762,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_23','./static/map3d/models/street_lamp_two.3ds',325904.6023904722,3462584.014099191,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_24','./static/map3d/models/street_lamp_two.3ds',325881.56604034174,3462581.124477936,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_25','./static/map3d/models/street_lamp_two.3ds',325858.1721216263,3462556.677784916,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_26','./static/map3d/models/street_lamp_two.3ds',325821.3680088696,3462547.6220940743,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_27','./static/map3d/models/street_lamp_two.3ds',325782.45188748406,3462534.4376719757,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_28','./static/map3d/models/street_lamp_two.3ds',325748.2227811228,3462518.9449371654,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_29','./static/map3d/models/street_lamp_two.3ds',325723.55472146743,3462502.401337263,this.defualtZ);
            // this.addModel('street_lamp_two_opposite_30','./static/map3d/models/street_lamp_two.3ds',325704.09742565616,3462492.017142771,this.defualtZ);


            // //添加红绿灯
            // this.addModel('traffic_light_0','./static/map3d/models/traffic_light.3ds',325921.545860186,3462541.0160225183,this.defualtZ);
            // this.addModel('traffic_light_1','./static/map3d/models/traffic_light.3ds',325868.4327871947,3462561.2291684817,this.defualtZ);
            // this.addModel('traffic_light_2','./static/map3d/models/traffic_light.3ds',325898.55675146834,3462539.0550170965,this.defualtZ);
            // this.addModel('traffic_light_3','./static/map3d/models/traffic_light.3ds',326325.78270624415,3462247.0504668984,this.defualtZ);
            // this.addModel('traffic_light_4','./static/map3d/models/traffic_light.3ds',326314.74230815104,3462313.111718161,this.defualtZ);
            // this.addModel('traffic_light_5','./static/map3d/models/traffic_light.3ds',326343.54615430237,3462286.313593357,this.defualtZ);

            // // //添加标识牌
            // this.addModel('traffic_sign_stop_0','./static/map3d/models/traffic_sign_stop.3ds',325894.67930130404,3462580.1783312797,this.defualtZ);
            // this.addModel('traffic_sign_stop_1','./static/map3d/models/traffic_sign_stop.3ds',326253.3704410266,3462374.6075555324,this.defualtZ);
            // this.addModel('traffic_sign_stop_2','./static/map3d/models/traffic_sign_stop.3ds',326260.07575023104,3462409.3542993385,this.defualtZ);
            // //初始化视锥体
            this.initView(this.viewVector1.x,this.viewVector1.y,this.viewVector1.z,this.viewVector2.x,this.viewVector2.y,this.viewVector2.z);


            // //矮路灯
            // this.addModel("lamppost_01","./static/map3d/models/lamppost_01.3ds",442496.96,4427294.44,16);
            // this.models["lamppost_01"].setHeading(30);
            // this.models["lamppost_01"].setUpdate(true);



            // //大路灯
            // this.addModel("street_lamp_two","./static/map3d/models/street_lamp_two.3ds",442501.99,4427272.65,16);
            // this.models["street_lamp_two"].setHeading(30);
            // this.models["street_lamp_two"].setUpdate(true);
            // //红绿灯
            // this.addModel("traffic_light","./static/map3d/models/traffic_light.3ds",442533.95,4427306.77,16);
            // this.models["traffic_light"].setHeading(30);
            // this.models["traffic_light"].setUpdate(true);

            // //标识牌
            // this.addModel("traffic_sign_stop","./static/map3d/models/traffic_sign_stop.3ds",442529.62,4427323.70,16);
            // this.models["traffic_sign_stop"].setHeading(120);
            // this.models["traffic_sign_stop"].setUpdate(true);

            // //女人
            // this.addModel("Girl walking N090814","./static/map3d/models/Girl walking N090814.3DS",442529.62,4427325.70,16);
            // this.models["Girl walking N090814"].setHeading(120);
            // this.models["Girl walking N090814"].setUpdate(true);
            // //男人
            // this.addModel("Man N151016.3DS","./static/map3d/models/Man N151016.3DS",442531.62,4427325.70,16);
            // this.models["Man N151016.3DS"].setHeading(120);
            // this.models["Man N151016.3DS"].setUpdate(true);

            //障碍物
            // this.addModel("traffic_cone","./static/map3d/models/traffic_cone.3ds",442492.797,4427280.995,16);
            // this.models["traffic_cone"].setHeading(30);
            // this.models["traffic_cone"].setUpdate(true);

            //初始化websocket连接
            // this.initWebsocket(this.websocketUrl);
            // setInterval(()=>{
            //    let camera =  dl.viewer.scene.view;
            //    console.log(camera);
            // },1000);

            setTimeout(()=>{
                // 442454.32658246456,4427227.8078830885, 37.73509248844059, 0.0000028926452461693342,-0.5081018518518544,-0.7385192219746066
                // 442454.32658068417,4427227.807881102,37.735093606867046,0.0000028926452461693342,-0.39699074074074336,-0.730706721974606
                //科技园
                // this.updateCameraPosition(442454.32658068417,4427227.807881102,37.735093606867046,0.0000028926452461693342,-0.39699074074074336,-0.730706721974606);
                //科技园 小图
                // this.updateCameraPosition(442483.4140577592,4427251.954939776,31.211585511525108,31.559324326695666,-0.6520903697733481,-0.5889099326599347);
                this.$emit("mapcomplete",this);
                //上海
                // this.updateCameraPosition(326181.72659014474,3462354.6747002415,737.3642832288795,741.5052736914325,-1.5707963267948966,-0.05266622778143515);

                //上海自采 裁剪
                this.updateCameraPosition(326181.72659014474,3462354.6747002415,737.3642832288795,741.5052736914325,-1.5707963267948966,-0.05266622778143515);

            },500);



        },
        initView:function(x1,y1,z1,x2,y2,z2){
            let bbox = new THREE.Box3(new THREE.Vector3(x1,y1,z1), new THREE.Vector3(x2,y2,z2));
            dl.initView(bbox,this.viewer);
        },
        addShape:function(name,url,color){
            let shp = new dl.Shape({
                url: url,
                name: name,
                color: color
            });
            this.scene.add(shp);

            this.shps[name]=shp;
        },
        addModel:function(name,url,x,y,z){
            let model = new dl.Model({url: url});
            model.position.x = x;
            model.position.y = y;
            model.position.z = z;
            this.scene.add(model);

            this.models[name]=model;
        },
        getModel:function(id){
          return this.models[id];
        },
        updateModelPostion:function(modelId,x,y,z,heading){
            let model = this.models[modelId];
            if(model!=null)
            {
                model.position.x = x;
                model.position.y = y;
                model.position.z = z;
                model.setHeading(heading);
            }
        },
        updateCameraPosition:function(x,y,z,radius,pitch,yaw){
            dl.moveTo({
                position: [x,y, z],
                radius: radius,
                yaw: yaw,
                pitch: pitch,
                viewer:this.viewer
            });
        },
        animate:function(time){
            requestAnimationFrame( animate );
            TWEEN.update( time );
        },
        update:function(e) {
            // console.log("=====================update====================================");
            // console.log(e)
            // model.position.x = lastUtmPosition.x;
            // model.position.y = lastUtmPosition.y;
            // model.setHeading(-Math.PI / 180 * (lastUtmPosition.rotation));
            // dl.moveTo({
            //         position: [lastUtmPosition.x+6,lastUtmPosition.y, 12.816],
            //         radius: 80,
            //         yaw: -Math.PI / 180 * (lastUtmPosition.rotation),
            //         pitch: -0.8
            // });
        },
        resetCamera:function(){
            this.updateCameraPosition(442456.0905737311,4427223.965503679, 60.22107514430958, 2.4329173138415072,-0.6747685185185206,-0.7853942219746017);
        },
        initWebsocket:function(url){
            if ('WebSocket' in window) {
                this.hostWebsocket = new WebSocket(url);
                this.hostWebsocket.onmessage = this.onMessage;
                this.hostWebsocket.onclose = this.onClose;
                this.hostWebsocket.onopen = this.onOpen;
                this.hostWebsocket.onerror = this.onError;
            }else{
                console.log("该浏览器不支持WebSocket!");
            }
        },
        timetrans:function (timestamp){
          var date = new Date(timestamp);//如果date为13位不需要乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
          var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
          var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
          var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
          var ms= date.getMilliseconds();
          return Y+M+D+h+m+s+"."+ms;
        },
        showBData:function(data)
        {
            this.models={};
            var time = this.timetrans(data.timestamp);
            this.$emit('showTimeStamp',time);
            var deviceid = data.deviceId;
            if(this.deviceModels[deviceid]==null)
            {
                this.deviceModels[deviceid]={cars:[],persons:[],texts:[]};
                for(let m = 0;m<this.cacheModelNum;m++)
                {

                    //圆球
                    // var geoSphere = new THREE.SphereBufferGeometry( 0.8, 15, 15 );
                    // var model = new THREE.Mesh( geoSphere, matStdObjects );
                    // model.position.set( 0, 0, 0 );
                    // model.castShadow = true;
                    // model.receiveShadow = true;
                    // 0019D1AA0424  0019EAFA0104  0019EAFA0102  0018EAFA0332
                    //车
                    var geoBox1 = new THREE.BoxBufferGeometry(1.7, 4.6, 1.4);
                    var model1 = new THREE.Mesh( geoBox1, this.matStdObjects );
                    model1.position.set( 0, 0, 0 );
                    model1.rotation.set( this.pitch,this.yaw,this.roll );
                    model1.castShadow = true;
                    model1.receiveShadow = true;

                    this.scene.add(model1);
                    this.deviceModels[deviceid].cars[m] = model1;

                    var pBox1 = new THREE.BoxBufferGeometry(0.4, 0.4, 1.7);
                    var pmodel1 = new THREE.Mesh( pBox1, this.person );
                    pmodel1.position.set( 0, 0, 0 );
                    pmodel1.rotation.set( 0, 0, 0 );
                    pmodel1.castShadow = true;
                    pmodel1.receiveShadow = true;

                    this.deviceModels[deviceid].persons[m]= pmodel1;
                    this.scene.add(pmodel1);


                    var text1 = new dl.Text({
                        text:"",
                        fontsize:this.fontSize,
                        borderThickness:0,
                        textColor:{r: 0, g: 0, b: 0, a: 1.0}
                    });

                    this.deviceModels[deviceid].texts[m]=text1;
                    this.scene.add(text1);
                    text1.setPositon([0,0,0]);
                    text1.fontface=this.fontface;
                    text1.update();
                }
            }else{
                for(let p=0;p<this.deviceModels[deviceid].cars.length;p++)
                {
                    let car = this.deviceModels[deviceid].cars[p];
                    car.position.x = 0;
                    car.position.y = 0;
                    car.position.z = 0;

                    let person = this.deviceModels[deviceid].persons[p];
                    person.position.x = 0;
                    person.position.y = 0;
                    person.position.z = 0;
                }
            }
        },
        showBData2:function(data){
             var deviceid = null;
            if(data!=null)
            {
                var time = this.timetrans(data.timestamp);
                this.$emit('showTimeStamp',time);
                deviceid = data.deviceId;
                if(this.deviceModels[deviceid]==null)
                {
                    this.deviceModels[deviceid]={cars:[],persons:[],texts:[]};
                    for(let m = 0;m<this.cacheModelNum;m++)
                    {

                        //圆球
                        // var geoSphere = new THREE.SphereBufferGeometry( 0.8, 15, 15 );
                        // var model = new THREE.Mesh( geoSphere, matStdObjects );
                        // model.position.set( 0, 0, 0 );
                        // model.castShadow = true;
                        // model.receiveShadow = true;
                        // 0019D1AA0424  0019EAFA0104  0019EAFA0102  0018EAFA0332
                        //车
                        var geoBox1 = new THREE.BoxBufferGeometry(1.7, 4.6, 1.4);
                        var model1 = new THREE.Mesh( geoBox1, this.matStdObjects );
                        model1.position.set( 0, 0, 0 );
                        model1.rotation.set( this.pitch,this.yaw,this.roll );
                        model1.castShadow = true;
                        model1.receiveShadow = true;

                        this.scene.add(model1);
                        this.deviceModels[deviceid].cars[m] = model1;

                        var pBox1 = new THREE.BoxBufferGeometry(0.4, 0.4, 1.7);
                        var pmodel1 = new THREE.Mesh( pBox1, this.person );
                        pmodel1.position.set( 0, 0, 0 );
                        pmodel1.rotation.set( 0, 0, 0 );
                        pmodel1.castShadow = true;
                        pmodel1.receiveShadow = true;

                        this.deviceModels[deviceid].persons[m]= pmodel1;
                        this.scene.add(pmodel1);


                        var text1 = new dl.Text({
                            text:"",
                            fontsize:this.fontSize,
                            borderThickness:0,
                            textColor:{r: 0, g: 0, b: 0, a: 1.0}
                        });

                        this.deviceModels[deviceid].texts[m]=text1;
                        this.scene.add(text1);
                        text1.setPositon([0,0,0]);
                        text1.fontface=this.fontface;
                        text1.update();
                    }
                }else{
                    for(let p=0;p<this.deviceModels[deviceid].cars.length;p++)
                    {
                        let car = this.deviceModels[deviceid].cars[p];
                        car.position.x = 0;
                        car.position.y = 0;
                        car.position.z = 0;

                        let person = this.deviceModels[deviceid].persons[p];
                        person.position.x = 0;
                        person.position.y = 0;
                        person.position.z = 0;
                    }
                }

            }
            for(let i = 0;i<data.data.targets.length;i++)
            {
                let d = data.data.targets[i];
                // // console.log(rsuDatas[i]);
                let dUTM = proj4(this.sourceProject,this.destinatePorject,[d.longitude,d.latitude]);

                if(d.type==0||d.type==1||d.type==3)
                {
                    if(i<this.deviceModels[deviceid].persons.length)
                    {
                        let mdl = this.deviceModels[deviceid].persons[i];
                        mdl.position.x = dUTM[0];
                        mdl.position.y = dUTM[1];
                        mdl.position.z = this.defualtZ+4;

                        let text = this.deviceModels[deviceid].texts[i];
                        text.setText(d.uuid.substr(0,8));
                        text.setPositon([dUTM[0],dUTM[1],this.defualtZ+5]);
                    }
                }else{
                    if(i<this.deviceModels[deviceid].cars.length)
                    {
                        let mdl = this.deviceModels[deviceid].cars[i];
                        mdl.position.x = dUTM[0];
                        mdl.position.y = dUTM[1];
                        mdl.position.z = this.defualtZ+4;

                        let text = this.deviceModels[deviceid].texts[i];
                        text.setText(d.uuid.substr(0,8));
                        text.setPositon([dUTM[0],dUTM[1],this.defualtZ+6]);
                    }
                }
            }
        },
        setInterval:function(interval)
        {
            this.interval = interval;
            this.count = 0;
        },
        onMessage:function(data){
            this.models={};
            this.count++;
            if((this.count%this.interval)!=0)
            {
                return;
            }
            let rsuDatas = JSON.parse(data.data);
            var deviceid = null;
            if(rsuDatas.result.length>0)
            {
                var time = this.timetrans(rsuDatas.result[0].timestamp);
                this.$emit('showTimeStamp',time);
                deviceid = rsuDatas.result[0].deviceId;
                if(this.deviceModels[deviceid]==null)
                {
                    this.deviceModels[deviceid]={cars:[],persons:[],texts:[]};
                    for(let m = 0;m<this.cacheModelNum;m++)
                    {

                        //圆球
                        // var geoSphere = new THREE.SphereBufferGeometry( 0.8, 15, 15 );
                        // var model = new THREE.Mesh( geoSphere, matStdObjects );
                        // model.position.set( 0, 0, 0 );
                        // model.castShadow = true;
                        // model.receiveShadow = true;
                        // 0019D1AA0424  0019EAFA0104  0019EAFA0102  0018EAFA0332
                        //车
                        var geoBox1 = new THREE.BoxBufferGeometry(1.7, 4.6, 1.4);
                        var model1 = new THREE.Mesh( geoBox1, this.matStdObjects );
                        model1.position.set( 0, 0, 0 );
                        model1.rotation.set( this.pitch,this.yaw,this.roll );
                        model1.castShadow = true;
                        model1.receiveShadow = true;

                        this.scene.add(model1);
                        this.deviceModels[deviceid].cars[m] = model1;

                        var pBox1 = new THREE.BoxBufferGeometry(0.4, 0.4, 1.7);
                        var pmodel1 = new THREE.Mesh( pBox1, this.person );
                        pmodel1.position.set( 0, 0, 0 );
                        pmodel1.rotation.set( 0, 0, 0 );
                        pmodel1.castShadow = true;
                        pmodel1.receiveShadow = true;

                        this.deviceModels[deviceid].persons[m]= pmodel1;
                        this.scene.add(pmodel1);


                        var text1 = new dl.Text({
                            text:"",
                            fontsize:this.fontSize,
                            borderThickness:0,
                            textColor:{r: 0, g: 0, b: 0, a: 1.0}
                        });

                        this.deviceModels[deviceid].texts[m]=text1;
                        this.scene.add(text1);
                        text1.setPositon([0,0,0]);
                        text1.fontface=this.fontface;
                        text1.update();
                    }
                }else{
                    for(let p=0;p<this.deviceModels[deviceid].cars.length;p++)
                    {
                        let car = this.deviceModels[deviceid].cars[p];
                        car.position.x = 0;
                        car.position.y = 0;
                        car.position.z = 0;
                    }

                    for(let p=0;p<this.deviceModels[deviceid].persons.length;p++)
                    {
                        let person = this.deviceModels[deviceid].persons[p];
                        person.position.x = 0;
                        person.position.y = 0;
                        person.position.z = 0;
                    }

                    for(let p=0;p<this.deviceModels[deviceid].texts.length;p++){
                        var text1 = this.deviceModels[deviceid].texts[p];
                        text1.setPositon([0,0,0]);
                        text1.update();
                    }
                }

            }
            for(let i = 0;i<rsuDatas.result.length;i++)
            {
                let d = rsuDatas.result[i];
                // // console.log(rsuDatas[i]);
                let dUTM = proj4(this.sourceProject,this.destinatePorject,[d.target.longitude,d.target.latitude]);

                if(d.target.type==0||d.target.type==1||d.target.type==3)
                {
                    if(i<this.deviceModels[deviceid].persons.length)
                    {
                        let mdl = this.deviceModels[deviceid].persons[i];
                        mdl.position.x = dUTM[0];
                        mdl.position.y = dUTM[1];
                        mdl.position.z = this.defualtZ+4;

                        let text = this.deviceModels[deviceid].texts[i];
                        text.setText(d.target.uuid.substr(0,8));
                        text.setPositon([dUTM[0],dUTM[1],this.defualtZ+5]);
                    }
                }else{
                    if(i<this.deviceModels[deviceid].cars.length)
                    {
                        let mdl = this.deviceModels[deviceid].cars[i];
                        mdl.position.x = dUTM[0];
                        mdl.position.y = dUTM[1];
                        mdl.position.z = this.defualtZ+4;

                        let text = this.deviceModels[deviceid].texts[i];
                        text.setText(d.target.uuid.substr(0,8));
                        text.setPositon([dUTM[0],dUTM[1],this.defualtZ+6]);
                    }
                }
            }
        },
        onClose:function(data){
            console.log("结束连接");
        },
        reset3DMap:function(){
            for(var key in this.deviceModels){
                for(let p=0;p<this.deviceModels[key].cars.length;p++)
                {
                    let car = this.deviceModels[key].cars[p];
                    car.position.x = 0;
                    car.position.y = 0;
                    car.position.z = 0;
                }

                for(let p=0;p<this.deviceModels[key].persons.length;p++)
                {
                    let person = this.deviceModels[key].persons[p];
                    person.position.x = 0;
                    person.position.y = 0;
                    person.position.z = 0;
                }

                for(let p=0;p<this.deviceModels[key].texts.length;p++){
                    var text1 = this.deviceModels[key].texts[p];
                    text1.setPositon([0,0,0]);
                    text1.update();
                }
        　　}
            if ('WebSocket' in window) {
                if(window.WebSocket){
                    if(this.hostWebsocket!=null)
                    {
                        if(this.hostWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                            this.hostWebsocket.close();
                        }
                    }
                    this.hostWebsocket=null;
                }
             }else{
                 console.log("该浏览器不支持websocket");
             }
        },
        changeRcuId:function(url,rcuid)
        {
            this.websocketUrl = url;
            this.rcuId = rcuid;
             if ('WebSocket' in window) {
                if(window.WebSocket){
                    if(this.hostWebsocket!=null)
                    {
                        if(this.hostWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                            this.hostWebsocket.close();
                        }
                    }
                    this.hostWebsocket=null;
                    this.hostWebsocket = new WebSocket(this.websocketUrl);
                    this.hostWebsocket.onmessage = this.onMessage;
                    this.hostWebsocket.onclose = this.onClose;
                    this.hostWebsocket.onopen = this.onOpen;
                    this.hostWebsocket.onerror = this.onError;
                }
             }else{
                 console.log("该浏览器不支持websocket");
             }
        },
        onOpen:function(){
            // console.log("建立连接");
            // 2046A1035893
            // var hostVehicle = '{"action":"rcu","data":{"rcuId":"2046A1037E1F"},"token":"fpx"}';
            // var hostVehicleMsg = JSON.stringify(hostVehicle);
            var hostVehicle = '{"action":"RCUPer","devId":"'+this.rcuId+'"}';
            this.sendMsg(hostVehicle);
        },
        sendMsg:function(msg){
            if(window.WebSocket){
                if(this.hostWebsocket.readyState == WebSocket.OPEN) { //如果WebSocket是打开状态
                    this.hostWebsocket.send(msg); //send()发送消息
                    console.log("已发送消息:"+ msg);
                }
            }
        },
        onError:function(e){
            console.log(e);
        },
        pageResize(){
            const borwserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            this.pageHeight = borwserHeight - 64;
            // console.log('pageHeight : ' + this.pageHeight)
        },
        resize:function(size)
        {

        }
    },
    created(){

    },
    mounted(){
        this.pageResize();
        window.onresize = () => {
            this.pageResize();
        }
        //初始化地图
        setTimeout(() => {
            this.initMap();
        }, 1000);
    },
    destroyed(){

    }
}
</script>
<style>
    #map {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin:0;
    }
    canvas {
        width: 100%;
        height: 100%;
        position: relative;
    }

</style>
