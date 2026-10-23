export type Preset = "cyber" | "synthwave" | "ambient";
export type Mode = "synth" | "game" | "visual";

export interface Theme {
  primary: number;
  secondary: number;
  bg: number;
}

export const Themes: Record<Preset, Theme> = {
  cyber: { primary: 0x00f0ff, secondary: 0xff007f, bg: 0x0b0f19 },
  synthwave: { primary: 0xff007f, secondary: 0xffaa00, bg: 0x14051a },
  ambient: { primary: 0x7000ff, secondary: 0x00ffd5, bg: 0x060814 },
};

export const state: { preset: Preset; mode: Mode } = {
  preset: "cyber",
  mode: "synth",
};

export const theme = (): Theme => Themes[state.preset];
