import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        goods: [],
        currentUser:null,
        shopcartlist:[],
        orderList:[],
        registerDialog:false,
        address:null,
        phone:null
    },
})
export default store;
