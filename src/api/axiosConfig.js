import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
// Element-ui
// import ElementUI from 'element-ui'

// axios.defaults.withCredentials = true;
Vue.prototype.$http = axios;

// 避免在账号登录失效后提示多次
let isOutLogin = true;
/**
 * axios过滤器
 */
function axiosFilter(vm) {
    // request
    axios.create({
      baseURL: window.config.url,
      // withCredentials: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      responseType: 'json',
      transformResponse: [function(data) { //后端发送过来的数据
        // return data;
        return Qs.stringify({
            ...data
        });
      }],
      transformRequest: [function(data) {
        return data;
      }]
    });

    // response
    axios.interceptors.response.use(function(response) {
        let returnStatus = response.data.status || response.data.code || response.data.state;
        switch (returnStatus+"") {
            case '1': {
                return Promise.resolve(response);
                break;
            }
            case '200': {
                return Promise.resolve(response);
                break;
            }
            default: {
                vm.$message({
                    type: 'error',
                    duration: '1500',
                    message: response.data.message || '操作失败' || response.data,
                    showClose: true
                });
                return Promise.reject(response);
            }
        }
    }, function(error) {
        vm.$message({
            type: 'error',
            duration: '1500',
            message: "接口调用失败!",
            showClose: true
        });
    });
}

export default axiosFilter
