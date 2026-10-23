import { Container, Graphics } from "pixi.js";
import { createParticleBurst, createRipple } from "./effects";
import { sound } from "./sound";
import { state, theme } from "./state";

export const visualGroup = new Container();

interface VisualNode {
  g: Graphics;
  baseRadius: number;
  angle: number;
  distance: number;
}

const visualNodes: VisualNode[] = [];

function drawNode(n: VisualNode, i: number, radius: number): void {
  const color = i % 2 === 0 ? theme().primary : theme().secondary;
  n.g.clear().circle(0, 0, radius).fill({ color, alpha: 0.85 });
}

export function initVisualizerMode(width: number, height: number): void {
  visualGroup.removeChildren().forEach((c) => c.destroy());
  visualNodes.length = 0;

  const center = { x: width / 2, y: height / 2 - 30 };
  const nodeCount = 12;

  for (let i = 0; i < nodeCount; i++) {
    const node: VisualNode = {
      g: new Graphics(),
      baseRadius: 15 + Math.random() * 20,
      angle: (i / nodeCount) * Math.PI * 2,
      distance: 70 + Math.random() * 50,
    };
    const { g } = node;
    g.x = center.x + Math.cos(node.angle) * node.distance;
    g.y = center.y + Math.sin(node.angle) * node.distance;
    drawNode(node, i, node.baseRadius);

    g.eventMode = "static";
    g.cursor = "pointer";
    g.on("pointerdown", () => {
      sound.init();
      sound.playTone(300 + i * 50, "sine", 0.5);
      createParticleBurst(g.x, g.y, theme().primary, 20);
      createRipple(g.x, g.y, theme().secondary);
    });

    visualGroup.addChild(g);
    visualNodes.push(node);
  }
}

export function updateVisualizer(
  time: number,
  width: number,
  height: number,
): void {
  if (state.mode !== "visual") return;

  const center = { x: width / 2, y: height / 2 - 30 };

  visualNodes.forEach((node, i) => {
    node.angle += 0.015;
    const dist = node.distance + Math.sin(time * 0.003 + i) * 20;
    node.g.x = center.x + Math.cos(node.angle) * dist;
    node.g.y = center.y + Math.sin(node.angle) * dist;
    drawNode(node, i, node.baseRadius + Math.sin(time * 0.005 + i) * 5);
  });
}
