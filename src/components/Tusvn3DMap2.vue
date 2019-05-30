<template>
    <div style="width: 100%; height: 100%; left: 0px; top: 0px; ">
        <div :id="targetId"  style="height:100%;width:100%;"></div>
    </div>
</template>
<script>


import _ from 'lodash';



export default {
    name:"Tusvn3DMap2",
    props:["targetId"],
    data(){
        return {
            mapoption:{
                doc: this.targetId,
                background:"black",
                navMode: Pt.OrbitControls
            }
            // ,viewVector1:{x:287406.0,y:3463772,z:50}
            // ,viewVector2:{x:287707.0,y:3463835.0,z:80.0}

            ,viewVector1:{x:442350.475567611,y:4427186.352713934,z:50}
            ,viewVector2:{x:442637.284474562,y:4427363.359317946,z:80.0}

            ,shps:{}
            ,models:{}
// 0019D1AA0424  0019EAFA0104  0019EAFA0102  0018EAFA0332
            ,deviceModels:{
                "0019D1AA0424":{cars:[],persons:[]},
                "0019EAFA0104":{cars:[],persons:[]},
                "0019EAFA0102":{cars:[],persons:[]},
                "0018EAFA0332":{cars:[],persons:[]},
            }

            ,modelPersonArr:[]
            ,cacheModelNum:15

            // ,websocketUrl:"ws://10.0.1.57:9999/ws"
            // ,websocketUrl:"ws://192.168.1.132:9998/ws"
            ,websocketUrl:"ws://120.133.21.14:29998/ws"
            ,hostWebsocket:null
            ,tweens: {}

            ,mainCarVID:"B21E-00-023"
            ,carBusinessData:{}
            ,action:'track'//hostVehicle  track
            ,vehicleIds:'B21E-00-017,B21E-00-018,B21E-00-019,B21E-00-020,B21E-00-021,B21E-00-022,B21E-00-023,B21E-00-024'
            ,defualtRadius:100
            ,defualtPitch:-0.8
            ,defualtZ:12.816

            ,pitch:0
            ,yaw:0
            ,roll:Math.PI*(65/90)
            // ,lastUtmPosition: null
            // ,nowUtmPosition: null
            // ,utmposition: null

            ,sourceProject:"EPSG:4326"
            ,destinatePorject:"+proj=utm +zone=50 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
        }
    },
    watch:{
    },
    methods: {
        initMap:function(){
            dl.init(this.mapoption);
            //添加数据
            // this.addShape("intersection","./static/map3d/suzhou_CityRoad_utm51/Intersection.shp",dl.styles.intersection.color)
            // this.addShape("Crosswalk","./static/map3d/suzhou_CityRoad_utm51/Crosswalk.shp",dl.styles.crosswalk.color)
            // this.addShape("lane_marking","./static/map3d/suzhou_CityRoad_utm51/Lane_marking.shp",dl.styles.lane_marking.color)
            // this.addShape("lane_arrow","./static/map3d/suzhou_CityRoad_utm51/Direction_arrow.shp",dl.styles.lane_arrow.color)
            // this.addShape("lane_boundary","./static/map3d/suzhou_CityRoad_utm51/Lane_boundary.shp",dl.styles.lane_boundary.color)

            // this.addShape("Crosswalk2","./static/map3d/kjy/UTM/crosswalk.shp","#999999")
            // this.addShape("lane2","./static/map3d/kjy/UTM/lane.shp",dl.styles.lane_boundary.color)
            // this.addShape("roadline2","./static/map3d/kjy/UTM/roadline.shp",dl.styles.lane_boundary.color)

          this.addShape("Crosswalk2","./static/map3d/newUTMData/crosswalk.shp","#999999")
          this.addShape("lane2","./static/map3d/newUTMData/lane.shp",dl.styles.lane_boundary.color)
          this.addShape("roadline2","./static/map3d/newUTMData/roadline.shp",dl.styles.lane_boundary.color)

          // this.addShape("1","./static/map3d/kjy/UTM/1.shp",dl.styles.lane_boundary.color)
          //   this.addShape("2","./static/map3d/kjy/UTM/2.shp",dl.styles.lane_boundary.color)
          //   this.addShape("3","./static/map3d/kjy/UTM/3.shp",dl.styles.lane_boundary.color)
          //   this.addShape("4","./static/map3d/kjy/UTM/4.shp",dl.styles.lane_boundary.color)
          //   this.addShape("5","./static/map3d/kjy/UTM/5.shp",dl.styles.lane_boundary.color)
          //   this.addShape("6","./static/map3d/kjy/UTM/6.shp",dl.styles.lane_boundary.color)
          //   this.addShape("7","./static/map3d/kjy/UTM/7.shp",dl.styles.lane_boundary.color)
          //   this.addShape("8","./static/map3d/kjy/UTM/8.shp",dl.styles.lane_boundary.color)
          //   this.addShape("9","./static/map3d/kjy/UTM/9.shp",dl.styles.lane_boundary.color)
          //   this.addShape("10","./static/map3d/kjy/UTM/10.shp",dl.styles.lane_boundary.color)
          //   this.addShape("11","./static/map3d/kjy/UTM/11.shp",dl.styles.lane_boundary.color)
          //   this.addShape("12","./static/map3d/kjy/UTM/12.shp",dl.styles.lane_boundary.color)


            // this.addShape("lane_marking","./static/map3d/suzhou_CityRoad_utm51/Lane_marking.shp",dl.styles.lane_marking.color)
            // this.addShape("lane_arrow","./static/map3d/suzhou_CityRoad_utm51/Direction_arrow.shp",dl.styles.lane_arrow.color)

            //初始化视锥体
            this.initView(this.viewVector1.x,this.viewVector1.y,this.viewVector1.z,this.viewVector2.x,this.viewVector2.y,this.viewVector2.z);

            // this.updateCameraPosition(442455.99844902,4427229.863377506,58.45029574064428,147.4909535804191,-0.6650238516042308,-0.8020833333333345);
            //添加模型
            // this.addModel("car","./static/map3d/map_photo/car.3DS",0,0,12.816);


            //初始化websocket连接
            this.initWebsocket(this.websocketUrl);
            // setInterval(()=>{
            //    let camera =  dl.viewer.scene.view;
            //    console.log(camera);
            // },1000);

            setTimeout(()=>{
                // 442454.32658246456,4427227.8078830885, 37.73509248844059, 0.0000028926452461693342,-0.5081018518518544,-0.7385192219746066
                // 442454.32658068417,4427227.807881102,37.735093606867046,0.0000028926452461693342,-0.39699074074074336,-0.730706721974606
                this.updateCameraPosition(442454.32658068417,4427227.807881102,37.735093606867046,0.0000028926452461693342,-0.39699074074074336,-0.730706721974606);
                var matStdObjects = new THREE.MeshStandardMaterial( { color: 0x7337E3, roughness: 1, metalness: 0 } );
                var person = new THREE.MeshStandardMaterial( { color: 0xC4B17A, roughness: 1, metalness: 0 } );
                for(let m = 0;m<this.cacheModelNum;m++)
                {
                    // let model = new dl.Model({url: "./static/map3d/map_photo/car.3DS"});
                    // model.position.x = 0;
                    // model.position.y = 0;
                    // model.position.z = 0;

                    //圆球
                    // var geoSphere = new THREE.SphereBufferGeometry( 0.8, 15, 15 );
                    // var model = new THREE.Mesh( geoSphere, matStdObjects );
                    // model.position.set( 0, 0, 0 );
                    // model.castShadow = true;
                    // model.receiveShadow = true;
                    // 0019D1AA0424  0019EAFA0104  0019EAFA0102  0018EAFA0332
                    //车
                    var geoBox1 = new THREE.BoxBufferGeometry(1.7, 4.6, 1.4);
                    var model1 = new THREE.Mesh( geoBox1, matStdObjects );
                    model1.position.set( 0, 0, 0 );
                    model1.rotation.set( this.pitch,this.yaw,this.roll );
                    model1.castShadow = true;
                    model1.receiveShadow = true;

                    dl.scene.add(model1);
                    this.deviceModels["0019D1AA0424"].cars[m] = model1;

                    var pBox1 = new THREE.BoxBufferGeometry(0.4, 0.4, 1.7);
                    var pmodel1 = new THREE.Mesh( pBox1, person );
                    pmodel1.position.set( 0, 0, 0 );
                    pmodel1.rotation.set( 0, 0, 0 );
                    pmodel1.castShadow = true;
                    pmodel1.receiveShadow = true;

                    this.deviceModels["0019D1AA0424"].persons[m]= pmodel1;
                    dl.scene.add(pmodel1);





                    var geoBox2 = new THREE.BoxBufferGeometry(1.7, 4.6, 1.4);
                    var model2 = new THREE.Mesh( geoBox2, matStdObjects );
                    model2.position.set( 0, 0, 0 );
                    model2.rotation.set( this.pitch,this.yaw,this.roll );
                    model2.castShadow = true;
                    model2.receiveShadow = true;

                    dl.scene.add(model2);
                    this.deviceModels["0019EAFA0104"].cars[m] = model2;

                    var pBox2 = new THREE.BoxBufferGeometry(0.4, 0.4, 1.7);
                    var pmodel2 = new THREE.Mesh( pBox2, person );
                    pmodel2.position.set( 0, 0, 0 );
                    pmodel2.rotation.set( 0, 0, 0 );
                    pmodel2.castShadow = true;
                    pmodel2.receiveShadow = true;

                    this.deviceModels["0019EAFA0104"].persons[m]= pmodel2;
                    dl.scene.add(pmodel2);





                    var geoBox3 = new THREE.BoxBufferGeometry(1.7, 4.6, 1.4);
                    var model3 = new THREE.Mesh( geoBox3, matStdObjects );
                    model3.position.set( 0, 0, 0 );
                    model3.rotation.set( this.pitch,this.yaw,this.roll );
                    model3.castShadow = true;
                    model3.receiveShadow = true;

                    dl.scene.add(model3);
                    this.deviceModels["0019EAFA0102"].cars[m] = model3;

                    var pBox3 = new THREE.BoxBufferGeometry(0.4, 0.4, 1.7);
                    var pmodel3 = new THREE.Mesh( pBox3, person );
                    pmodel3.position.set( 0, 0, 0 );
                    pmodel3.rotation.set( 0, 0, 0 );
                    pmodel3.castShadow = true;
                    pmodel3.receiveShadow = true;

                    this.deviceModels["0019EAFA0102"].persons[m]= pmodel3;
                    dl.scene.add(pmodel3);







                    var geoBox4 = new THREE.BoxBufferGeometry(1.7, 4.6, 1.4);
                    var model4 = new THREE.Mesh( geoBox4, matStdObjects );
                    model4.position.set( 0, 0, 0 );
                    model4.rotation.set( this.pitch,this.yaw,this.roll );
                    model4.castShadow = true;
                    model4.receiveShadow = true;

                    dl.scene.add(model4);
                    this.deviceModels["0018EAFA0332"].cars[m] = model4;

                    var pBox4 = new THREE.BoxBufferGeometry(0.4, 0.4, 1.7);
                    var pmodel4 = new THREE.Mesh( pBox4, person );
                    pmodel4.position.set( 0, 0, 0 );
                    pmodel4.rotation.set( 0, 0, 0 );
                    pmodel4.castShadow = true;
                    pmodel4.receiveShadow = true;

                    this.deviceModels["0018EAFA0332"].persons[m]= pmodel4;
                    dl.scene.add(pmodel4);




                    //ren
                    // var pBox = new THREE.BoxBufferGeometry( 0.5, 1, 0.5);
                    // var pmodel = new THREE.Mesh( pBox, matStdObjects );
                    // pmodel.position.set( 0, 0, 0 );
                    // pmodel.rotation.set( 0, Math.PI / 2.0, 0 );
                    // pmodel.castShadow = true;
                    // pmodel.receiveShadow = true;

                    // this.modelPersonArr[m] = pmodel;
                    // dl.scene.add(pmodel);


                    // modelPersonArr
                }

                // var geoBox5 = new THREE.BoxBufferGeometry( 0.5, 1, 0.5);
                // var model5 = new THREE.Mesh( geoBox5, matStdObjects );
                // model5.position.set( 0, 0, 0 );
                // model5.rotation.set( this.pitch,this.yaw,this.roll );
                // model5.castShadow = true;
                // model5.receiveShadow = true;

                // dl.scene.add(model5);

                // var pBox6 = new THREE.BoxBufferGeometry( 1, 0.5, 0.5);
                // var pmodel6 = new THREE.Mesh( pBox6, person );
                // pmodel6.position.set( 0, 0, 0 );
                // pmodel6.rotation.set( 0, 0, 0 );
                // pmodel6.castShadow = true;
                // pmodel6.receiveShadow = true;

                // dl.scene.add(pmodel6);
                // console.log(this.modelArr.length);
            },500);


        },
        initView:function(x1,y1,z1,x2,y2,z2){
            let bbox = new THREE.Box3(new THREE.Vector3(x1,y1,z1), new THREE.Vector3(x2,y2,z2));
            dl.initView(bbox);
        },
        addShape:function(name,url,color){
            let shp = new dl.Shape({
                url: url,
                name: name,
                color: color
            });
            dl.scene.add(shp);

            this.shps[name]=shp;
        },
        addModel:function(name,url,x,y,z){
            let model = new dl.Model({url: url});
            model.position.x = x;
            model.position.y = y;
            model.position.z = z;
            dl.scene.add(model);

            this.models[name]=model;
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
                pitch: pitch
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
        onMessage:function(data){
            // console.log(data);
            this.models={};
            // this.deviceModels

            // for(let p=0;p<this.modelArr.length;p++)
            // {
            //     let mdl = this.modelArr[p];
            //     mdl.position.x = 0;
            //     mdl.position.y = 0;
            //     mdl.position.z = 0;
            // }
            // let models = dl.models;
            // if(models!=null)
            // {
            //     for(let n = 0;n<models.length;n++)
            //     {
            //         dl.removeModel(models[n]);
            //     }
            // }

            let rsuDatas = JSON.parse(data.data);
            var deviceid = null;
            if(rsuDatas.length>0)
            {
              var time = this.timetrans(rsuDatas[0].timestamp);
              this.$emit('showTimeStamp',time);
                deviceid = rsuDatas[0].deviceId;
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
            for(let i = 0;i<rsuDatas.length;i++)
            {
                let d = rsuDatas[i];
                // // console.log(rsuDatas[i]);
                let dUTM = proj4(this.sourceProject,this.destinatePorject,[d.longitude,d.latitude]);
                // console.log(dUTM);
                // this.addModel(d.objId,"./static/map3d/map_photo/car.3DS",dUTM[0],dUTM[1],this.defualtZ);
                // if(d.type == 3 || d.type == 6 || d.type ==8)
                // {
                    if(d.type!=1&&d.type!=2&&d.type!=4)
                    {
                        if(i<this.deviceModels[deviceid].persons.length)
                        {
                            let mdl = this.deviceModels[deviceid].persons[i];
                            mdl.position.x = dUTM[0];
                            mdl.position.y = dUTM[1];
                            mdl.position.z = this.defualtZ+4;
                        }
                    }else{
                        if(i<this.deviceModels[deviceid].cars.length)
                        {
                            let mdl = this.deviceModels[deviceid].cars[i];
                            mdl.position.x = dUTM[0];
                            mdl.position.y = dUTM[1];
                            mdl.position.z = this.defualtZ+4;
                        }
                    }


                // }

            }
            // if(rsuDatas.length>0){
            //     console.log("感知到"+rsuDatas.length+"个物体");
            //     let d = rsuDatas[0];
            //     // console.log(rsuDatas[i]);
            //     let dUTM = proj4(this.sourceProject,this.destinatePorject,[d.longitude,d.latitude]);
            //     this.addModel(d.objId,"./static/map3d/map_photo/car.3DS",dUTM[0],dUTM[1],this.defualtZ+10);
            //     console.log(dUTM);
            // }


        },
        onClose:function(data){
            console.log("结束连接");
        },
        onOpen:function(){
            console.log("建立连接");
            // 2046A1035893
            var hostVehicle = '{"action":"rcu","data":{"rcuId":"2046A1037E1F"},"token":"fpx"}';
            // var hostVehicleMsg = JSON.stringify(hostVehicle);
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
