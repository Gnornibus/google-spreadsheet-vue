<template>
    <div style="text-align: center;color: black;">
        <span v-if="$store.state.app.device==='desktop'">
            &copy;2023 {{ systemName }}-版本:1.0.0 <br>
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">
                闽ICP备2024039492号-2
            </a>
            <br>
            <a href="https://gitee.com/su-binrong" style="font-size: 13px;" target="_blank">
                版权所有者：{{ author }}
            </a>
        </span>
        <span v-if="$store.state.app.device==='mobile'" style="font-size: 15px;">
            &copy;2023 {{ systemName }}-版本:1.0.0
            <br>
            <a href="https://beian.miit.gov.cn/#/Integrated/index" style="font-size: 13px;" target="_blank">
                闽ICP备2024039492号-2
            </a>
            <br>
            <a href="https://gitee.com/su-binrong" style="font-size: 10px;" target="_blank">
                版权所有者：{{ author }}
            </a>
        </span>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "SystemFooter",

    computed: {
        ...mapState({
            systemName: state => state.settings.systemName,
            author: state => state.settings.author,
        })
    }
}
</script>

<style scoped>

</style>
