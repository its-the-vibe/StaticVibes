import { Container, Graphics } from "pixi.js";
import { createParticleBurst, createRipple } from "./effects";
import { sound } from "./sound";
import { state, theme } from "./state";

export const gameGroup = new Container();

interface Note {
  lane: number;
  y: number;
  graphic: Graphics;
}

const NUM_LANES = 3;
let notes: Note[] = [];
let gameScore = 0;
let spawnTimer = 0;
let targetY = 0;

function handleLaneTap(laneIndex: number, laneWidth: number): void {
  sound.init();
  const tapX = laneIndex * laneWidth + laneWidth / 2;
  let hit = false;

  for (let i = notes.length - 1; i >= 0; i--) {
    const note = notes[i];
    if (note.lane !== laneIndex) continue;
    const dist = Math.abs(note.y - targetY);
    if (dist < 45) {
      hit = true;
      gameScore += Math.max(100 - Math.floor(dist), 10);
      document.getElementById("score-text")!.innerText = String(
        gameScore,
      ).padStart(4, "0");

      sound.playHitSound();
      createParticleBurst(tapX, targetY, theme().primary, 30);
      createRipple(tapX, targetY, 0xffffff);

      gameGroup.removeChild(note.graphic);
      note.graphic.destroy();
      notes.splice(i, 1);
      break;
    }
  }

  if (!hit) {
    sound.playMissSound();
    createRipple(tapX, targetY, 0xff0055);
  }
}

export function initGameMode(width: number, height: number): void {
  gameGroup.removeChildren().forEach((c) => c.destroy());
  notes = [];
  targetY = height - 160;

  const laneWidth = width / NUM_LANES;
  for (let i = 0; i < NUM_LANES; i++) {
    const laneLine = new Graphics()
      .moveTo(i * laneWidth, 60)
      .lineTo(i * laneWidth, height - 100)
      .stroke({ width: 1, color: 0xffffff, alpha: 0.08 });
    gameGroup.addChild(laneLine);

    const targetZone = new Graphics()
      .roundRect(i * laneWidth + 10, targetY - 20, laneWidth - 20, 40, 12)
      .fill({ color: theme().primary, alpha: 0.1 })
      .stroke({ width: 2, color: theme().primary, alpha: 0.6 });
    targetZone.eventMode = "static";
    targetZone.on("pointerdown", () => handleLaneTap(i, laneWidth));
    gameGroup.addChild(targetZone);
  }
}

export function updateGameMode(
  delta: number,
  width: number,
  height: number,
): void {
  if (state.mode !== "game") return;

  spawnTimer += delta;
  if (spawnTimer > 45) {
    spawnTimer = 0;
    const lane = Math.floor(Math.random() * NUM_LANES);
    const graphic = new Graphics().circle(0, 0, 18).fill(theme().secondary);
    graphic.x = lane * (width / NUM_LANES) + width / NUM_LANES / 2;
    graphic.y = 50;

    gameGroup.addChild(graphic);
    notes.push({ lane, y: 50, graphic });
  }

  const speed = 4.5 * delta;
  for (let i = notes.length - 1; i >= 0; i--) {
    const note = notes[i];
    note.y += speed;
    note.graphic.y = note.y;

    if (note.y > height - 110) {
      gameGroup.removeChild(note.graphic);
      note.graphic.destroy();
      notes.splice(i, 1);
    }
  }
}
