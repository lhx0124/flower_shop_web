import Vue from 'vue'
import App from './App.vue'

//引入UI组件库
import ElementUI from 'element-ui'
//引入路由规则
import router from "./router"
//引入组件库的css文件
import 'element-ui/lib/theme-chalk/index.css'
//引入全局的图标库
import 'font-awesome/css/font-awesome.min.css'

import store from './store/index';

Vue.config.productionTip = false
Vue.use(ElementUI)


router.beforeEach((to, from, next) => {
    if (to.matched.some(m => m.meta.auth)) {
        if (window.sessionStorage.isLogin === '1') {
            next()
        } else if (to.path !== '/') {
            next({
                path: '/login'
            }
            )
            Vue.prototype.$message.warning('检测到您还未登录,请登录后操作！')
        }
    } else {
        next()
    }
})

new Vue({
    render: h => h(App),
    router,
    store,
}).$mount('#app')
