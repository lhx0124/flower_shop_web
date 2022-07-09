<template>
    <el-container>
        <el-header style="text-align:center;border-bottom: 1px solid #ecf5ff">
            <el-tag style="margin-top:20px" type="danger">我的购物车</el-tag>
        </el-header>

        <el-container>
            <div style="overflow:auto;height: 560px;">
                <el-main>
                    <div v-for="(item) in this.$store.state.shopcartlist" :key="item.id" class="goods">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <el-button style="float: left;" size="mini">商品信息</el-button>
                                <el-button style="float: right;margin-right: 10px;" size="mini" type="danger"
                                    @click="remove(item.id)">移出购物车
                                </el-button>
                            </div>
                            <div class="demo-image" style="float:left">
                                <div class="block">
                                    <el-image style="width: 100px; height: 100px" :src="`${baseurl}${item.image}`"
                                        fit="contain"></el-image>
                                </div>
                            </div>
                            <div class="intro">
                                <span class="name">{{ item.goodsname }}</span>
                                <h1 class="count">{{ item.introduce }}</h1>
                                <h1 class="price">单价:<span style="color: rgb(178, 58, 58)">{{ item.price }}</span></h1>
                                <el-divider></el-divider>
                                <input type="checkbox" v-model="item.state" @change="itemChange()" />
                                <el-button class="btn" size="mini" type="" @click="pay()">立即支付</el-button>
                            </div>
                        </el-card>
                    </div>
                </el-main>
            </div>
        </el-container>

        <el-footer style="border-top: 1px solid #ecf5ff">
            <input style="margin-top:20px" type="checkbox" @change="change()" v-model="allCheck" />
            <el-button type="warning" style="float:right;margin-top:10px;margin-right:30px" round @click="payall()">结算
            </el-button>
            <span class="sum">合计:<span class="money">{{ pricetotale }}</span></span>
        </el-footer>

        <el-dialog title="扫描下方二维码以完成支付（微信/支付宝/云闪付）" :visible.sync="dialogVisible" width="30%"
            :before-close="handleClose">
            <div class="qrcode">
                <img src="../../assets/logo.png" alt="">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" round>取消</el-button>
                <el-button type="primary" @click="paysuccess(item)" round>支付成功</el-button>
            </span>
        </el-dialog>
    </el-container>


</template>

<script>
import request from '@/api/request';
export default {
    name: "MyShopCart",
    data() {
        return {
            dialogVisible: false,
            baseurl: "http://localhost:8082/upload/image/",
            allCheck: false,
        };
    },
    methods: {
        //全选
        change() {
            var vm = this;
            vm.$store.state.shopcartlist.forEach(function (v, o) {
                v.state = vm.allCheck
            })
        },

        //单选勾住后全选
        itemChange() {
            var vm = this;
            var select = vm.$store.state.shopcartlist.filter(function (v, o) {
                return v.state == true
            })
            select.length == vm.$store.state.shopcartlist.length ? vm.allCheck = true : vm.allCheck = false
        },

        // 支付
        pay(list) {  
            if(list.length != 0){
                for(let i = 0;i<list.length;i++){
                    this.paysuccess(list[i])
                }
                this.$notify({
                    title:"结算",
                    message:"结算成功！",
                    type:'success'
                })
            }else{
                this.dialogVisible = true
            }
        },

        
        // 关闭对话框的回调
        handleClose(done) {
            this.$confirm('确认取消支付？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },

        // 结算
        payall() {
            var vm = this;
            var goodslist = []
            var select = vm.$store.state.shopcartlist.filter(function (v, o) {
                if(v.state == true){
                    goodslist.push(v)
                }
                return v.state == true
            })

            if(select.length == 0){
                this.$notify({
                    title:"出错了！",
                    message:"您尚未选择任何的商品！",
                    type:"warning"
                })
            }else{
                this.pay(goodslist)
            }
        },

        // 支付成功，加入订单列表
        async paysuccess(item) {
            var res = await request.get("/api/user/getUserInfo", { params: { username: this.$store.state.currentUser } })

            this.$store.state.address = res.data[0].address
            this.$store.state.phone = res.data[0].phone
            var Form = {
                "address": this.$store.state.address,
                "buy": this.$store.state.currentUser,
                "phone": this.$store.state.phone,
                "goodsname": item.goodsname,
                "image": item.image
            }
            request.post("/api/user/addToOrder", Form).then(res => {
                if (res.code == '0') {
                    this.$notify({
                        title: "支付成功！",
                        message: "平台将马上为您送货！",
                        type: "success"
                    })
                } else {
                    this.$notify({
                        title: "支付失败！",
                        message: "请重试！",
                        type: "success"
                    })
                }
            })
            this.dialogVisible = false
        },

        // 移出购物车
        remove(id) {
            request.delete("/api/user/deleteMyShopCart/" + id).then(res => {
                if (res.code == '0') {
                    this.$notify({
                        title: "移出成功",
                        message: "已成功将商品从购物车里移出！",
                        type: "success"
                    })
                    this.searchMyShopCart()
                } else (
                    this.$notify({
                        title: "移出失败",
                        message: "将商品从购物车里移出失败！",
                        type: "error"
                    })
                )
            })

        },
        
        // 搜索购物车列表
        searchMyShopCart() {
            request.get("/api/user/myShopCart", {
                params: {
                    username: window.sessionStorage.getItem('username')
                }
            }).then(res => {
                if (res.code == 0) {
                    this.$store.state.shopcartlist = res.data
                    this.$store.state.shopcartlist.forEach(
                        (item, index) => {
                            // 添加isActive
                            item["state"] = false
                        })
                    console.log(this.$store.state.shopcartlist)
                }
            })
        }

    },
    mounted() {
        this.searchMyShopCart()
    },

    // 计算价格
    computed: {
        //计算总价
        pricetotale() {
            var total = 0;
            for (var i = 0; i < this.$store.state.shopcartlist; i++) {
                var item = this.$store.state.shopcartlist[i];
                if (item.state == true) {
                    total += parseInt(item.price)
                }
            }
            //千位分隔符正则
            return total
        }

    }
}
</script>

<style scoped>
.qrcode {
    margin-left: 50px;
}

.money {
    color: rgb(178, 58, 58);
    font-size: 20px;
}

.sum {
    float: right;
    margin-right: 20px;
    margin-top: 22px;
}

.name {
    line-height: 20px;
}

.count {
    line-height: 20px;
    font-size: 10px;
    color: gray;
}

.price {
    line-height: 20px;
    font-size: 10px;
    color: gray;
}

.intro {
    width: 900px;
    height: 100px;
    margin-top: 20px;
    float: right;

}

.btn {
    float: right;
    ;
}

.goods {
    margin-top: 10px;
    margin-bottom: 30px;
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
    width: 1160px;
    height: 270px;
}
</style>