<template>
    <div class="home">
        <div class="compontent">
            <h2>ZooKeeper:</h2>
            <el-table
                    v-loading="loading"
                    :data="podList"
                    style="width: 100%">
                <el-table-column
                        prop="metadata.name"
                        label="Pod" width="200">
                </el-table-column>
                <el-table-column
                        label="Ready" width="100">
                    <template slot-scope="scope">
                        <span>{{ sumRunning(scope.row.status.containerStatuses) }}</span>
                        /
                        <span>{{ scope.row.status.containerStatuses.length }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status.phase"
                        label="状态" width="180">
                </el-table-column>
                <el-table-column
                        prop="status.containerStatuses[0].restartCount"
                        label="重启次数" width="100">
                </el-table-column>
<!--                <el-table-column v-if="scope.row.status.containerStatuses"-->
<!--                        prop="status.containerStatuses[0].restartCount"-->
<!--                        label="启动时间" width="100">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{ getDateTimeDiff(Date.parse(scope.row.status.containerStatuses[0].state.running.startedAt), new Date().getTime()).PubTime }}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column
                        prop="status.podIP"
                        label="Pod IP" width="120">
                </el-table-column>
                <el-table-column
                        prop="status.hostIP"
                        label="Host IP" width="120">
                </el-table-column>
                <el-table-column
                        prop="spec.nodeName"
                        label="Host Name" width="160">
                </el-table-column>
                <el-table-column
                        prop="spec.subdomain"
                        label="Sub Domain">
                </el-table-column>
            </el-table>
        </div>
        <div class="compontent">
            <h2>Kafka:</h2>
            <el-table
                    v-loading="kafkaLoading"
                    :data="kafkaPodList"
                    style="width: 100%">
                <el-table-column
                        prop="metadata.name"
                        label="Pod" width="200">
                </el-table-column>
                <el-table-column
                        label="Ready" width="100">
                    <template slot-scope="scope">
                        <span>{{ sumRunning(scope.row.status.containerStatuses) }}</span>
                        /
                        <span>{{ scope.row.status.containerStatuses.length }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="status.phase"
                        label="状态" width="180">
                </el-table-column>
                <el-table-column
                        prop="status.containerStatuses[0].restartCount"
                        label="重启次数" width="100">
                </el-table-column>
                <!--                <el-table-column v-if="scope.row.status.containerStatuses"-->
                <!--                        prop="status.containerStatuses[0].restartCount"-->
                <!--                        label="启动时间" width="100">-->
                <!--                    <template slot-scope="scope">-->
                <!--                        <span>{{ getDateTimeDiff(Date.parse(scope.row.status.containerStatuses[0].state.running.startedAt), new Date().getTime()).PubTime }}</span>-->
                <!--                    </template>-->
                <!--                </el-table-column>-->
                <el-table-column
                        prop="status.podIP"
                        label="Pod IP" width="120">
                </el-table-column>
                <el-table-column
                        prop="status.hostIP"
                        label="Host IP" width="120">
                </el-table-column>
                <el-table-column
                        prop="spec.nodeName"
                        label="Host Name" width="160">
                </el-table-column>
                <el-table-column
                        prop="spec.subdomain"
                        label="Sub Domain">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import ZooKeeperStatusApi from "../api/zookeeper/status_api";
    import kafkaStatusApi from "../api/kafka/kafka_status_api";

    export default {
        name: "Home",

        data () {
            return {
                podList: [],
                kafkaPodList: [],
                loading: true,
                kafkaLoading: true
            }
        },

        async mounted() {
           this.findZooKeeperStatus();
           this.findKafkaStatus();
        },

        methods: {
            sumRunning(containerStatuses) {
                let count = 0;
                for (let index in containerStatuses) {
                    if (containerStatuses[index].ready) {
                        count++
                    }
                }
                return count
            },

            async findZooKeeperStatus() {
                let that = this;
                let reader = await ZooKeeperStatusApi.findStatus();
                reader.read().then(function processText({ done, value }) {
                    if (done) {
                        console.log("Stream complete");
                        return;
                    }

                    let string = new TextDecoder("utf-8").decode(value);
                    let list = JSON.parse(string)["items"];
                    list.sort(function(a, b) {
                        return a.metadata.name.localeCompare(b.metadata.name);
                    });
                    that.podList = list;
                    that.loading = false;
                    console.log(that.podList);
                    return reader.read().then(processText);
                });
            },

            async findKafkaStatus() {
                let that = this;
                let reader = await kafkaStatusApi.findStatus();
                reader.read().then(function processText({ done, value }) {
                    if (done) {
                        console.log("Stream complete");
                        return;
                    }

                    let string = new TextDecoder("utf-8").decode(value);
                    let list = JSON.parse(string)["items"];
                    list.sort(function(a, b) {
                        return a.metadata.name.localeCompare(b.metadata.name);
                    });
                    that.kafkaPodList = list;
                    that.kafkaLoading = false;
                    console.log(that.podList);
                    return reader.read().then(processText);
                });
            }

            // getDateTimeDiff (startTime, endTime) {
            //     let retValue = {};
            //
            //     let date3 = endTime - startTime;  //时间差的毫秒数
            //
            //     //计算出相差天数
            //     let days = Math.floor(date3 / (24 * 3600 * 1000));
            //     retValue.Days = days;
            //
            //     let years = Math.floor(days / 365);
            //     retValue.Years = years;
            //
            //     let months = Math.floor(days / 30);
            //     retValue.Months = months;
            //
            //     //计算出小时数
            //     let leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            //     let hours = Math.floor(leave1 / (3600 * 1000));
            //     retValue.Hours = hours;
            //
            //     //计算相差分钟数
            //     let leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
            //     let minutes = Math.floor(leave2 / (60 * 1000));
            //     retValue.Minutes = minutes;
            //
            //     //计算相差秒数
            //     let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            //     let seconds = Math.round(leave3 / 1000);
            //     retValue.Seconds = seconds;
            //
            //     let strTime = "";
            //     if (years >= 1) {
            //         strTime = years + "年前";
            //     } else if (months >= 1) {
            //         strTime = months + "个月前";
            //     } else if (days >= 1) {
            //         strTime = days + "天前";
            //     } else if (hours >= 1) {
            //         strTime = hours + "小时前";
            //     } else {
            //         strTime = minutes + "分钟前";
            //     }
            //     retValue.PubTime = strTime;     //帖子,文章,博客发表时间的一种简短表示方法
            //     return retValue;
            // }
        }
    }
</script>

<style scoped>
    .home {

    }

    .compontent {
        padding: 32px;
    }
</style>
