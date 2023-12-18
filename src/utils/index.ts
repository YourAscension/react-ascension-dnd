import { IItems } from "./types";

const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateRandomRgbColor = () => {
  return `rgb(${randomIntFromInterval(1, 255)},${randomIntFromInterval(
    1,
    255
  )},${randomIntFromInterval(1, 255)})`;
};

export const generateItems = (count: number): IItems[] => {
  return new Array(count).fill('').map((_, index) => {
    return { id: index, title: `Item ${index}`, color: generateRandomRgbColor() };
  });
};