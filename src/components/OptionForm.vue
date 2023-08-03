<template>
  <el-dialog @open="onOpen" @close="onClose" v-model="visible" :title="''">
    <el-form label-width="100px" ref="formRef" :model="formData" :rules="rules">
      <el-form-item prop="name" label="选项名称">
        <el-input
          v-model="formData.name"
          :maxlength="20"
          clearable
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item prop="weight" label="权重">
        <el-input
          v-model="formData.weight"
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
  lotteryId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "success"]);
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const formRef = ref();
const formData = reactive({
  name: "",
  weight: 1,
});
const rules = {
  name: {
    required: true,
    message: "请输入选项名称",
  },
  weight: {
    required: true,
    message: "请输入选项权重",
  },
};
const onOpen = async () => {};
const onClose = () => {
  formRef.value.resetFields();
};
const service = useService();
const handleConfirm = async () => {
  await formRef.value.validate();
  await service.lotteryService.addLotteryOption({
    ...formData,
    lotteryId: props.lotteryId,
  });
  emit("success");
  visible.value = false;
};
</script>
