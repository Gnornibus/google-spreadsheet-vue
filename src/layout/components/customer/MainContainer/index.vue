<template>
    <el-scrollbar class="scrollbar" ref="mainScrollbar">
        <transition :duration="{ enter: 200, leave: 200 }" name="el-fade-in-linear">
            <router-view />
        </transition>
        <el-footer>
            <system-footer />
        </el-footer>
    </el-scrollbar>
</template>

<script>
import SystemFooter from "@/layout/components/common/SystemFooter";

export default {
    name: "index",
    components: {SystemFooter},
}
</script>

<style lang="scss" scoped>
// 滚动条
.scrollbar {
    width: 100%;
    height: 100%;

    /* 隐藏滚动条 */
    ::-webkit-scrollbar {
        display: none;
    }
}
</style>
