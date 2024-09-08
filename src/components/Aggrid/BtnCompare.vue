<template>
    <el-button type="primary" @click="compare">比对</el-button>
</template>

<script>
export default {
    name: 'BtnCompare',
    methods: {
        compare() {
            alert('比对功能');
        }
    }
}
</script>
