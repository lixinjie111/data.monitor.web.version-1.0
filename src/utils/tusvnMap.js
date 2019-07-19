export function getMap(map){
  map.addShape("intersection","./static/map3d/dl_shcsq_zc/Intersection.shp","#ff974f")
  map.addShape("Crosswalk","./static/map3d/dl_shcsq_zc/Crosswalk.shp","#00d49d")
  map.addShape("lane_marking","./static/map3d/dl_shcsq_zc/Lane_marking.shp",dl.styles.lane_marking.color)
  map.addShape("lane_arrow","./static/map3d/dl_shcsq_zc/Direction_arrow.shp","#06c2ff")
  map.addShape("lane_boundary","./static/map3d/dl_shcsq_zc/Lane_boundary.shp","#6fb07d")
  map.addShape("lane_centerline","./static/map3d/dl_shcsq_zc/Lane_centerline.shp","#153641")

  //添加路灯
  map.addModel('street_lamp_two_0','./static/map3d/models/street_lamp_two.3ds',325605.9620401191,3462422.087016858,12.68);
  map.addModel('street_lamp_two_1','./static/map3d/models/street_lamp_two.3ds',325644.5698510726,3462439.737268414,12.68);
  map.addModel('street_lamp_two_2','./static/map3d/models/street_lamp_two.3ds',325678.213173572,3462456.845491925,12.68);
  map.addModel('street_lamp_two_3','./static/map3d/models/street_lamp_two.3ds',325714.8015379905,3462475.9571395535,12.68);
  map.addModel('street_lamp_two_4','./static/map3d/models/street_lamp_two.3ds',325751.7192636788,3462494.9147299756,12.68);
  map.addModel('street_lamp_two_5','./static/map3d/models/street_lamp_two.3ds',325791.2291744284,3462513.0858777757,12.68);
  map.addModel('street_lamp_two_6','./static/map3d/models/street_lamp_two.3ds',325839.45728057146,3462528.673690394,12.68);
  map.addModel('street_lamp_two_7','./static/map3d/models/street_lamp_two.3ds',325871.50033267133,3462535.577747621,12.68);
  map.addModel('street_lamp_two_8','./static/map3d/models/street_lamp_two.3ds',325927.26942355325,3462540.7501094346,12.68);
  map.addModel('street_lamp_two_9','./static/map3d/models/street_lamp_two.3ds',325971.1791292096,3462539.308385897,12.68);
  map.addModel('street_lamp_two_10','./static/map3d/models/street_lamp_two.3ds',326011.51930734934,3462530.549954456,12.68);
  map.addModel('street_lamp_two_11','./static/map3d/models/street_lamp_two.3ds',326060.29745298775,3462517.6961886724,12.68);
  map.addModel('street_lamp_two_12','./static/map3d/models/street_lamp_two.3ds',326110.0640013865,3462499.7403886765,12.68);
  map.addModel('street_lamp_two_13','./static/map3d/models/street_lamp_two.3ds',326146.8028378673,3462478.6396884797,12.68);
  map.addModel('street_lamp_two_14','./static/map3d/models/street_lamp_two.3ds',326184.09992171597,3462451.135337721,12.68);
  map.addModel('street_lamp_two_15','./static/map3d/models/street_lamp_two.3ds',326213.6642104323,3462424.026798547,12.68);
  map.addModel('street_lamp_two_16','./static/map3d/models/street_lamp_two.3ds',326239.9417744168,3462394.325700396,12.68);
  map.addModel('street_lamp_two_17','./static/map3d/models/street_lamp_two.3ds',326261.54341858963,3462364.523596104,12.68);
  map.addModel('street_lamp_two_18','./static/map3d/models/street_lamp_two.3ds',326283.7656650753,3462325.9076287984,12.68);
  map.addModel('street_lamp_two_19','./static/map3d/models/street_lamp_two.3ds',326293.7409365265,3462305.101613318,12.68);
  map.addModel('street_lamp_two_20','./static/map3d/models/street_lamp_two.3ds',326317.89209304436,3462233.2914442807,12.68);
  map.addModel('street_lamp_two_21','./static/map3d/models/street_lamp_two.3ds',326338.3463113972,3462166.509419441,12.68);
  map.addModel('street_lamp_two_22','./static/map3d/models/street_lamp_two.3ds',326360.74210184,3462124.440723257,12.68);
  map.addModel('street_lamp_two_23','./static/map3d/models/street_lamp_two.3ds',326381.50148141605,3462094.623117925,12.68);
  map.addModel('street_lamp_two_24','./static/map3d/models/street_lamp_two.3ds',326404.88685793115,3462064.49447238,12.68)



  map.addModel('street_lamp_two_opposite_0','./static/map3d/models/street_lamp_two.3ds',326539.9124336911,3461961.7054950483,12.68);
  map.addModel('street_lamp_two_opposite_1','./static/map3d/models/street_lamp_two.3ds',326513.87203228497,3461985.7805497725,12.68);
  map.addModel('street_lamp_two_opposite_2','./static/map3d/models/street_lamp_two.3ds',326481.66853339976,3462015.608493991,12.68);
  map.addModel('street_lamp_two_opposite_3','./static/map3d/models/street_lamp_two.3ds',326437.26901612466,3462057.088796324,12.68);
  map.addModel('street_lamp_two_opposite_4','./static/map3d/models/street_lamp_two.3ds',326407.9536514446,3462091.627984262,12.68);
  map.addModel('street_lamp_two_opposite_5','./static/map3d/models/street_lamp_two.3ds',326376.1808195288,3462139.740524388,12.68);
  map.addModel('street_lamp_two_opposite_6','./static/map3d/models/street_lamp_two.3ds',326350.5054369998,3462201.284972825,12.68);
  map.addModel('street_lamp_two_opposite_7','./static/map3d/models/street_lamp_two.3ds',326336.9131020676,3462244.3383032307,12.68);
  map.addModel('street_lamp_two_opposite_8','./static/map3d/models/street_lamp_two.3ds',326348.00984258053,3462274.3429545504,12.68);
  map.addModel('street_lamp_two_opposite_9','./static/map3d/models/street_lamp_two.3ds',326342.11978901166,3462296.5981887174,12.68);
  map.addModel('street_lamp_two_opposite_10','./static/map3d/models/street_lamp_two.3ds',326312.36564479594,3462319.9917033706,12.68);
  map.addModel('street_lamp_two_opposite_11','./static/map3d/models/street_lamp_two.3ds',326293.32005615474,3462357.6330448994,12.68);
  map.addModel('street_lamp_two_opposite_12','./static/map3d/models/street_lamp_two.3ds',326269.8965779829,3462393.1162129235,12.68);
  // this.addModel('street_lamp_two_opposite_13','./static/map3d/models/street_lamp_two.3ds',326269.5184563148,3462393.419889987,12.68);
  map.addModel('street_lamp_two_opposite_14','./static/map3d/models/street_lamp_two.3ds',326254.2686340613,3462413.4506998067,12.68);
  map.addModel('street_lamp_two_opposite_15','./static/map3d/models/street_lamp_two.3ds',326225.2493836086,3462442.6320404094,12.68);
  map.addModel('street_lamp_two_opposite_16','./static/map3d/models/street_lamp_two.3ds',326183.79399392195,3462476.6293645953,12.68);
  map.addModel('street_lamp_two_opposite_17','./static/map3d/models/street_lamp_two.3ds',326152.984818381,3462497.958909394,12.68);
  map.addModel('street_lamp_two_opposite_18','./static/map3d/models/street_lamp_two.3ds',326109.57493707456,3462521.876607037,12.68);
  map.addModel('street_lamp_two_opposite_19','./static/map3d/models/street_lamp_two.3ds',326064.91023163777,3462539.4207325154,12.68);
  map.addModel('street_lamp_two_opposite_20','./static/map3d/models/street_lamp_two.3ds',326018.01353881694,3462553.284279363,12.68);
  map.addModel('street_lamp_two_opposite_21','./static/map3d/models/street_lamp_two.3ds',325971.39649421745,3462560.897562495,12.68);
  map.addModel('street_lamp_two_opposite_22','./static/map3d/models/street_lamp_two.3ds',325938.60034148674,3462562.482200762,12.68);
  map.addModel('street_lamp_two_opposite_23','./static/map3d/models/street_lamp_two.3ds',325904.6023904722,3462584.014099191,12.68);
  map.addModel('street_lamp_two_opposite_24','./static/map3d/models/street_lamp_two.3ds',325881.56604034174,3462581.124477936,12.68);
  map.addModel('street_lamp_two_opposite_25','./static/map3d/models/street_lamp_two.3ds',325858.1721216263,3462556.677784916,12.68);
  map.addModel('street_lamp_two_opposite_26','./static/map3d/models/street_lamp_two.3ds',325821.3680088696,3462547.6220940743,12.68);
  map.addModel('street_lamp_two_opposite_27','./static/map3d/models/street_lamp_two.3ds',325782.45188748406,3462534.4376719757,12.68);
  map.addModel('street_lamp_two_opposite_28','./static/map3d/models/street_lamp_two.3ds',325748.2227811228,3462518.9449371654,12.68);
  map.addModel('street_lamp_two_opposite_29','./static/map3d/models/street_lamp_two.3ds',325723.55472146743,3462502.401337263,12.68);
  map.addModel('street_lamp_two_opposite_30','./static/map3d/models/street_lamp_two.3ds',325704.09742565616,3462492.017142771,12.68);


  //添加红绿灯
  map.addModel('traffic_light_0','./static/map3d/models/traffic_light.3ds',325921.545860186,3462541.0160225183,12.68);
  map.addModel('traffic_light_1','./static/map3d/models/traffic_light.3ds',325868.4327871947,3462561.2291684817,12.68);
  map.addModel('traffic_light_2','./static/map3d/models/traffic_light.3ds',325898.55675146834,3462539.0550170965,12.68);
  map.addModel('traffic_light_3','./static/map3d/models/traffic_light.3ds',326325.78270624415,3462247.0504668984,12.68);
  map.addModel('traffic_light_4','./static/map3d/models/traffic_light.3ds',326314.74230815104,3462313.111718161,12.68);
  map.addModel('traffic_light_5','./static/map3d/models/traffic_light.3ds',326343.54615430237,3462286.313593357,12.68);

  // //添加标识牌
  map.addModel('traffic_sign_stop_0','./static/map3d/models/traffic_sign_stop.3ds',325894.67930130404,3462580.1783312797,12.68);
  map.addModel('traffic_sign_stop_1','./static/map3d/models/traffic_sign_stop.3ds',326253.3704410266,3462374.6075555324,12.68);
  map.addModel('traffic_sign_stop_2','./static/map3d/models/traffic_sign_stop.3ds',326260.07575023104,3462409.3542993385,12.68);

  //矮路灯
  map.addModel("lamppost_01","./static/map3d/models/lamppost_01.3ds",442496.96,4427294.44,16);
  map.getModel("lamppost_01").setHeading(30);
  map.getModel("lamppost_01").setUpdate(true);



  //大路灯
  map.addModel("street_lamp_two","./static/map3d/models/street_lamp_two.3ds",442501.99,4427272.65,16);
  map.getModel("street_lamp_two").setHeading(30);
  map.getModel("street_lamp_two").setUpdate(true);

  //红绿灯
  map.addModel("traffic_light","./static/map3d/models/traffic_light.3ds",442533.95,4427306.77,16);
  map.getModel("traffic_light").setHeading(30);
  map.getModel("traffic_light").setUpdate(true);

  //标识牌
  map.addModel("traffic_sign_stop","./static/map3d/models/traffic_sign_stop.3ds",442529.62,4427323.70,16);
  map.getModel("traffic_sign_stop").setHeading(120);
  map.getModel("traffic_sign_stop").setUpdate(true);

  //女人
  map.addModel("Girl walking N090814","./static/map3d/models/Girl walking N090814.3DS",442529.62,4427325.70,16);
  map.getModel("Girl walking N090814").setHeading(120);
  map.getModel("Girl walking N090814").setUpdate(true);

  //男人
  map.addModel("Man N151016.3DS","./static/map3d/models/Man N151016.3DS",442531.62,4427325.70,16);
  map.getModel("Man N151016.3DS").setHeading(120);
  map.getModel("Man N151016.3DS").setUpdate(true);
}
