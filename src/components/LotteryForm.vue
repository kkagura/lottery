<template>
  <el-dialog @open="onOpen" @close="onClose" v-model="visible" :title="''">
    <el-form ref="formRef" :model="formData" :rules="rules">
      <el-form-item prop="name" label="分组名称">
        <el-input
          v-model="formData.name"
          :maxlength="20"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button>取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { computed } from "vue";
import { useService } from "../hook/useService";
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref();
const formData = reactive({
  name: "",
});
const rules = {
  name: {
    required: true,
    message: "请输入分组名称",
  },
};
const onOpen = async () => {};
const onClose = () => {
  formRef.value.resetFields();
};
const service = useService();
const handleConfirm = async () => {
  await formRef.value.validate();
  service.lotteryService.addLottery(formData);
};
</script>
<style lang="less" scoped></style>
