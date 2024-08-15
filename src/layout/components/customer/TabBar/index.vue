<template>
    <el-row class="tab-bar-container">
        <el-col :span="6" class="tab-bar-item">
            <router-link :class="{ active: $route.name === 'home' }" class="tab-bar-item-link" to="/home">
                <el-row>
                    <svg-icon icon-class="component" class="tab-bar-item-icon" />
                </el-row>
                <el-row>
                    <span class="tab-bar-item-name">首页</span>
                </el-row>
            </router-link>
        </el-col>
        <el-col :span="6" class="tab-bar-item">
            <router-link :class="{ active: $route.name === 'course' }" class="tab-bar-item-link" to="/course">
                <el-row>
                    <svg-icon icon-class="svg-system-course" class="tab-bar-item-icon" />
                </el-row>
                <el-row>
                    <span class="tab-bar-item-name">课程</span>
                </el-row>
            </router-link>
        </el-col>
        <el-col :span="6" class="tab-bar-item">
            <router-link :class="{ active: $route.name === 'media' }" class="tab-bar-item-link" to="/media">
                <el-row>
                    <svg-icon icon-class="svg-media" class="tab-bar-item-icon" />
                </el-row>
                <el-row>
                    <span class="tab-bar-item-name">媒体</span>
                </el-row>
            </router-link>
        </el-col>
        <el-col :span="6" class="tab-bar-item">
            <router-link :class="{ active: $route.name === 'profile' }" class="tab-bar-item-link" to="/profile">
                <el-row>
                    <svg-icon icon-class="user" class="tab-bar-item-icon" />
                </el-row>
                <el-row>
                    <span class="tab-bar-item-name">我的</span>
                </el-row>
            </router-link>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "TabBar",
    data() {
        return {
            tabBar: [
                {
                    key: "home",
                    name: "首页",
                    icon: "",
                },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
.tab-bar-container {
    height: 50px !important;
    width: 100%;
    text-align: center;
    // 导航项
    .tab-bar-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #999999;
        font-size: 14px;
        // 链接
        .tab-bar-item-link {
            width: 100%;
            padding: 5px 0;
        }

        // 图标
        .tab-bar-item-icon {
            width: 28px;
            height: 28px;
        }

        .tab-bar-item-link.active {
            font-weight: bold;
            color: #55b4ff;
        }

    }
}
</style>
