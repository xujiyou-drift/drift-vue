<template>
    <div id="app">
        <router-view id="view"/>
    </div>
</template>

<script>
    export default {
        name: 'App',

        mounted() {
            console.info("APP");
        }
    }
</script>

<style scoped>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }

    #view {
        width: 100%;
        height: 100%;
    }
</style>
