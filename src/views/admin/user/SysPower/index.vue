<template>
    <el-container style="padding: 0;">
        <el-header>
            <!-- 步骤信息 -->
            <el-steps :active="active" simple>
                <el-step icon="el-icon-edit" title="选择修改对象"></el-step>
                <el-step icon="el-icon-s-custom" title="进行权限修改"></el-step>
                <el-step icon="el-icon-menu" title="修改后菜单预览"></el-step>
            </el-steps>
        </el-header>
        <el-main>
            <el-card :bordered="true" class="card">
                <!--第一步（选定角色信息）-->
                <div v-show="active===1" class="card_one">
                    <el-radio-group v-if="radioData.length>0" v-model="radio">
                        <el-radio v-for="(item,index) in radioData" :key="item.key" :label="item.key" border>
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                    <span v-else>您不可修改子角色信息</span>
                </div>
                <!--第二步（进行权限修改）-->
                <div v-show="active===2">
                    <h2>注意：部分按钮需要多个权限才可使用。</h2>
                    例如：编辑前需要先搜索对象后才可编辑，则需要编辑和搜索俩个权限
                    <el-row>
                        <el-col :span="24">
                            <el-input v-model="filterText" clearable placeholder="输入关键字进行过滤"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-tree
                                ref="tree"
                                :data="treeData"
                                :filterNodeMethod="filterNode"
                                :props="defaultProps"
                                accordion
                                auto-expand-parent
                                empty-text="暂无数据"
                                node-key="id"
                                show-checkbox
                                @check="onCheck"
                            ></el-tree>
                        </el-col>
                    </el-row>
                </div>
                <!--第三步（修改后菜单预览）-->
                <div v-show="active===3">
                    <el-menu
                        background-color="#304156"
                        class="el-menu-vertical-demo"
                        default-active="chart"
                        style="text-align: left;"
                        text-color="#fff"
                        unique-opened
                    >
                        <template v-for="menu in chooseMenu">
                            <el-submenu :key="menu.toUrl" :index="menu.toUrl">
                                <template slot="title">
                                    <item :icon="menu.icon" :title="menu.title" />
                                </template>
                                <template v-for="subMenu in menu.children">
                                    <el-submenu :key="subMenu.toUrl" :index="subMenu.toUrl">
                                        <template slot="title">
                                            <item :key="subMenu.toUrl" :icon="subMenu.icon" :title="subMenu.title" />
                                        </template>
                                        <el-menu-item v-for="(item,index) in subMenu.children" :key="item.toUrl+index" :index="item.toUrl">
                                            <template slot="title">
                                                <item :key="subMenu.toUrl+item.toUrl+index" :icon="item.icon" :title="item.title" />
                                            </template>
                                        </el-menu-item>
                                    </el-submenu>
                                </template>
                            </el-submenu>
                        </template>
                    </el-menu>
                </div>
            </el-card>
        </el-main>
        <el-footer v-if="radioData.length>0" style="text-align: center;">
            <!--操作按钮-->
            <el-button type="primary" @click="active===1?active=3:active--">
                <i class="el-icon-arrow-left" />
                上一步
            </el-button>
            <el-button v-show="active===3" type="primary" @click="submitRolePower">
                提交
            </el-button>
            <el-button type="primary" @click="active===3?active=1:active++">
                下一步
                <i class="el-icon-arrow-right" />
            </el-button>
        </el-footer>
    </el-container>
</template>
<script>

import {saveSysRole, selectAllSysRole, selectSysRole} from "@/api/sys-role-api";
import {selectAllSysMenu} from "@/api/sys-menu-api";
import Item from '@/layout/components/admin/Sidebar/Item.vue'
import i18n from "@/common/lang";

export default {
    components: {Item},
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
        active(val) {
            if (val === 3) {
                this.setMenuView();
            }
        },
        radio() {
            // 单选框改变时触发
            this.setDefaultTreeKeys();
        }
    },
    // 生命周期-页面创建
    created() {
        // 初始化方法
        this.init();
    },
    data() {
        return {
            // 步骤点
            active: 1,
            // 角色选择
            radio: 0,
            // 角色数据信息
            radioData: [],
            // 树过滤文本
            filterText: '',
            // 权限树数据
            treeData: [],
            // 树结构选中的节点key值
            checkedKey: [],
            // 用户的权限key值
            powers: [],
            // 树结构
            defaultProps: {
                label: 'title',
                children: 'children',
            },
            // 所有菜单项
            allMenu: [],
            // 要展示的菜单项
            chooseMenu: [],
        };
    },
    methods: {
        /**
         * 界面初始化方法
         */
        async init() {
            await this.loadAllRoles();
            await this.loadAllMenus();
            this.setDefaultRadio();
        },
        // 初始化角色信息
        async loadAllRoles() {
            try {
                const res = await selectAllSysRole();
                this.radioData = res.data.map(item => {
                    return {
                        key: item.id,
                        name: item.name,
                    };
                });
            } catch (error) {
                // 处理错误提示
                this.$message.error("网络异常：获取所有角色信息异常");
            }
        },
        // 初始化菜单信息
        async loadAllMenus() {
            try {
                const res = await selectAllSysMenu();
                const allMenu = res.data;
                const treeData = this.rebuildMenu(allMenu);
                this.allMenu = allMenu;
                this.treeData = treeData;
            } catch (error) {
                console.error('Failed to get all menus', error);
                // 处理错误提示
            }
        },
        /**
         * 重构数据项为可用数据
         */
        // 单选框：设置单选框数据并设置默认数据
        setDefaultRadio() {
            if (this.radioData.length > 1) {
                this.radio = this.radioData[0].key;
            } else {
                this.radio = 0;
            }
        },
        // 菜单:将菜单结构转为树结构
        rebuildMenu(allMenu) {
            return allMenu.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    children: item.children.map(son => {
                        return {
                            id: son.id,
                            title: son.title,
                            children: son.children.map(grandSon => {
                                return {
                                    id: grandSon.id,
                                    title: grandSon.title,
                                }
                            })
                        }
                    })
                }
            });
        },
        // 权限树：获取选中的角色其权限和选中项
        async setDefaultTreeKeys() {
            const res = await selectSysRole({id: this.radio});
            if (res.data.powers !== null) {
                // 设置权限
                this.powers = res.data.powers.split(',');
                // 设置选中项
                this.checkedKey = res.data.checkedKey.split(',');
                // 设置选中项
                this.$refs.tree.setCheckedKeys(this.checkedKey);
            }
        },
        /**
         *
         */
        // 权限树：搜索事件
        filterNode(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        // 权限树：修改选中事件
        onCheck(checkedNodes, checkedKeys) {
            this.checkedKey = checkedKeys.checkedKeys;
            this.powers = [...checkedKeys.checkedKeys, ...checkedKeys.halfCheckedKeys];
        },
        // 菜单：设置预览页面
        setMenuView() {
            if (this.powers.length > 0) {
                this.chooseMenu = this.filterMenu(this.allMenu, this.powers);
            } else {
                this.chooseMenu = [];
            }
        },
        // 菜单：递归筛选菜单事件
        filterMenu(menu, powers) {
            const filteredMenu = [];
            for (const item of menu) {
                if (powers.includes(item.id)) {
                    if (item.children && item.children.length > 0) {
                        const filteredChildren = this.filterMenu(item.children, powers);
                        if (filteredChildren.length > 0) {
                            filteredMenu.push({
                                ...item,
                                children: filteredChildren
                            });
                        }
                    } else {
                        filteredMenu.push(item);
                    }
                }
            }
            return filteredMenu;
        },
        // 提交角色信息
        submitRolePower() {
            let sysRole = {id: this.radio, powers: this.powers.join(','), checkedKey: this.checkedKey.join(',')};
            saveSysRole(sysRole).then(res => {
                if (res.data) {
                    this.$message.success(i18n.t('common.success'));
                } else {
                    this.$message.error(i18n.t('common.error') + ":" + res.data);
                }
            })
        },
    }
};
</script>

<style>
.el-header {
    padding: 0;
}

.el-main {
    padding: 0;
}

.el-footer {
    padding: 10px 0;
}

.el-card__body {
    padding: 0;
}

.card {
    text-align: center;
    min-height: 500px;
}

.card_one {
    line-height: 500px;
}

.card_two {
    height: 500px;
}
</style>
