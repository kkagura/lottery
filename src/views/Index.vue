<template>
  <div class="main-page">
    <div class="left-side">
      <el-scrollbar>
        <el-button style="margin: 0 auto" type="primary" @click="handleAdd"
          >新增</el-button
        >
        <el-menu @select="handleMenuSelect">
          <el-menu-item v-for="el in lotteryList" :index="el.id">{{
            el.name
          }}</el-menu-item>
        </el-menu>
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
import { ILottery, ILotteryOption } from "../model/lottery";

const lotteryService = new LotteryService();
const services = { lotteryService };
provide(serviceInjectionKey, services);
const lotteryList = ref<ILottery[]>([]);
const currentOptions = ref<ILotteryOption[]>([]);
const formVisible = ref(false);
const handleAdd = () => {
  formVisible.value = true;
};
const handleMenuSelect = async (val: any) => {
  const detail = await services.lotteryService.getLotteryDetail(val);
  currentOptions.value = detail.options;
};
const onInit = async () => {
  lotteryList.value = await services.lotteryService.getLotteryList();
};
onInit();
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
