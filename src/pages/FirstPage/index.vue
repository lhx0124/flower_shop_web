<template>
    <div class="first">
        <Home></Home>
    </div>
</template>

<script>
    import Home from "../../components/Home"
    export default {
        name:"FirstPage",
        components:{
            Home
        }

    }
</script>

<style scoped>
.first{
    margin: 20px auto;
    width: 1220px;
    height: 680px;
    border-radius: 15px;
    border: 1px solid #eaeaea;
    box-shadow: 10px 10px 35px #cac6c6;
    overflow: auto;
}
</style>