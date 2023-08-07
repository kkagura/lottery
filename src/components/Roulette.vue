<template>
  <div ref="containerRef" class="roulette-container">
    <canvas ref="bottomCanvasRef"></canvas>
    <canvas ref="topCanvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from "vue";
import { ILotteryOption } from "../model/lottery";
import { RandomColor } from "../utils/color";
import { Animator } from "../animate";
const props = defineProps({
  options: {
    type: Array as PropType<ILotteryOption[]>,
    required: true,
  },
});

const containerRef = ref<HTMLElement>();
const topCanvasRef = ref<HTMLCanvasElement>();
const bottomCanvasRef = ref<HTMLCanvasElement>();
const dpr = window.devicePixelRatio;
const initSize = () => {
  const container = containerRef.value!;
  const topCanvas = topCanvasRef.value!;
  const bottomCanvas = bottomCanvasRef.value!;
  const { width, height } = container.getBoundingClientRect();
  topCanvas.width = width * dpr;
  topCanvas.height = height * dpr;
  topCanvas.style.width = width + "px";
  topCanvas.style.height = height + "px";
  bottomCanvas.width = width * dpr;
  bottomCanvas.height = height * dpr;
  bottomCanvas.style.width = width + "px";
  bottomCanvas.style.height = height + "px";
};

let currentAngle = 0;
// let
const paintPointer = () => {
  const container = containerRef.value!;
  const { width, height } = container.getBoundingClientRect();
  const canvas = topCanvasRef.value!;
  const ctx = canvas.getContext("2d")!;
  const l = Math.round(Math.min(width, height) * 0.4) * 0.8;
  const w = l * 0.1;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.translate(width / 2, height / 2);
  ctx.rotate(currentAngle);
  ctx.beginPath();
  ctx.shadowBlur = 40;
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.moveTo(0, 0);
  ctx.lineTo(0 - w, 0 - l * 0.4);
  ctx.lineTo(0, 0 - l);
  ctx.lineTo(0 + w, 0 - l * 0.4);
  ctx.lineTo(0, 0);
  ctx.fill();
  ctx.restore();
};

const startRotate = () => {
  const animator = new Animator(
    currentAngle,
    currentAngle + 15 + 50 * Math.PI * Math.random(),
    5
  );
  animator.onProgress((val) => {
    console.log(val);
    currentAngle = val;
    paintPointer();
  });
  animator.run();
};

const paint = () => {
  const container = containerRef.value!;
  const canvas = bottomCanvasRef.value!;
  const { width, height } = container.getBoundingClientRect();
  const r = Math.round(Math.min(width, height) * 0.4);
  const options = props.options;
  const totalWeight = options.reduce((pre, cur) => pre + +cur.weight, 0);

  const colors = new RandomColor(props.options.length).rgbArray;

  const ctx = canvas.getContext("2d")!;
  let lastAngel = 0;
  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.translate(width / 2, height / 2);
  for (let i = 0; i < props.options.length; i++) {
    const op = props.options[i];
    const angle = (op.weight / totalWeight) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.rotate(lastAngel);
    ctx.fillStyle = "blue";
    ctx.font = "16px we";
    ctx.fillText(op.name, 0, -r);
    lastAngel = angle;
    ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i].color;
    ctx.fill();
  }
  ctx.restore();
  paintPointer();
};

onMounted(() => {
  initSize();
});

defineExpose({ paint, startRotate });
</script>

<style lang="less" scope>
.roulette-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
