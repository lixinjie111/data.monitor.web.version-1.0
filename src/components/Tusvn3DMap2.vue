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
            ,modelArr:[]
            ,cacheModelNum:30

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

            this.addShape("Crosswalk2","./static/map3d/kjy/UTM/crosswalk.shp","#999999")
            this.addShape("lane2","./static/map3d/kjy/UTM/lane.shp",dl.styles.lane_boundary.color)
            this.addShape("roadline2","./static/map3d/kjy/UTM/roadline.shp",dl.styles.lane_boundary.color)

            this.addShape("1","./static/map3d/kjy/UTM/1.shp",dl.styles.lane_boundary.color)
            this.addShape("2","./static/map3d/kjy/UTM/2.shp",dl.styles.lane_boundary.color)
            this.addShape("3","./static/map3d/kjy/UTM/3.shp",dl.styles.lane_boundary.color)
            this.addShape("4","./static/map3d/kjy/UTM/4.shp",dl.styles.lane_boundary.color)
            this.addShape("5","./static/map3d/kjy/UTM/5.shp",dl.styles.lane_boundary.color)
            this.addShape("6","./static/map3d/kjy/UTM/6.shp",dl.styles.lane_boundary.color)
            this.addShape("7","./static/map3d/kjy/UTM/7.shp",dl.styles.lane_boundary.color)
            this.addShape("8","./static/map3d/kjy/UTM/8.shp",dl.styles.lane_boundary.color)
            this.addShape("9","./static/map3d/kjy/UTM/9.shp",dl.styles.lane_boundary.color)
            this.addShape("10","./static/map3d/kjy/UTM/10.shp",dl.styles.lane_boundary.color)
            this.addShape("11","./static/map3d/kjy/UTM/11.shp",dl.styles.lane_boundary.color)
            this.addShape("12","./static/map3d/kjy/UTM/12.shp",dl.styles.lane_boundary.color)


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
                this.updateCameraPosition(442456.0905737311,4427223.965503679, 60.22107514430958, 2.4329173138415072,-0.6747685185185206,-0.7853942219746017);
                var matStdObjects = new THREE.MeshStandardMaterial( { color: 0xffff00, roughness: 0.5, metalness: 0 } );
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

                    //立方体
                    var geoBox = new THREE.BoxBufferGeometry( 1, 1, 1);
                    var model = new THREE.Mesh( geoBox, matStdObjects );
                    model.position.set( 0, 0, 0 );
                    model.rotation.set( 0, Math.PI / 2.0, 0 );
                    model.castShadow = true;
                    model.receiveShadow = true;

                    this.modelArr[m] = model;
                    dl.scene.add(model);
                }
                console.log(this.modelArr.length);
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
            console.log("=====================update====================================");
            console.log(e)
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
        onMessage:function(data){
            console.log(data);
            this.models={};

            for(let p=0;p<this.modelArr.length;p++)
            {
                let mdl = this.modelArr[p];
                mdl.position.x = 0;
                mdl.position.y = 0;
                mdl.position.z = 0;
            }
            // let models = dl.models;
            // if(models!=null)
            // {
            //     for(let n = 0;n<models.length;n++)
            //     {
            //         dl.removeModel(models[n]);
            //     }
            // }

            let rsuDatas = JSON.parse(data.data);
            for(let i = 0;i<rsuDatas.length;i++)
            {
                let d = rsuDatas[i];
                // // console.log(rsuDatas[i]);
                let dUTM = proj4(this.sourceProject,this.destinatePorject,[d.longitude,d.latitude]);
                // console.log(dUTM);
                // this.addModel(d.objId,"./static/map3d/map_photo/car.3DS",dUTM[0],dUTM[1],this.defualtZ);
                // if(d.type == 3 || d.type == 6 || d.type ==8)
                // {
                    if(i<this.modelArr.length)
                    {
                        let mdl = this.modelArr[i];
                        mdl.position.x = dUTM[0];
                        mdl.position.y = dUTM[1];
                        mdl.position.z = this.defualtZ+6;
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
