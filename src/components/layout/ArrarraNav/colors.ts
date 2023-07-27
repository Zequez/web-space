export type Colors = {
  base: (i: number) => string;
  transparent: (i: number) => string;
  dimmer: (i: number) => string;
  slightlyDarker: (i: number) => string;
  darker: (i: number) => string;
  darkerDimmer: (i: number) => string;
};

export default (itemsCount: number) => {
  const hueSlice = 360 / itemsCount;
  return {
    base: (i: number) => `hsl(${i * hueSlice}, 50%, 50%)`,
    transparent: (i: number) => `hsla(${i * hueSlice}, 50%, 50%, 10%)`,
    dimmer: (i: number) => `hsl(${i * hueSlice}, 30%, 50%)`,
    slightlyDarker: (i: number) => `hsl(${i * hueSlice}, 50%, 47%)`,
    darker: (i: number) => `hsl(${i * hueSlice}, 50%, 40%)`,
    darkerDimmer: (i: number) => `hsl(${i * hueSlice}, 30%, 40%)`,
  };
};
