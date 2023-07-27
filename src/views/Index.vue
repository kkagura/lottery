<template>
  <div class="main-page">
    <div class="left-side">
      <el-scrollbar>
        <el-button style="margin: 0 auto" type="primary" @click="handleAdd"
          >新增</el-button
        >
        <el-menu></el-menu>
      </el-scrollbar>
    </div>
    <div class="main-content"></div>
    <LotteryForm v-model="formVisible"></LotteryForm>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from "vue";
import { ElScrollbar, ElMenu } from "element-plus";
import LotteryForm from "../components/LotteryForm.vue";
import { getDB } from "../db";
import LotteryService from "../service/LotteryService";
import { serviceInjectionKey } from "../hook/useService";

const lotteryService = new LotteryService();

provide(serviceInjectionKey, { lotteryService });

const formVisible = ref(false);
const handleAdd = () => {
  formVisible.value = true;
};
</script>

<style lang="less">
.main-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  display: flex;
  .left-side {
    width: 200px;
    height: 100%;
    border-right: 1px solid #eee;
  }
  .main-content {
    flex: 1;
    height: 100%;
  }
}
</style>
