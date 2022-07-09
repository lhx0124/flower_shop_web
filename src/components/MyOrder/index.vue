<template>
    <el-container>
        <el-header style="text-align:center;border-bottom: 1px solid #ecf5ff;">
            <el-tag style="margin-top:15px">我的订单</el-tag>
        </el-header>

        <el-container>
            <div style="overflow:auto;height: 600px;">
                <el-main>
                    <div v-for="item in this.$store.state.orderList" :key="item.id" class="goods">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <el-button style="float: left;" size="mini">商品信息</el-button>
                                <el-button style="float: right;margin-right: 10px;" size="mini" type="success" plain>已支付</el-button>
                            </div>
                            <div class="demo-image" style="float:left">
                                <div class="block">
                                    <el-image style="width: 100px; height: 100px" :src="getImage(item.image)"
                                        fit="contain"></el-image>
                                </div>
                            </div>
                            <div class="intro">
                                <span class="name">{{item.goodsname}}</span>
                                <h1 class="price">收货地址:{{item.address}}</h1>
                                <h1 class="count">配送电话：{{item.phone}}</h1>
                                <el-divider></el-divider>
                                <el-button class="btn" size="mini" @click="showTheWu()" type="primary" plain>查看物流</el-button>
                                <el-button class="btn" size="mini" plain type="warning" @click="removeorder(item)">取消订单</el-button>
                            </div>
                        </el-card>
                    </div>
                </el-main>
            </div>
        </el-container>
    </el-container>
</template>


<script scoped>
import request from '@/api/request'
export default {
    name: "MyOrder",
    date(){
        return{
            baseurl: "http://localhost:8082/upload/image/",
        }
    },
    methods:{
        searchMyorder(){
            request.get("/api/user/myOrder",{
                params:{
                    username:window.sessionStorage.getItem("username")
                }
            }).then(res=>{
                if(res.code == '0'){
                    this.$store.state.orderList = res.data
                    console.log(res)
                }
            })
        },
        showTheWu(){
            this.$notify({
                title:"物流信息",
                message:"您的商品正在配送中！",
                type:"success"
            })
        },
        getImage(val) {
            const url = "http://localhost:8082/upload/image/" + val
            return url
        },
        removeorder(item){
            request.delete("/api/admin/deleteOrder/"+item.id).then(res=>{
                if(res.code == "0"){
                    this.$notify({
                        title:"取消订单成功！",
                        message:"您的订单已取消！资金将原路退回！",
                        type:'success'
                    })
                }
                else{
                    this.$notify({
                        title:"取消订单失败！",
                        message:"出错了，请重试！",
                        type:'error'
                    })
                }
            })
        }
    },
    mounted(){
        this.searchMyorder()
    }
    

}
</script>

<style scoped>
.name {
    line-height: 20px;
}

.count {
    line-height: 20px;
    font-size: 10px;
}

.price {
    line-height: 20px;
    font-size: 10px;
}

.intro {
    width: 180px;
    height: 100px;
    margin-top: 20px;
    float: right;

}

.goods {
    margin-right: 30px;
    margin-top: 15px;
    float: left;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 350px;
    height: 270px;
}
</style>