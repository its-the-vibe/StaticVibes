import { Container, Graphics, Text } from "pixi.js";
import { createParticleBurst, createRipple } from "./effects";
import { sound } from "./sound";
import { state, theme } from "./state";

export const synthGroup = new Container();

function drawPadBg(
  g: Graphics,
  w: number,
  h: number,
  active: boolean,
  color: number,
): void {
  g.clear().roundRect(0, 0, w, h, 18);
  if (active) {
    g.fill({ color, alpha: 0.4 }).stroke({
      width: 2,
      color: 0xffffff,
      alpha: 0.9,
    });
  } else {
    g.fill({ color: 0x121829, alpha: 0.65 }).stroke({
      width: 1.5,
      color,
      alpha: 0.35,
    });
  }
}

export function initSynthPad(width: number, height: number): void {
  synthGroup.removeChildren().forEach((c) => c.destroy({ children: true }));

  const cols = 2;
  const rows = 4;
  const gap = 12;
  const padWidth = (width - 40 - gap) / cols;
  const padHeight = (height - 220 - (rows - 1) * gap) / rows;
  const startX = 20;
  const startY = 70;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const pad = new Container();
      pad.x = startX + c * (padWidth + gap);
      pad.y = startY + r * (padHeight + gap);

      const bg = new Graphics();
      drawPadBg(bg, padWidth, padHeight, false, theme().primary);

      pad.eventMode = "static";
      pad.cursor = "pointer";

      const label = new Text({
        text: `PAD 0${idx + 1}`,
        style: {
          fontFamily: "Orbitron",
          fontSize: 12,
          fill: 0xffffff,
          fontWeight: "bold",
        },
      });
      label.x = 12;
      label.y = 12;

      pad.addChild(bg, label);

      pad.on("pointerdown", () => {
        const cx = pad.x + padWidth / 2;
        const cy = pad.y + padHeight / 2;
        sound.init();
        sound.playNoteByIndex(idx, state.preset);
        createParticleBurst(cx, cy, theme().primary, 25);
        createRipple(cx, cy, theme().secondary);

        drawPadBg(bg, padWidth, padHeight, true, theme().secondary);
        setTimeout(() => {
          if (bg.destroyed) return;
          drawPadBg(bg, padWidth, padHeight, false, theme().primary);
        }, 150);
      });

      synthGroup.addChild(pad);
    }
  }
}
