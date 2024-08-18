<template>
    <div>
        <el-button @click="showDialog">打开对话框</el-button>

        <my-dialog
            :visible.sync="grid.visible"
            top="10%"
            width="90%"
            @submit="grid.visible = false">
            <template v-slot:title-slot>
                <a :href="grid.linkUrl" target="_blank" style="color: inherit; text-decoration: none;">
                    {{ grid.title }}
                </a>
            </template>
            <ag-grid-vue
                class="ag-theme-alpine"
                style="width: 100%; height: 400px;"
                :columnDefs="grid.columnDefs"
                :rowData="grid.rowData"
                :gridOptions="grid.gridOptions">
            </ag-grid-vue>
        </my-dialog>
    </div>
</template>
<script>
import MyDialog from '@/components/Dialog';
import { AgGridVue } from 'ag-grid-vue';

export default {
    components: {
        MyDialog,
        AgGridVue
    },
    data() {
        return {
            grid: {
                visible: false,
                title: '点击查看更多信息',
                linkUrl: 'https://example.com', // 初始超链接地址
                columnDefs: [/* 列定义 */],
                rowData: [/* 数据行 */],
                gridOptions: {/* 表格选项 */}
            }
        };
    },
    methods: {
        showDialog() {
            this.grid.visible = true;
            this.updateLinkUrl(); // 更新超链接地址
        },
        updateLinkUrl() {
            // 根据具体的业务逻辑动态更新 URL
            // 例如，可以根据 rowData 的内容或其他条件来设置
            this.grid.linkUrl = 'https://new-url.com'; // 新的 URL 地址
        }
    }
};
</script>
