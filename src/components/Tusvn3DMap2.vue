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
            ,viewVector1:{x:287406.0,y:3463772,z:50}
            ,viewVector2:{x:287707.0,y:3463835.0,z:80.0} 

            ,shps:{}
            ,models:{}            

            ,websocketUrl:"ws://10.0.1.57:9999/ws"
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
            ,destinatePorject:"+proj=utm +zone=51 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
        }
    },
    watch:{
    },
    methods: {
        initMap:function(){
            dl.init(this.mapoption);
            //添加数据
            this.addShape("intersection","./static/map3d/suzhou_CityRoad_utm51/Intersection.shp",dl.styles.intersection.color)
            this.addShape("Crosswalk","./static/map3d/suzhou_CityRoad_utm51/Crosswalk.shp",dl.styles.crosswalk.color)
            this.addShape("lane_marking","./static/map3d/suzhou_CityRoad_utm51/Lane_marking.shp",dl.styles.lane_marking.color)
            this.addShape("lane_arrow","./static/map3d/suzhou_CityRoad_utm51/Direction_arrow.shp",dl.styles.lane_arrow.color)
            this.addShape("lane_boundary","./static/map3d/suzhou_CityRoad_utm51/Lane_boundary.shp",dl.styles.lane_boundary.color)
            //初始化视锥体
            this.initView(this.viewVector1.x,this.viewVector1.y,this.viewVector1.z,this.viewVector2.x,this.viewVector2.y,this.viewVector2.z);

            //添加模型
            // this.addModel("car","./static/map3d/map_photo/car.3DS",0,0,12.816);

            //初始化websocket连接
            this.initWebsocket(this.websocketUrl);
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
            let json = JSON.parse(data.data);
            let data2 = json.result;
            console.log(data2);
            let vid = data2.vehicleId;

            let carModel = this.models[vid];
            if(carModel==null)
            {
                this.addModel(vid,"./static/map3d/map_photo/car.3DS",data2.longitude,data2.latitude,this.defualtZ)
            }
            
            let carData = this.carBusinessData[vid];
            let lastUtmPosition = null;
            if(carData!=null)
            {
                lastUtmPosition = this.carBusinessData[vid]['lastUtmPosition'];
            }else{
                carData = {};
                this.carBusinessData[vid]={};
            }

            if(this.carBusinessData[vid]['lastUtmPosition'] == null)
            {
                this.carBusinessData[vid]['utmposition'] = proj4(this.sourceProject,this.destinatePorject,[data2.longitude,data2.latitude]);
                this.models[vid].position.x = this.carBusinessData[vid]['utmposition'][0];
                this.models[vid].position.y = this.carBusinessData[vid]['utmposition'][1];
                this.carBusinessData[vid]['utmposition'][2] = data2.heading;
                this.carBusinessData[vid]['utmposition'][3] = data2.gpsTime;
                this.models[vid].setHeading(-Math.PI / 180 * (data2.heading));
                //vid与设定的主车vid相等则做相机跟随操作
                if(this.mainCarVID == vid)
                {
                    this.updateCameraPosition(this.carBusinessData[vid]['utmposition'][0]+6,this.carBusinessData[vid]['utmposition'][1], this.defualtZ,this.defualtRadius,this.defualtPitch,-Math.PI / 180 * (data2.heading));
                }

                this.carBusinessData[vid]['lastUtmPosition'] = {};
                this.carBusinessData[vid]['lastUtmPosition'].x=this.carBusinessData[vid]['utmposition'][0];
                this.carBusinessData[vid]['lastUtmPosition'].y=this.carBusinessData[vid]['utmposition'][1];
                this.carBusinessData[vid]['lastUtmPosition'].rotation=this.carBusinessData[vid]['utmposition'][2];
                this.carBusinessData[vid]['lastUtmPosition'].gpstime=this.carBusinessData[vid]['utmposition'][3];

                // console.log(this.carBusinessData[vid]['lastUtmPosition']);

            }else{
                console.log(this.carBusinessData[vid]['lastUtmPosition']);
                this.carBusinessData[vid]['nowPosition'] = proj4(this.sourceProject,this.destinatePorject,[data2.longitude,data2.latitude]);
                this.carBusinessData[vid]['nowPosition'][2] = data2.heading;
                this.carBusinessData[vid]['nowPosition'][3] = data2.gpsTime;
                if(this.tweens[vid]==null)
                {
                    this.tweens[vid] = new TWEEN.Tween(this.carBusinessData[vid]['lastUtmPosition'])
                    .to({x: this.carBusinessData[vid]['nowPosition'][0], y: this.carBusinessData[vid]['nowPosition'][1], rotation: this.carBusinessData[vid]['nowPosition'][2],gpstime:this.carBusinessData[vid]['nowPosition'][3]}, this.carBusinessData[vid]['nowPosition'][3]-this.carBusinessData[vid]['lastUtmPosition'].gpstime)
                    .delay(0)
                    // .easing(TWEEN.Easing.Elastic.In)
                    .easing(TWEEN.Easing.Linear.None)
                    .onUpdate(
                        (d)=>{
                            // console.log("onUpdate");
                            // console.log(d);
                            this.models[vid].position.x = this.carBusinessData[vid]['lastUtmPosition'].x;
                            this.models[vid].position.y = this.carBusinessData[vid]['lastUtmPosition'].y;
                            this.models[vid].setHeading(-Math.PI / 180 * (this.carBusinessData[vid]['lastUtmPosition'].rotation));
                            if(this.mainCarVID==vid)
                            {
                                dl.moveTo({
                                    position: [this.carBusinessData[vid]['lastUtmPosition'].x+6,this.carBusinessData[vid]['lastUtmPosition'].y, this.defualtZ],
                                    radius: this.defualtRadius,
                                    yaw: -Math.PI / 180 * (this.carBusinessData[vid]['lastUtmPosition'].rotation),
                                    pitch: this.defualtPitch

                                });
                            }
                        }
                    );
                    
                }else{
                        this.tweens[vid].stop();
                        this.tweens[vid]=
                            new TWEEN.Tween(this.carBusinessData[vid]['lastUtmPosition'])
                                .to({x: this.carBusinessData[vid]['nowPosition'][0], y: this.carBusinessData[vid]['nowPosition'][1], rotation: this.carBusinessData[vid]['nowPosition'][2],gpstime:this.carBusinessData[vid]['nowPosition'][3]}, this.carBusinessData[vid]['nowPosition'][3]-this.carBusinessData[vid]['lastUtmPosition'].gpstime)
                                .delay(0)
                                // .easing(TWEEN.Easing.Elastic.In)
                                .easing(TWEEN.Easing.Linear.None)
                                .onUpdate(
                                    (d)=>{
                                        // console.log("onUpdate");
                                        // console.log(d);
                                        this.models[vid].position.x = this.carBusinessData[vid]['lastUtmPosition'].x;
                                        this.models[vid].position.y = this.carBusinessData[vid]['lastUtmPosition'].y;
                                        this.models[vid].setHeading(-Math.PI / 180 * (this.carBusinessData[vid]['lastUtmPosition'].rotation));
                                        if(this.mainCarVID==vid)
                                        {
                                            dl.moveTo({
                                                position: [this.carBusinessData[vid]['lastUtmPosition'].x+6,this.carBusinessData[vid]['lastUtmPosition'].y, this.defualtZ],
                                                radius: this.defualtRadius,
                                                yaw: -Math.PI / 180 * (this.carBusinessData[vid]['lastUtmPosition'].rotation),
                                                pitch: this.defualtPitch

                                            });
                                        }
                                    }
                                )
                        ;
                    
                }
                this.tweens[vid].start();
                
                if(this.carBusinessData[vid]['nowUtmPosition'] == null)
                {
                    this.carBusinessData[vid]['nowUtmPosition'] = {};
                }

                this.carBusinessData[vid]['nowUtmPosition'].x = this.carBusinessData[vid]['nowPosition'][0];
                this.carBusinessData[vid]['nowUtmPosition'].y = this.carBusinessData[vid]['nowPosition'][1];
                this.carBusinessData[vid]['nowUtmPosition'].rotation = this.carBusinessData[vid]['nowPosition'][2];
                this.carBusinessData[vid]['nowUtmPosition'].gpstime = this.carBusinessData[vid]['nowPosition'][3];
                this.carBusinessData[vid]['lastUtmPosition'] = this.carBusinessData[vid]['nowUtmPosition'];
                this.carBusinessData[vid]['utmposition'] = this.carBusinessData[vid]['nowPosition'];
            }
            
            
        },
        onClose:function(data){
            console.log("结束连接");
        },
        onOpen:function(){
            console.log("建立连接");
            var hostVehicle = {
                "action": this.action,
                "vehicleId": this.vehicleIds
            }
            var hostVehicleMsg = JSON.stringify(hostVehicle);
            this.sendMsg(hostVehicleMsg);
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
