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
    <div class="main-content">
      <div class="lottery-options">
        <el-tag v-for="el in currentOptions">{{ el.name }}</el-tag>
        <el-button
          :disabled="!currentLotteryId"
          type="primary"
          text
          @click="handleAddOption"
        >
          <el-icon><Plus></Plus></el-icon>
        </el-button>
      </div>
      <Roulette ref="rouletteRef" :options="currentOptions"></Roulette>
    </div>
    <LotteryForm @success="getLotteryList" v-model="formVisible"></LotteryForm>
    <OptionForm
      v-model="optionFormVisible"
      :lottery-id="currentLotteryId"
      @success="handleRefreshOptions"
    ></OptionForm>
  </div>
</template>

<script setup lang="ts">
import { nextTick, provide, ref } from "vue";
import { ElScrollbar, ElMenu, ElTag, ElIcon } from "element-plus";
import LotteryForm from "../components/LotteryForm.vue";
import { getDB } from "../db";
import LotteryService from "../service/LotteryService";
import { serviceInjectionKey } from "../hook/useService";
import { ILottery, ILotteryOption } from "../model/lottery";
import { Plus } from "@element-plus/icons-vue";
import OptionForm from "../components/OptionForm.vue";
import Roulette from "../components/Roulette.vue";

const rouletteRef = ref();
const lotteryService = new LotteryService();
const services = { lotteryService };
provide(serviceInjectionKey, services);
const lotteryList = ref<ILottery[]>([]);
const currentOptions = ref<ILotteryOption[]>([]);
const currentLotteryId = ref("");
const formVisible = ref(false);
const handleAdd = () => {
  formVisible.value = true;
};
const optionFormVisible = ref(false);
const handleAddOption = () => {
  optionFormVisible.value = true;
};
const handleMenuSelect = async (val: any) => {
  const detail = await services.lotteryService.getLotteryDetail(val);
  currentLotteryId.value = val;
  currentOptions.value = detail.options;
  await nextTick();
  rouletteRef.value.paint();
};
const handleRefreshOptions = () => {
  handleMenuSelect(currentLotteryId.value);
};

const getLotteryList = async () => {
  lotteryList.value = await services.lotteryService.getLotteryList();
};

const onInit = async () => {
  getLotteryList();
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
    display: flex;
    flex-direction: column;
    .lottery-options {
      padding: 8px;
      .el-tag {
        margin-right: 4px;
      }
      border-bottom: 1px solid #eee;
    }
  }
}
</style>
