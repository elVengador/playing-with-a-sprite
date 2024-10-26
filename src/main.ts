import "./style.css";
const OFFSET_X = 0;
const INTERNAL_OFFSET_X = 30;
const INTERNAL_OFFSET_Y = 30;
const OFFSET_Y = 0;
const SPRITE_WIDTH = 100;
const SPRITE_HEIGHT = 100;
const CANVAS_WIDTH = 50;
const CANVAS_HEIGHT = 50;

type Animation = { row: number; column: number; length: number };

const IDLE_ANIMATION: Animation = { row: 0, column: 0, length: 6 };
const IDLE2_ANIMATION: Animation = { row: 1, column: 0, length: 8 };
const ATTACK_ANIMATION: Animation = { row: 2, column: 0, length: 6 };
// const WALK_ANIMATION: Animation = { row: 2, column: 0, length: 8 };
// const RUN_ANIMATION: Animation = { row: 3, column: 0, length: 8 };
// const RUN_ATTACK_ANIMATION: Animation = { row: 4, column: 0, length: 8 };
let positions: { x: number; y: number }[] = [];

const getAnimationPositions = (
  animation: Animation
): { x: number; y: number }[] => {
  return new Array(animation.length).fill(0).map((_, i) => ({
    x: animation.row,
    y: animation.column + i,
  }));
};

const drawSprite = (
  rowIdx: number,
  columnIdx: number,
  context: CanvasRenderingContext2D,
  sprite: HTMLImageElement
) => {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  context.drawImage(
    sprite,
    OFFSET_X + columnIdx * SPRITE_WIDTH + INTERNAL_OFFSET_X,
    OFFSET_Y + rowIdx * SPRITE_HEIGHT + INTERNAL_OFFSET_Y,
    SPRITE_WIDTH - INTERNAL_OFFSET_X * 2,
    SPRITE_HEIGHT - INTERNAL_OFFSET_Y * 2,
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );
};

type CanvasSetup = {
  context: CanvasRenderingContext2D;
  sprite: HTMLImageElement;
};

const setUpCanvas = async (): Promise<CanvasSetup> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      if (!canvas) throw Error("Canvas not found");
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const context = canvas.getContext("2d");

      const sprite = new Image();
      sprite.src = "Orc.png";
      sprite.onload = () => {
        if (!context) throw Error("Can find context");
        drawSprite(0, 0, context, sprite);
        resolve({ context, sprite });
      };
    } catch (error) {
      console.error({ error });
      reject(error);
    }
  });
};

const wait = async (timer: number = 200) =>
  new Promise((resolve) => setTimeout(() => resolve(true), timer));

const loop = async ({ context, sprite }: CanvasSetup) => {
  positions = getAnimationPositions(IDLE_ANIMATION);
  console.log({ positions });
  let idx = 0;
  let x = positions[idx].x;
  let y = positions[idx].y;
  while (true) {
    await wait();
    drawSprite(x, y, context, sprite);
    idx = (idx + 1) % positions.length;
    x = positions[idx].x;
    y = positions[idx].y;
  }
};

const init = async () => {
  const canvasSetUp = await setUpCanvas();
  loop(canvasSetUp);

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyE") {
      console.log("change");
      positions = getAnimationPositions(ATTACK_ANIMATION);
    } else {
      console.log("change");
      positions = getAnimationPositions(IDLE2_ANIMATION);
    }
  });
};

init();
