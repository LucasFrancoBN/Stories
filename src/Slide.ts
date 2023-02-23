import Timeout from "./Timeout";

export default class Slide {
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  activeClass: "active";
  timeout: Timeout | null;
  paused: boolean;
  pausedTimeout: Timeout | null;
  activeSlide = "activeSlide";
  thumbItems: HTMLElement[] | null;
  thumb: HTMLElement | null;
  pausedClass: "paused";
  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    time: number = 5000
  ) {
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;

    this.activeClass = "active";
    this.activeSlide = "activeSlide";

    this.index = localStorage.getItem(this.activeSlide)
      ? Number(localStorage.getItem(this.activeSlide))
      : 0;
    // console.log(this.index);
    this.slide = this.slides[this.index];

    this.timeout = null;
    this.paused = false;
    this.pausedTimeout = null;

    this.thumbItems = null;
    this.thumb = null;

    this.pausedClass = "paused";

    this.init();
  }

  hide(el: Element) {
    el.classList.remove(this.activeClass);
    if (el instanceof HTMLVideoElement) {
      el.currentTime = 0;
      el.pause();
    }
  }

  show(index: number) {
    this.index = index;
    this.slide = this.slides[this.index];
    localStorage.setItem(this.activeSlide, String(this.index));

    if (this.thumbItems) {
      this.thumb = this.thumbItems[this.index];
      this.thumbItems.forEach((el) => el.classList.remove(this.activeClass));
      this.thumb.classList.add(this.activeClass);
    }

    this.slides.forEach((img) => this.hide(img));
    this.slide.classList.add(this.activeClass);
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide);
    } else {
      this.auto(this.time);
    }
  }

  autoVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.play();
    let firstPlay = true;
    video.addEventListener("playing", () => {
      if (firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
  }

  auto(time: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), time);
    if (this.thumb) this.thumb.style.animationDuration = `${time}ms`;
  }

  prev() {
    if (this.paused) return;
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }

  next() {
    if (this.paused) return;
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.show(next);
  }

  pause() {
    document.body.classList.add(this.pausedClass);
    this.pausedTimeout = new Timeout(() => {
      this.timeout?.pause();
      this.paused = true;
      this.thumb?.classList.add(this.pausedClass);
      if (this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 300);
  }

  continue() {
    document.body.classList.remove(this.pausedClass);
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      this.thumb?.classList.remove(this.pausedClass);
      if (this.slide instanceof HTMLVideoElement) this.slide.play();
    }
  }

  private addControl() {
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.innerText = "Slide Anterior";
    nextButton.innerText = "Próximo Slide";
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);

    this.controls.addEventListener("pointerdown", () => this.pause());
    document.addEventListener("pointerup", () => this.continue());
    document.addEventListener("touchend", () => this.continue());

    prevButton.addEventListener("pointerup", () => this.prev());
    nextButton.addEventListener("pointerup", () => this.next());
  }

  private addThumbItems() {
    const thumbContainer = document.createElement("div");
    thumbContainer.id = "slide-thumb";
    for (let index = 0; index < this.slides.length; index++) {
      thumbContainer.innerHTML += `<span><span class="thumb-items"></span></span>`;
    }
    this.controls.appendChild(thumbContainer);
    this.thumbItems = Array.from(document.querySelectorAll(".thumb-items"));
  }

  private init() {
    this.addControl();
    this.addThumbItems();
    this.show(this.index);
  }
}
