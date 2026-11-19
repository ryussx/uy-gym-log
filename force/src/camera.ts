// Floating picture-in-picture camera preview. No recording here — use the
// phone's built-in screen recorder to capture the app, the preview and the audio.
export class CamPreview {
  private stream: MediaStream | null = null;
  facing: "user" | "environment" = "user";
  get active() { return !!this.stream; }

  constructor(private video: HTMLVideoElement) {}

  async start(facing = this.facing) {
    this.stop();
    this.facing = facing;
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facing, width: { ideal: 720 }, height: { ideal: 1280 }, frameRate: { ideal: 30 } },
      audio: false,
    });
    this.video.srcObject = this.stream;
    this.video.muted = true;
    this.video.classList.toggle("mirror", facing === "user");
    await this.video.play().catch(() => {});
  }

  async flip() { await this.start(this.facing === "user" ? "environment" : "user"); }

  stop() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.video.srcObject = null;
  }
}
