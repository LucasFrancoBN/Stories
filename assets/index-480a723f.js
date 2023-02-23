var c=Object.defineProperty;var m=(o,t,e)=>t in o?c(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var s=(o,t,e)=>(m(o,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))d(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const h of n.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&d(h)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function d(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();class l{constructor(t,e){s(this,"id");s(this,"handler");s(this,"start");s(this,"timeLeft");this.id=setTimeout(t,e),this.handler=t,this.start=Date.now(),this.timeLeft=e}clear(){clearTimeout(this.id)}pause(){const t=Date.now()-this.start;this.timeLeft=this.timeLeft-t,this.clear()}continue(){this.clear(),this.id=setTimeout(this.handler,this.timeLeft),this.start=Date.now()}}class p{constructor(t,e,d,i=5e3){s(this,"container");s(this,"slides");s(this,"controls");s(this,"time");s(this,"index");s(this,"slide");s(this,"activeClass");s(this,"timeout");s(this,"paused");s(this,"pausedTimeout");s(this,"activeSlide","activeSlide");s(this,"thumbItems");s(this,"thumb");s(this,"pausedClass");this.container=t,this.slides=e,this.controls=d,this.time=i,this.activeClass="active",this.activeSlide="activeSlide",this.index=localStorage.getItem(this.activeSlide)?Number(localStorage.getItem(this.activeSlide)):0,this.slide=this.slides[this.index],this.timeout=null,this.paused=!1,this.pausedTimeout=null,this.thumbItems=null,this.thumb=null,this.pausedClass="paused",this.init()}hide(t){t.classList.remove(this.activeClass),t instanceof HTMLVideoElement&&(t.currentTime=0,t.pause())}show(t){this.index=t,this.slide=this.slides[this.index],localStorage.setItem(this.activeSlide,String(this.index)),this.thumbItems&&(this.thumb=this.thumbItems[this.index],this.thumbItems.forEach(e=>e.classList.remove(this.activeClass)),this.thumb.classList.add(this.activeClass)),this.slides.forEach(e=>this.hide(e)),this.slide.classList.add(this.activeClass),this.slide instanceof HTMLVideoElement?this.autoVideo(this.slide):this.auto(this.time)}autoVideo(t){t.muted=!0,t.play();let e=!0;t.addEventListener("playing",()=>{e&&this.auto(t.duration*1e3),e=!1})}auto(t){var e;(e=this.timeout)==null||e.clear(),this.timeout=new l(()=>this.next(),t),this.thumb&&(this.thumb.style.animationDuration=`${t}ms`)}prev(){if(this.paused)return;const t=this.index>0?this.index-1:this.slides.length-1;this.show(t)}next(){if(this.paused)return;const t=this.index+1<this.slides.length?this.index+1:0;this.show(t)}pause(){document.body.classList.add(this.pausedClass),this.pausedTimeout=new l(()=>{var t,e;(t=this.timeout)==null||t.pause(),this.paused=!0,(e=this.thumb)==null||e.classList.add(this.pausedClass),this.slide instanceof HTMLVideoElement&&this.slide.pause()},300)}continue(){var t,e,d;document.body.classList.remove(this.pausedClass),(t=this.pausedTimeout)==null||t.clear(),this.paused&&(this.paused=!1,(e=this.timeout)==null||e.continue(),(d=this.thumb)==null||d.classList.remove(this.pausedClass),this.slide instanceof HTMLVideoElement&&this.slide.play())}addControl(){const t=document.createElement("button"),e=document.createElement("button");t.innerText="Slide Anterior",e.innerText="Próximo Slide",this.controls.appendChild(t),this.controls.appendChild(e),this.controls.addEventListener("pointerdown",()=>this.pause()),document.addEventListener("pointerup",()=>this.continue()),document.addEventListener("touchend",()=>this.continue()),t.addEventListener("pointerup",()=>this.prev()),e.addEventListener("pointerup",()=>this.next())}addThumbItems(){const t=document.createElement("div");t.id="slide-thumb";for(let e=0;e<this.slides.length;e++)t.innerHTML+='<span><span class="thumb-items"></span></span>';this.controls.appendChild(t),this.thumbItems=Array.from(document.querySelectorAll(".thumb-items"))}init(){this.addControl(),this.addThumbItems(),this.show(this.index)}}const r=document.getElementById("slide"),a=document.getElementById("slide-elements"),u=document.getElementById("slide-controls");r&&a&&u&&a.children.length&&new p(r,Array.from(a.children),u,3e3);