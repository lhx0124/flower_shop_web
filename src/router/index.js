import Vue from "vue";
import  VueRouter from "vue-router";

// 引入组件
import UserLogin from "../pages/UserLogin"
import AdminLogin from "../pages/AdminLogin"
import FirstPage from "../pages/FirstPage"
import OrderPage from "../pages/OrderPage"
import ShopcartPage from "../pages/ShopcartPage"
import AdminPage from "../pages/AdminPage"
import UserList from "../pages/UserList"
import OrderList from "../pages/OrderList"
import GoodsList from "../pages/GoodsList"

Vue.use(VueRouter)

const routes = [
    {
        path:"/",
        component:FirstPage,
        
    },
    {
        path:"/userlogin",
        component:UserLogin
    },
    {
        path:"/adminlogin",
        component:AdminLogin
    },
    {
        path:"/myorder",
        component:OrderPage,
    },
    {
        path:"/myshopcart",
        component:ShopcartPage,
    },
    {
        path:"/admin",
        component:AdminPage,
        redirect:"/admin/userlist",
        children:[
            {
                path:"/admin/userlist",
                component:UserList
            },
            {
                path:"/admin/orderlist",
                component:OrderList
            },
            {
                path:"/admin/goodslist",
                component:GoodsList
            }

        ]
        
    }
]

const router = new VueRouter({
    routes
})


export default router

