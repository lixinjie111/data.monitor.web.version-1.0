import axios from 'axios';
import {HTTPURL} from '../requestUrl';


/*
 * 获取设备分布
 * I_VL1_01
 */
 export const getDevDis = params => {return axios.post(`${HTTPURL}lc/baseStat/getDevDis`, params).then(res => res.data); };







