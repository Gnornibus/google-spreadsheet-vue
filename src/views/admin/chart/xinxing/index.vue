<template>
    <div class="dashboard-editor-container">
        <div class=" clearfix">
            <div class="info-container">
                <span class="display_name">{{ name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import PanThumb from '@/components/PanThumb'

export default {
    name: 'DashboardEditor',
    components: {PanThumb},
    data() {
        return {
            emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
        }
    },
    computed: {
        ...mapGetters([
            'name',
            'avatar',
            'roleName'
        ])
    }
}
</script>

<style lang="scss" scoped>
.emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
}

.dashboard-editor-container {
    background-image: url('~@/assets/image/logo.png');
    background-size: 50vh 50vh; /* 设置背景图片大小为150x150 */
    background-repeat: no-repeat; /* 禁止背景图片重复 */
    background-position: center center; /* 图片居中显示 */
    height: 80vh;

    .pan-info-roles {
        font-size: 12px;
        font-weight: 700;
        color: #333;
        display: block;
    }

    .info-container {
        position: relative;
        margin-left: 50px;
        height: 150px;

        .display_name {
            font-size: 48px;
            line-height: 48px;
            color: #212121;
            position: absolute;
            top: 25px;
        }
    }
}
</style>
