import axios from 'axios'

const request = axios.create({
	// baseURL: '/api',  // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
    timeout: 5000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
  
 // config.headers['token'] = user.token;  // 设置请求头
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default request











































// /*axios全局响应拦截*/
// axios.interceptors.response.use(success => {
//     if (success.status && success.status == 200 && success.data.status == 500) {//请求成功，但处理出现其他错误
//         Message.error({ message: success.data.msg })
//         return;
//     }
//     //请求成功且服务器处理无错误
//     if (success.data.msg) {
//         Message.success({ message: success.data.msg });
//     }
//     return success.data;
// }, error => {
//     if (error.response.status == 504) {//	充当网关或代理的服务器，未及时从远端服务器获取请求
//         Message.error({ message: '找不到服务器' })
//     } else if (error.response.status == 403) {	//服务器理解请求客户端的请求，但是拒绝执行此请求
//         Message.error({ message: '权限不足，请联系管理员' })
//     } else if (error.response.status == 401) {//请求要求用户的身份认证
//         Message.error({ message: '尚未登录，请登录' });
//         router.replace("/");//跳转到登陆页
//     } else if (error.response.status == 404) {
//         Message.error({ message: '服务器无法根据客户端的请求找到资源' })
//     } else if (error.response.status == 500) {
//         Message.error({ message: '服务器内部错误，无法完成请求' })
//     } else {
//         if (error.response.data) {
//             Message.error({ message: error.response.data.msg })
//         }
//         else {
//             Message.error({ message: '未知错误!' })
//         }
//     }
//     return;
// })


// // 登录请求方法，与服务端Spring Security的登录接口对接
// export const postKeyValueRequest = (url, params) => {
//     return axios({
//         method: 'post',
//         url: `${base}${url}`,
//         data: params,
//         transformRequest: [
//             function (data) {  //处理请求的数据格式
//                 let ret = '';
//                 for (let i in data) {
//                     ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
//                 }
//                 return ret;
//             }
//         ],
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     });
// }

// //封装请求方法——post
// export const postRequest = (url, params) => {
//     return axios({
//         method: 'post',
//         url: `${base}${url}`,
//         data: params
//     });
// }


// // 封装请求方法——put
// export const putRequest = (url, params) => {
//     return axios({
//         method: 'put',
//         url: `${base}${url}`,
//         data: params
//     });
// }

// // 封装请求方法——get
// export const getRequest = (url, params) => {
//     return axios({
//         method: 'get',
//         url: `${base}${url}`,
//         data: params
//     });
// }

// // 封装请求方法——get
// export const deleteRequest = (url, params) => {
//     return axios({
//         method: 'delete',
//         url: `${base}${url}`,
//         data: params
//     });
// }
