import { Application } from "pixi.js";
import {
  clearEffects,
  createParticleBurst,
  createRipple,
  particleContainer,
  rippleContainer,
  updateEffects,
} from "./effects";
import { gameGroup, initGameMode, updateGameMode } from "./game";
import { sound } from "./sound";
import { Mode, Preset, state, theme } from "./state";
import { initSynthPad, synthGroup } from "./synth";
import {
  initVisualizerMode,
  updateVisualizer,
  visualGroup,
} from "./visualizer";

const byId = <T extends HTMLElement>(id: string): T =>
  document.getElementById(id) as T;

const PRESET_ACTIVE =
  "preset-btn px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40";
const PRESET_INACTIVE =
  "preset-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white";

function switchMode(newMode: Mode): void {
  state.mode = newMode;

  synthGroup.visible = newMode === "synth";
  gameGroup.visible = newMode === "game";
  visualGroup.visible = newMode === "visual";

  const scoreBanner = byId("score-banner");
  const padControls = byId("control-panel-pad");
  const subtitle = byId("mode-subtitle");

  if (newMode === "game") {
    scoreBanner.classList.remove("opacity-0");
    padControls.classList.add("hidden");
    subtitle.innerText = "RHYTHM RUSH";
  } else {
    scoreBanner.classList.add("opacity-0");
    padControls.classList.remove("hidden");
    subtitle.innerText =
      newMode === "synth" ? "SYNTH LAB v2.0" : "AUDIO VISUALIZER";
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("bg-white/10", "text-cyan-400");
    btn.classList.add("text-slate-400");
  });
  const activeTab = byId(`tab-${newMode}`);
  activeTab.classList.add("bg-white/10", "text-cyan-400");
  activeTab.classList.remove("text-slate-400");
}

function updateClock(): void {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  byId("status-time").innerText = `${hours}:${minutes}`;
}

(async () => {
  const container = byId("pixi-viewport");
  const app = new Application();
  await app.init({
    resizeTo: container,
    background: theme().bg,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
  });
  container.appendChild(app.canvas);

  app.stage.addChild(
    synthGroup,
    gameGroup,
    visualGroup,
    rippleContainer,
    particleContainer,
  );
  gameGroup.visible = false;
  visualGroup.visible = false;

  const buildScenes = (): void => {
    const { width, height } = app.screen;
    initSynthPad(width, height);
    initGameMode(width, height);
    initVisualizerMode(width, height);
  };
  buildScenes();
  app.renderer.on("resize", buildScenes);

  // Tapping the empty background triggers a ripple
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", (e) => {
    if (e.target !== app.stage) return;
    sound.init();
    sound.playTone(180 + Math.random() * 200, "sine", 0.2);
    createRipple(e.global.x, e.global.y, theme().primary);
    createParticleBurst(e.global.x, e.global.y, theme().secondary, 10);
  });

  let timeCounter = 0;
  app.ticker.add((ticker) => {
    const delta = ticker.deltaTime;
    timeCounter += delta;
    updateEffects(delta);
    updateGameMode(delta, app.screen.width, app.screen.height);
    updateVisualizer(timeCounter, app.screen.width, app.screen.height);
  });

  setInterval(updateClock, 1000);
  updateClock();

  byId("tab-synth").addEventListener("click", () => switchMode("synth"));
  byId("tab-game").addEventListener("click", () => switchMode("game"));
  byId("tab-visual").addEventListener("click", () => switchMode("visual"));

  document.querySelectorAll<HTMLButtonElement>(".preset-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.preset = btn.dataset.preset as Preset;
      app.renderer.background.color = theme().bg;
      initSynthPad(app.screen.width, app.screen.height);
      initGameMode(app.screen.width, app.screen.height);

      document
        .querySelectorAll<HTMLButtonElement>(".preset-btn")
        .forEach((b) => (b.className = PRESET_INACTIVE));
      btn.className = PRESET_ACTIVE;
    });
  });

  const soundBtn = byId("btn-sound-toggle");
  soundBtn.addEventListener("click", () => {
    sound.muted = !sound.muted;
    soundBtn.innerHTML = sound.muted
      ? '<i class="fa-solid fa-volume-xmark text-rose-400"></i>'
      : '<i class="fa-solid fa-volume-high"></i>';
  });

  const modal = byId("modal-info");
  byId("btn-info").addEventListener("click", () =>
    modal.classList.remove("hidden"),
  );
  byId("btn-close-modal").addEventListener("click", () =>
    modal.classList.add("hidden"),
  );

  byId("btn-clear-particles").addEventListener("click", clearEffects);
})();
