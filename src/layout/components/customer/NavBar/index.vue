<template>
    <div class="nav-bar-wrapper">
        <div class="nav-bar-left" @click="$router.back(-1)">
            <i v-show="$route.name!=='home'" class="el-icon-arrow-left"></i>
            <span v-show="$route.name!=='home'">返回</span>
        </div>
        <div class="nav-bar-title">{{ systemName }}</div>
        <el-dropdown class="nav-bar-right" trigger="click">
            <div class="avatar-wrapper">
                <i class="el-icon-more"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout">
                    <span>{{ $t('navbar.logOut') }}</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "NavBar",
    data() {
        return {};
    },
    computed: {
        ...mapState({
            systemName: state => state.settings.systemName
        })
    },
    methods: {
        async logout() {
            await this.$store.dispatch("user/loginOut");
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        }
    }
};
</script>
<style lang="scss" scoped>
.nav-bar-wrapper {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    .nav-bar-left,
    .nav-bar-right {
        display: flex;
        align-items: center;
        font-size: 18px;
        color: #333;
        cursor: pointer;
    }

    .nav-bar-left {
        width: 20%;
        padding-left: 10px;

        i {
            margin-right: 5px;
        }

    }

    .nav-bar-title {
        flex: 1;
        text-align: center;
        font-size: 18px;
        color: #333;
    }

    .nav-bar-right {
        width: 20%;
        justify-content: flex-end;
        padding-right: 10px;

        .avatar-wrapper {

            i {
                color: #333;
            }

        }
    }
}

// 适配小屏幕大小NavBar
@media only screen and (max-width: 345px) {
    .nav-bar-wrapper .nav-bar-left {
        padding-left: 0;
    }
    .nav-bar-wrapper .nav-bar-right {
        width: auto;
    }
}

// 适配小屏幕大小NavBar
@media only screen and (max-width: 300px) {
    .nav-bar-wrapper .nav-bar-left {
        font-size: 12px;
    }
    .nav-bar-wrapper .nav-bar-title {
        font-size: 14px;
    }
}

</style>
