<template>
    <div>
        <data-select v-model="userId" data-select="sys-user" model=""></data-select>
    </div>
</template>

<script>
import DataSelect from "@/components/Select/DataSelect.vue";

export default {
    components: {DataSelect},
    data() {
        return {
            userId: -1,
        };
    },
    methods: {
        // 处理暂停按钮点击事件
        handleStop() {
            const videoElement = this.$refs.addVideoRef;
            if (videoElement.paused) {
                videoElement.play(); // 如果视频处于暂停状态，则播放视频
            } else {
                videoElement.pause(); // 如果视频正在播放，则暂停视频
            }
        },
    },
};
</script>
