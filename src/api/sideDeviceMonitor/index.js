import axios from 'axios';
import {HTTPURL} from '../requestUrl';


/*
 * 获取设备分布
 * I_VL1_01
 */
 export const getDevDis = params => {return axios.post(`${HTTPURL}lc/baseStat/getDevDis`, params).then(res => res.data); };

/*
* 获取设备数量
* I_VL1_01
*/
 export const getDevCount = params => {return axios.post(`${HTTPURL}lc/baseStat/getDevStat`, params).then(res => res.data); };

/*
* 获取设备状态
* I_VL1_01
*/
 export const getDevStatus = params => {return axios.post(`${HTTPURL}lc/platStat/getDevStatusStat`, params).then(res => res.data); };



/*
* 获取累计数据
* I_VL1_01
*/

export const getTotalData = params => {return axios.post(`${HTTPURL}lc/platStat/getDevDataStat`, params).then(res => res.data); };


/*
* 获取设备列表
* I_VL1_01
*/
export const getDeviceList = params => {return axios.post(`${HTTPURL}lc/baseStat/getDevLst`, params).then(res => res.data); };

/*
* 根据摄像头编号获取视频
* I_VL1_01
*/
export const getVideoByNum = params => {return axios.post(`${HTTPURL}lc/realData/getCamRealData`, params).then(res => res.data); };

/*
* 获取节点列表
* I_VL1_01
*/
export const getSideTree = params => {return axios.post(`${HTTPURL}lc/baseStat/getRoadSiderTree`, params).then(res => res.data); };

