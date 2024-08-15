<template>
    <div class="container">
        <el-row class="header">
            <el-col>
                <el-form>
                    <el-form-item label="文件名">
                        {{ this.excelData.fileName | dataFilter }}
                    </el-form-item>
                    <el-form-item label="文件大小">
                        {{ this.excelData.fileSize | dataFilter }}
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="18" class="file-input">
                <input
                    ref="excel-upload-input"
                    class="excel-upload-input"
                    type="file"
                    accept=".xlsx, .xls"
                    @change="handleClick"
                />
                <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
                    将excel文件(小于5M)放在这里或
                    <el-button
                        :loading="loading"
                        style="margin-left:16px;"
                        size="mini"
                        type="primary"
                        @click="handleUpload"
                    >
                        浏览
                    </el-button>
                </div>
            </el-col>
        </el-row>
        <el-table :data="excelData.results" border highlight-current-row style="width: 100%;margin-top:20px;">
            <el-table-column v-for="item of excelData.header" :key="item" :prop="item" :label="item" />
        </el-table>
    </div>
</template>

<script>
import XLSX from 'xlsx';
import i18n from '@/common/lang';

export default {
    props: {
        excelData: {
            type: Object,
            default: () => (
                {
                    fileName: "",
                    fileSize: 0,
                    header: null,
                    results: null,
                    file: null,
                }
            ),
        }
    },
    data() {
        return {
            loading: false,
            DEFAULT_HEADER: i18n.t('component.excel.unKnownHeader'),
        }
    },
    methods: {
        handleDrop(e) {
            e.stopPropagation()
            e.preventDefault()
            if (this.loading) return
            const files = e.dataTransfer.files;
            if (files.length !== 1) {
                this.$message.error('只支持上传一个文件!')
                return
            }
            const rawFile = files[0] // 只使用文件[0]

            if (!this.isExcel(rawFile)) {
                this.$message.error('只支持上传.xlsx、.xls、.csv后缀的文件')
                return false
            }
            this.upload(rawFile)
            e.stopPropagation()
            e.preventDefault()
        },
        handleDragover(e) {
            e.stopPropagation()
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        },
        handleUpload() {
            this.$refs['excel-upload-input'].click()
        },
        handleClick(e) {
            const files = e.target.files
            const rawFile = files[0] // 只使用文件[0]
            if (!rawFile) return
            this.upload(rawFile)
        },
        upload(rawFile) {
            this.$refs['excel-upload-input'].value = null // 修复无法选择相同的excel

            if (!this.beforeUpload) {
                this.readerData(rawFile)
                return
            }
            const before = this.beforeUpload(rawFile)
            if (before) {
                this.readerData(rawFile)
            }
        },
        async beforeUpload(file) {
            this.excelData.fileName = file.name;
            this.excelData.fileSize = file.size / 1024 + "KB";
            if (file.size / 1024 / 1024 < 1) {
                return true
            }
            this.$message({
                message: '请不要上传大于1m的文件.',
                type: 'warning'
            })
            return false
        },
        async readerData(rawFile) {
            this.loading = true
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    const data = e.target.result
                    const workbook = XLSX.read(data, {type: 'array'})
                    const firstSheetName = workbook.SheetNames[0]
                    const worksheet = workbook.Sheets[firstSheetName]
                    const header = this.getHeaderRow(worksheet)
                    const results = XLSX.utils.sheet_to_json(worksheet, {
                        range: 2, // 开始读取数据的行数
                        header: header // 自定义标题行，不包括第一行和第二行
                    })
                    this.excelData.file=rawFile;
                    this.excelData.header=header;
                    this.excelData.results=results;
                    this.loading = false
                    this.$message.success("文件加载已完成")
                    resolve()
                }
                reader.readAsArrayBuffer(rawFile)
            })
        },
        getHeaderRow(sheet) {
            const headers = []
            const {s: {r: startRow, c: startCol}, e: {c: endCol}} = XLSX.utils.decode_range(sheet['!ref'])
            const headerRow = startRow + 1
            // 获取excel表格头部标题信息
            Array.from({length: endCol - startCol + 1}).forEach((_, index) => {
                const cell = sheet[XLSX.utils.encode_cell({c: startCol + index, r: headerRow})]
                const header = cell && cell.t ? XLSX.utils.format_cell(cell) : this.DEFAULT_HEADER + index
                headers.push(header)
            })
            // 返回标题信息
            return headers
        },
        isExcel(file) {
            return /\.(xlsx|xls|csv)$/.test(file.name)
        }
    },
}
</script>

<style scoped>

.container {
    margin: 0 auto;
    padding: 20px;
    border: 1px white solid;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.file-input {
    display: flex;
    align-items: center;
}

.drop {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    border: 2px dashed #ccc;
    margin-left: 20px;
    font-size: 14px;
    color: #666;
}

.drop:hover {
    cursor: pointer;
    background-color: #f2f2f2;
}

.excel-upload-input {
    display: none;
    z-index: 9999;
}

.drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
}
</style>
