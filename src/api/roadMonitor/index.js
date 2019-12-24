// import axios from 'axios';
import {HTTPURL, DLURL , OPERATEURL} from '../requestUrl';

/**
 * 汇总数据
 */
 export const totalData = params => {return axios.post(`${HTTPURL}rw/bs/totalData`, params).then(res => res.data); };


/**
 * 道路级别
 */
export const roadLevel = params => {return axios.post(`${HTTPURL}rw/bs/roadLevel`, params).then(res => res.data); };


/**
 * 道路分类
 */
export const roadCategory = params => {return axios.post(`${HTTPURL}rw/bs/roadCategory`, params).then(res => res.data); };


/**
 * 信号灯 路口
 */
export const rwDis = params => {return axios.post(`${HTTPURL}rw/bs/rwDis`, params).then(res => res.data); };


/**
 * 典型路口列表
 */
export const typeCross = params => {return axios.post(`${HTTPURL}rw/bs/typeCross`, params).then(res => res.data); };



/**
 * 获取所有路口列表
 */
export const allCross = params => {return axios.post(`${HTTPURL}rw/bs/allCross`, params).then(res => res.data); };

/**
 * 根据某一路口获取路口信息
 */
export const getCrossById = params => {return axios.post(`${HTTPURL}rw/bs/crossBD`, params).then(res => res.data); };


/**
 * 根据某一路口获取路口信息以及所在页数
 */
export const getCrossPageById = params => {return axios.post(`${HTTPURL}rw/bs/allCrossByCrossId`, params).then(res => res.data); };

/**
 * 根据航向角信息
 */
export const getFeaturesByPoint = (params,config) => {return axios.post(`${DLURL}analyze/getFeaturesByPoint.do`, params,config).then(res => res.data); };

/**
 * 智慧公交
 */
export const tpSignalLight = params => {return axios.post(`${OPERATEURL}tpSignalLight/remote/findList`, params).then(res => res.data); };