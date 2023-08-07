export class Animator {
  speed: number = 0;
  currentVal: number = 0;
  constructor(public start: number, public end: number, public during: number) {
    this.speed = (end - start) / during / 60;
  }

  startCB: null | ((val: number) => void) = null;
  progressCB: null | ((val: number) => void) = null;
  stopCB: null | ((val: number) => void) = null;
  stoped: boolean = false;

  onStart(cb: (val: number) => void) {
    this.startCB = cb;
  }

  onProgress(cb: (val: number) => void) {
    this.progressCB = cb;
  }

  onStop(cb: (val: number) => void) {
    this.stopCB = cb;
  }

  run() {
    let { start, end, speed } = this;
    this.currentVal = start;
    let taskId: any = null;
    const task = () => {
      if (this.currentVal > end || this.stoped) {
        window.cancelAnimationFrame(taskId);
        return;
      }
      this.currentVal += speed;
      this.progressCB?.(this.currentVal);
      taskId = window.requestAnimationFrame(task);
    };
    // taskId = window.requestAnimationFrame(task);
    task();
  }

  stop() {
    this.stoped = true;
    this.stopCB?.(this.currentVal);
  }
}
