const DEFAULT_DESIGN = { width: 900, height: 1273 };
const DESIGN = { ...DEFAULT_DESIGN };
const DEFAULT_BG = "#66ff33";

const state = {
  background: DEFAULT_BG,
  pattern: "solid",
  elements: [],
  selectedId: null,
  zCounter: 1,
  activeStyle: "style-blue-arch",
};

const wordArtStyles = [
  { id: "style-blue-arch", label: "青い立体" },
  { id: "style-rainbow", label: "虹色" },
  { id: "style-gold", label: "金ぴか" },
  { id: "style-outline", label: "白抜き" },
  { id: "style-black-warp", label: "黒ゆがみ" },
  { id: "style-serif-split", label: "謎セリフ" },
  { id: "style-stripe", label: "しましま" },
  { id: "style-purple", label: "紫グラデ" },
  { id: "style-ghost", label: "残像" },
  { id: "style-green", label: "苔3D" },
  { id: "style-gray-chunk", label: "石版" },
  { id: "style-simple", label: "黒太字" },
  { id: "style-red-blue", label: "赤青影" },
  { id: "style-aqua-serif", label: "青セリフ" },
  { id: "style-hollow-italic", label: "斜体白抜き" },
  { id: "style-neon", label: "ネオン" },
  { id: "style-chrome", label: "クローム" },
  { id: "style-fire", label: "炎" },
  { id: "style-candy", label: "キャンディ" },
  { id: "style-checker", label: "市松" },
  { id: "style-offset", label: "ズレ影" },
];

const swatches = [
  "#66ff33",
  "#00ffff",
  "#ffff00",
  "#ff00ff",
  "#00ff00",
  "#ff0000",
  "#0000ff",
  "#ff9900",
  "#ffffff",
  "#c0c0c0",
  "#111111",
  "#66ffcc",
  "#ff66cc",
];

const defaultFont = "Arial Black";
const fontStacks = {
  "Arial Black": '"Arial Black", Impact, sans-serif',
  Impact: 'Impact, "Arial Black", sans-serif',
  "Comic Sans MS": '"Comic Sans MS", "Comic Sans", cursive',
  "Soei Kaku Pop": '"創英角ポップ体", "HG創英角ポップ体", "HGP創英角ポップ体", "HGSoeiKakupoptai", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
  Georgia: 'Georgia, "Times New Roman", serif',
  "Times New Roman": '"Times New Roman", serif',
  "Hiragino Mincho ProN": '"Hiragino Mincho ProN", "Yu Mincho", serif',
  "Hiragino Kaku Gothic ProN": '"Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
  serif: "serif",
  "sans-serif": "sans-serif",
  monospace: "monospace",
};

const poster = document.querySelector("#poster");
const bgColor = document.querySelector("#bgColor");
const bgPattern = document.querySelector("#bgPattern");
const posterWidth = document.querySelector("#posterWidth");
const posterHeight = document.querySelector("#posterHeight");
const bgSwatches = document.querySelector("#bgSwatches");
const wordArtGrid = document.querySelector("#wordArtGrid");
const emptySelection = document.querySelector("#emptySelection");
const selectionControls = document.querySelector("#selectionControls");
const selectedText = document.querySelector("#selectedText");
const selectedColor = document.querySelector("#selectedColor");
const selectedTextColor = document.querySelector("#selectedTextColor");
const curveRange = document.querySelector("#curveRange");
const curveNumber = document.querySelector("#curveNumber");
const shapeSelect = document.querySelector("#shapeSelect");
const shapeAmountRange = document.querySelector("#shapeAmountRange");
const shapeAmountNumber = document.querySelector("#shapeAmountNumber");
const rotateRange = document.querySelector("#rotateRange");
const rotateNumber = document.querySelector("#rotateNumber");
const sizeRange = document.querySelector("#sizeRange");
const depthRange = document.querySelector("#depthRange");
const exportCanvas = document.querySelector("#exportCanvas");

function uid() {
  return `item-${Math.random().toString(36).slice(2, 9)}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readNumberInput(input, fallback, min, max) {
  const value = Number(input.value);
  if (!Number.isFinite(value)) return fallback;
  return clamp(Math.round(value), min, max);
}

function cssFont(font) {
  return fontStacks[font] || fontStacks[defaultFont];
}

function isPopFont(font) {
  return font === "Soei Kaku Pop";
}

function wordArtDisplayText(item) {
  return item.text || "WordArt";
}

function wordArtFont(style) {
  if (["style-serif-split", "style-ghost", "style-gray-chunk", "style-aqua-serif"].includes(style)) {
    return "Georgia";
  }
  return defaultFont;
}

function wordArtSvgPaint(item, id) {
  const custom = item.customTextColor ? item.textColor || "#ffffff" : null;
  if (custom) {
    return {
      defs: "",
      fill: custom,
      stroke: "#111111",
      shadow: "drop-shadow(4px 5px 0 rgba(0,0,0,.35))",
    };
  }
  if (item.style === "style-rainbow") {
    return {
      defs: `<linearGradient id="${id}-paint" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#e62958"/><stop offset="25%" stop-color="#ff8c00"/><stop offset="50%" stop-color="#ffe000"/><stop offset="75%" stop-color="#00aa44"/><stop offset="100%" stop-color="#0075ff"/></linearGradient>`,
      fill: `url(#${id}-paint)`,
      stroke: "rgba(0,0,0,.12)",
      shadow: "drop-shadow(3px 4px 0 rgba(0,0,0,.28))",
    };
  }
  if (item.style === "style-gold") {
    return {
      defs: `<linearGradient id="${id}-paint" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff05a"/><stop offset="45%" stop-color="#ffb000"/><stop offset="56%" stop-color="#7a290b"/><stop offset="100%" stop-color="#c5631a"/></linearGradient>`,
      fill: `url(#${id}-paint)`,
      stroke: "#6b2b00",
      shadow: "drop-shadow(6px 7px 0 #5b2500)",
    };
  }
  const styleMap = {
    "style-blue-arch": ["#31a8ff", "#1456b5", "drop-shadow(6px 6px 0 #07508f)"],
    "style-outline": ["#ffffff", "#7c7c7c", "drop-shadow(2px 2px 0 #bdbdbd)"],
    "style-black-warp": ["#070707", "#070707", "drop-shadow(3px 3px 0 #b9b9b9)"],
    "style-serif-split": ["#008cff", "#4c4c4c", "drop-shadow(3px 3px 0 #f29a3b)"],
    "style-purple": ["#a74dff", "#114fe8", "drop-shadow(3px 4px 0 #6ee7ff)"],
    "style-ghost": ["rgba(195,224,214,.72)", "rgba(32,82,58,.7)", "drop-shadow(16px 14px 0 rgba(32,82,58,.72))"],
    "style-green": ["#0e3b16", "#81a685", "drop-shadow(5px 5px 0 #071d0b)"],
    "style-gray-chunk": ["#f2f2f2", "#676767", "drop-shadow(8px 8px 0 #555555)"],
    "style-simple": ["#000000", "#000000", "drop-shadow(2px 2px 0 #dcdcdc)"],
    "style-red-blue": ["#0a75c8", "#095190", "drop-shadow(5px 5px 0 #e12727)"],
    "style-aqua-serif": ["#2b8ed2", "#eaffff", "drop-shadow(2px 2px 0 #eaffff)"],
    "style-hollow-italic": ["#ffffff", "#6f6f6f", "drop-shadow(2px 2px 0 #b4b4b4)"],
    "style-neon": ["#ffff00", "#ff00ff", "drop-shadow(0 0 9px #00ffff)"],
    "style-chrome": ["#cfcfcf", "#111111", "drop-shadow(5px 5px 0 #7a7a7a)"],
    "style-fire": ["#ff7a00", "#7a0000", "drop-shadow(4px 6px 0 #2b0000)"],
    "style-candy": ["#ff66dd", "#ff00cc", "drop-shadow(3px 3px 0 #ffff00)"],
    "style-checker": ["#ffffff", "#111111", "drop-shadow(3px 3px 0 #ff0000)"],
    "style-offset": ["#ffffff", "#111111", "drop-shadow(6px 6px 0 #000000)"],
  };
  const [fill, stroke, shadow] = styleMap[item.style] || styleMap["style-simple"];
  return { defs: "", fill, stroke, shadow };
}

function curvedWordArtMarkup(item) {
  const text = escapeHtml(wordArtDisplayText(item));
  const curve = Number(item.curve || 0);
  if (Math.abs(curve) < 2) {
    return `<span class="wordart ${item.style}${item.customTextColor ? " custom-wordart" : ""}">${text}</span>`;
  }
  const id = `curve-${item.id}`;
  const y = curve > 0 ? 128 : 56;
  const controlY = curve > 0 ? 18 : 166;
  const paint = wordArtSvgPaint(item, id);
  return `<svg class="wordart-svg" viewBox="0 0 760 190" aria-label="${text}">
    <defs>${paint.defs}<path id="${id}" d="M 38 ${y} Q 380 ${controlY} 722 ${y}" /></defs>
    <text class="wordart-svg-text" fill="${paint.fill}" stroke="${paint.stroke}" style="filter:${paint.shadow};">
      <textPath href="#${id}" startOffset="50%" text-anchor="middle">${text}</textPath>
    </text>
  </svg>`;
}

function shapeClip(shape) {
  switch (shape) {
    case "ellipse":
      return "ellipse(50% 50% at 50% 50%)";
    case "jagged":
      return "polygon(50% 0,58% 13%,72% 4%,76% 20%,94% 14%,88% 33%,100% 44%,86% 53%,98% 69%,80% 72%,84% 94%,65% 84%,55% 100%,45% 84%,28% 96%,31% 76%,8% 82%,18% 62%,0 50%,18% 38%,7% 18%,29% 24%,36% 5%,46% 17%)";
    case "star":
      return "polygon(50% 0,58% 32%,86% 12%,70% 41%,100% 48%,69% 57%,88% 84%,60% 68%,50% 100%,40% 68%,12% 84%,31% 57%,0 48%,30% 41%,14% 12%,42% 32%)";
    case "arrow":
      return "polygon(0 24%,62% 24%,62% 0,100% 50%,62% 100%,62% 76%,0 76%)";
    case "ribbon":
      return "polygon(0 0,100% 0,92% 50%,100% 100%,0 100%,8% 50%)";
    default:
      return "";
  }
}

function selected() {
  return state.elements.find((item) => item.id === state.selectedId) || null;
}

function posterScale() {
  return poster.getBoundingClientRect().width / DESIGN.width;
}

function applyPosterGeometry() {
  poster.style.aspectRatio = `${DESIGN.width} / ${DESIGN.height}`;
  poster.style.width = `min(calc(58vh * ${DESIGN.width / DESIGN.height}), 72vw, 620px)`;
  exportCanvas.width = DESIGN.width;
  exportCanvas.height = DESIGN.height;
  posterWidth.value = DESIGN.width;
  posterHeight.value = DESIGN.height;
}

function setPosterSize(width, height) {
  DESIGN.width = clamp(width, 240, 2400);
  DESIGN.height = clamp(height, 240, 2400);
  applyPosterGeometry();
  drawPoster();
}

function patternCss(pattern) {
  switch (pattern) {
    case "checker":
      return "linear-gradient(45deg, rgba(255,255,255,.8) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.8) 75%), linear-gradient(45deg, rgba(255,255,255,.8) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.8) 75%)";
    case "dots":
      return "radial-gradient(circle, rgba(255,0,204,.85) 0 9px, transparent 10px)";
    case "stripes":
      return "repeating-linear-gradient(45deg, rgba(255,255,0,.75) 0 18px, rgba(0,0,255,.35) 18px 36px)";
    case "burst":
      return "conic-gradient(from 0deg, rgba(255,255,255,.8) 0 10deg, transparent 10deg 20deg)";
    default:
      return "none";
  }
}

function applyBackground() {
  applyPosterGeometry();
  poster.style.setProperty("--poster-bg", state.background);
  poster.style.setProperty("--poster-pattern", patternCss(state.pattern));
  poster.style.backgroundSize = state.pattern === "checker" ? "72px 72px" : state.pattern === "dots" ? "42px 42px" : "auto";
}

function createWordArt(text = "", style = state.activeStyle) {
  const item = {
    id: uid(),
    type: "wordart",
    text,
    style,
    x: 145 + Math.random() * 90,
    y: 126 + Math.random() * 130,
    w: 520,
    h: 120,
    size: 86,
    rotate: -8 + Math.random() * 16,
    color: "#ff00cc",
    textColor: "#ffffff",
    font: defaultFont,
    curve: 0,
    depth: 8,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createBubble() {
  const item = {
    id: uid(),
    type: "bubble",
    text: "",
    x: 506,
    y: 232,
    w: 285,
    h: 142,
    size: 34,
    rotate: 8,
    color: "#ffff00",
    textColor: "#ff0000",
    font: defaultFont,
    depth: 4,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createFace() {
  const item = {
    id: uid(),
    type: "face",
    text: "",
    x: 565,
    y: 704,
    w: 190,
    h: 190,
    size: 42,
    rotate: -7,
    color: "#fff600",
    textColor: "#000000",
    font: defaultFont,
    depth: 5,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createStar() {
  const item = {
    id: uid(),
    type: "star",
    text: "",
    x: 92,
    y: 690,
    w: 200,
    h: 200,
    size: 36,
    rotate: 13,
    color: "#ff0000",
    textColor: "#ffffff",
    font: defaultFont,
    depth: 5,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createMarquee() {
  const item = {
    id: uid(),
    type: "marquee",
    text: "",
    x: 248,
    y: 1028,
    w: 404,
    h: 76,
    size: 34,
    rotate: -2,
    color: "#ff0000",
    textColor: "#ffff00",
    font: "Comic Sans MS",
    depth: 3,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createCylinder() {
  const item = {
    id: uid(),
    type: "cylinder",
    text: "",
    x: 78,
    y: 58,
    w: 740,
    h: 210,
    size: 78,
    rotate: -1,
    color: "#16a6d3",
    textColor: "#ffffff",
    font: "Hiragino Kaku Gothic ProN",
    depth: 4,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createLabel() {
  const colors = ["#ff0000", "#ffff00", "#0058ff", "#ff00cc"];
  const index = state.elements.filter((item) => item.type === "label").length % colors.length;
  const item = {
    id: uid(),
    type: "label",
    text: "",
    x: 92 + index * 80,
    y: 910 + index * 18,
    w: 260,
    h: 82,
    size: 46,
    rotate: index % 2 === 0 ? -2 : 2,
    color: colors[index],
    textColor: index === 1 ? "#111111" : "#ffffff",
    font: "Hiragino Kaku Gothic ProN",
    depth: 10,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createOval() {
  const item = {
    id: uid(),
    type: "oval",
    text: "",
    x: 470,
    y: 640,
    w: 380,
    h: 188,
    size: 31,
    rotate: 4,
    color: "#17a7d5",
    textColor: "#ffffff",
    font: "Hiragino Kaku Gothic ProN",
    depth: 3,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createShockFace() {
  const item = {
    id: uid(),
    type: "shock-face",
    text: "",
    x: 560,
    y: 1040,
    w: 120,
    h: 120,
    size: 30,
    rotate: -3,
    color: "#3fb6dc",
    textColor: "#000000",
    font: defaultFont,
    depth: 4,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createDoodleFace() {
  const item = {
    id: uid(),
    type: "doodle-face",
    text: "",
    x: 58,
    y: 1072,
    w: 150,
    h: 190,
    size: 34,
    rotate: 0,
    color: "#ff00cc",
    textColor: "#111111",
    font: "Hiragino Mincho ProN",
    depth: 3,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createRibbon() {
  const item = {
    id: uid(),
    type: "ribbon",
    text: "",
    x: 210,
    y: 320,
    w: 420,
    h: 88,
    size: 48,
    rotate: -18,
    color: "#ff0000",
    textColor: "#ffffff",
    font: "Soei Kaku Pop",
    depth: 9,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createArrow() {
  const item = {
    id: uid(),
    type: "arrow",
    text: "",
    x: 430,
    y: 500,
    w: 310,
    h: 150,
    size: 42,
    rotate: 8,
    color: "#ff0000",
    textColor: "#ffffff",
    font: defaultFont,
    depth: 7,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createStamp() {
  const item = {
    id: uid(),
    type: "stamp",
    text: "",
    x: 112,
    y: 516,
    w: 210,
    h: 132,
    size: 50,
    rotate: -12,
    color: "#ffffff",
    textColor: "#ff0000",
    font: defaultFont,
    depth: 4,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createPopup() {
  const item = {
    id: uid(),
    type: "popup",
    text: "",
    x: 300,
    y: 760,
    w: 330,
    h: 172,
    size: 28,
    rotate: 2,
    color: "#c0c0c0",
    textColor: "#000000",
    font: "monospace",
    depth: 8,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function createScribble() {
  const item = {
    id: uid(),
    type: "scribble",
    text: "",
    x: 90,
    y: 1048,
    w: 300,
    h: 120,
    size: 42,
    rotate: -5,
    color: "#ffffff",
    textColor: "#111111",
    font: "Hiragino Mincho ProN",
    depth: 3,
    z: state.zCounter++,
  };
  state.elements.push(item);
  selectItem(item.id);
}

function buildWordArtGrid() {
  wordArtGrid.innerHTML = "";
  wordArtStyles.forEach((style) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wordart-preset";
    button.title = style.label;
    button.dataset.style = style.id;
    button.innerHTML = `<span class="wordart ${style.id}">WordArt</span>`;
    button.addEventListener("click", () => {
      state.activeStyle = style.id;
      createWordArt("", style.id);
    });
    wordArtGrid.appendChild(button);
  });
}

function buildSwatches() {
  bgSwatches.innerHTML = "";
  swatches.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.style.background = color;
    button.title = color;
    button.addEventListener("click", () => {
      state.background = color;
      bgColor.value = color;
      applyBackground();
      drawPoster();
    });
    bgSwatches.appendChild(button);
  });
}

function itemMarkup(item) {
  if (item.type === "wordart") {
    return curvedWordArtMarkup(item);
  }
  if (item.type === "bubble") {
    return `<div class="bubble">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "star") {
    return `<div class="star">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "marquee") {
    return `<div class="marquee">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "cylinder") {
    return `<div class="cylinder"><span>${escapeHtml(item.text)}</span></div>`;
  }
  if (item.type === "label") {
    return `<div class="block-label">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "oval") {
    return `<div class="oval-callout">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "ribbon") {
    return `<div class="ribbon">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "arrow") {
    return `<div class="arrow">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "stamp") {
    return `<div class="stamp">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "popup") {
    return `<div class="popup">
      <div class="popup-title">Microsoft Word</div>
      <div class="popup-body"><span class="popup-icon">!</span><span>${escapeHtml(item.text)}</span></div>
      <div class="popup-ok">OK</div>
    </div>`;
  }
  if (item.type === "scribble") {
    return `<div class="scribble">${escapeHtml(item.text)}</div>`;
  }
  if (item.type === "shock-face") {
    return `<div class="shock-face" aria-label="驚き顔">
      <svg viewBox="0 0 160 160" role="img">
        <path d="M55 32 C70 10 103 14 112 37 L119 56 C129 58 139 65 142 77 C147 96 131 114 114 111 L108 142 L61 142 L58 111 C38 113 22 96 27 77 C30 65 40 58 51 56 Z" fill="${item.color}" stroke="#111" stroke-width="4" />
        <path d="M56 28 L45 10 M79 22 L78 3 M104 27 L120 10" stroke="#00a7ff" stroke-width="6" stroke-linecap="round" />
        <circle cx="54" cy="72" r="14" fill="#fff" stroke="#111" stroke-width="3" />
        <circle cx="107" cy="72" r="14" fill="#fff" stroke="#111" stroke-width="3" />
        <circle cx="58" cy="76" r="5" fill="#111" />
        <circle cx="103" cy="76" r="5" fill="#111" />
        <rect x="67" y="92" width="29" height="38" rx="4" fill="#bd1026" stroke="#111" stroke-width="4" />
        <path d="M64 46 L50 58 M96 58 L112 45" stroke="#111" stroke-width="5" stroke-linecap="round" />
        <path d="M48 118 C39 103 35 91 34 77 M122 118 C132 103 136 91 136 77" stroke="#f4c7ad" stroke-width="8" stroke-linecap="round" />
      </svg>
    </div>`;
  }
  if (item.type === "doodle-face") {
    return `<div class="doodle-face" aria-label="手描き顔">
      <svg viewBox="0 0 200 240" role="img">
        <ellipse cx="82" cy="138" rx="68" ry="92" fill="${item.color}" stroke="#111" stroke-width="5" />
        <ellipse cx="58" cy="126" rx="8" ry="16" fill="none" stroke="#111" stroke-width="5" />
        <ellipse cx="106" cy="126" rx="8" ry="16" fill="none" stroke="#111" stroke-width="5" />
        <path d="M47 174 Q82 205 117 174" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" />
        <path d="M142 94 L194 54 M144 126 L196 126" stroke="#111" stroke-width="3" />
        <text x="158" y="106" font-family='${cssFont(item.font)}' font-size="28" fill="${item.textColor}">${escapeHtml(item.text)}</text>
      </svg>
    </div>`;
  }
  return `<div class="face" aria-label="憎たらしい顔">
    <svg viewBox="0 0 200 200" role="img">
      <circle cx="100" cy="100" r="86" fill="${item.color}" stroke="#000" stroke-width="7" />
      <path d="M52 72 Q68 55 84 72" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round" />
      <path d="M116 72 Q132 55 148 72" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round" />
      <circle cx="68" cy="92" r="10" fill="#000" />
      <circle cx="132" cy="92" r="10" fill="#000" />
      <path d="M55 127 Q100 166 145 127" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round" />
      <path d="M73 130 Q100 147 127 130" fill="none" stroke="#ff0000" stroke-width="4" stroke-linecap="round" />
    </svg>
  </div>`;
}

function drawPoster() {
  applyBackground();
  const scale = posterScale();
  poster.innerHTML = "";
  state.elements
    .slice()
    .sort((a, b) => a.z - b.z)
    .forEach((item) => {
      const el = document.createElement("div");
      el.className = `poster-item${item.id === state.selectedId ? " selected" : ""}`;
      el.dataset.id = item.id;
      el.style.left = `${item.x * scale}px`;
      el.style.top = `${item.y * scale}px`;
      el.style.zIndex = item.z;
      el.style.transform = `rotate(${item.rotate}deg)`;
      el.style.fontSize = `${item.size * scale}px`;
      el.innerHTML = itemMarkup(item);

      const inner = el.firstElementChild;

      if (item.type === "wordart") {
        inner.style.fontSize = `${item.size * scale}px`;
        if (item.customTextColor) {
          inner.style.color = item.textColor || "#111111";
          inner.style.setProperty("--custom-text", item.textColor || "#ffffff");
        }
      } else {
        inner.style.fontFamily = cssFont(item.font);
        inner.style.color = item.textColor || "#111111";
        inner.style.setProperty("--custom-text", item.textColor || "#ffffff");
        inner.classList.toggle("pop-font", isPopFont(item.font));
      }

      if (item.type !== "wordart") {
        inner.style.width = `${item.w * scale}px`;
        inner.style.height = `${item.h * scale}px`;
        inner.style.fontSize = `${item.size * scale}px`;
        if (["bubble", "star", "marquee", "label", "oval", "arrow", "stamp", "popup"].includes(item.type)) {
          inner.style.background = item.color;
        }
        if (item.shape && item.shape !== "auto") {
          inner.classList.add("shape-override", `shape-${item.shape}`);
          inner.style.clipPath = shapeClip(item.shape);
          inner.style.borderRadius = item.shape === "rounded" ? `${item.shapeAmount || 50}px` : item.shape === "ellipse" ? "50%" : "";
          inner.style.setProperty("--shape-amount", `${item.shapeAmount || 50}%`);
        }
      }

      if (item.id === state.selectedId) {
        const handle = document.createElement("span");
        handle.className = "resize-handle";
        handle.addEventListener("pointerdown", startResize);
        el.appendChild(handle);
      }

      el.addEventListener("pointerdown", startDrag);
      poster.appendChild(el);
    });
  syncControls();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function selectItem(id) {
  state.selectedId = id;
  const item = selected();
  if (item) {
    item.z = Math.max(item.z, state.zCounter++);
  }
  drawPoster();
}

function syncControls() {
  const item = selected();
  selectionControls.hidden = !item;
  emptySelection.hidden = !!item;
  if (!item) return;

  const hasEditableText = !["face", "shock-face"].includes(item.type);
  selectedText.disabled = !hasEditableText;
  selectedTextColor.disabled = !hasEditableText;
  selectedText.value = item.text || "";
  selectedColor.value = item.color || "#ff00cc";
  selectedTextColor.value = item.textColor || "#111111";
  curveRange.value = item.curve || 0;
  curveNumber.value = item.curve || 0;
  curveRange.disabled = item.type !== "wordart";
  curveNumber.disabled = item.type !== "wordart";
  shapeSelect.value = item.shape || "auto";
  shapeAmountRange.value = item.shapeAmount ?? 50;
  shapeAmountNumber.value = item.shapeAmount ?? 50;
  shapeSelect.disabled = item.type === "wordart";
  shapeAmountRange.disabled = item.type === "wordart" || !item.shape || item.shape === "auto";
  shapeAmountNumber.disabled = item.type === "wordart" || !item.shape || item.shape === "auto";
  rotateRange.value = item.rotate || 0;
  rotateNumber.value = item.rotate || 0;
  sizeRange.value = item.size || 72;
  depthRange.value = item.depth || 0;
  depthRange.disabled = item.type !== "wordart";
}

function updateSelected(patch) {
  const item = selected();
  if (!item) return;
  Object.assign(item, patch);
  drawPoster();
}

function pointerPoint(event) {
  const rect = poster.getBoundingClientRect();
  const scale = rect.width / DESIGN.width;
  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale,
  };
}

function startDrag(event) {
  if (event.target.classList.contains("resize-handle")) return;
  const itemEl = event.currentTarget;
  const item = state.elements.find((entry) => entry.id === itemEl.dataset.id);
  if (!item) return;
  event.preventDefault();
  selectItem(item.id);
  const start = pointerPoint(event);
  const origin = { x: item.x, y: item.y };

  function move(moveEvent) {
    const current = pointerPoint(moveEvent);
    item.x = clamp(origin.x + current.x - start.x, -120, DESIGN.width - 40);
    item.y = clamp(origin.y + current.y - start.y, -80, DESIGN.height - 40);
    drawPoster();
  }

  function stop() {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  }

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop, { once: true });
}

function startResize(event) {
  const itemEl = event.currentTarget.closest(".poster-item");
  const item = state.elements.find((entry) => entry.id === itemEl.dataset.id);
  if (!item) return;
  event.preventDefault();
  event.stopPropagation();
  const start = pointerPoint(event);
  const origin = { w: item.w, h: item.h, size: item.size };

  function move(moveEvent) {
    const current = pointerPoint(moveEvent);
    const delta = current.x - start.x;
    if (item.type === "wordart") {
      item.size = clamp(origin.size + delta / 4, 18, 180);
    } else {
      item.w = clamp(origin.w + delta, 80, 720);
      item.h = clamp(origin.h + (current.y - start.y), 50, 680);
      item.size = clamp(origin.size + delta / 8, 16, 120);
    }
    drawPoster();
  }

  function stop() {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  }

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", stop, { once: true });
}

function randomizePositions() {
  state.elements.forEach((item) => {
    item.x = clamp(item.x + (Math.random() - 0.5) * 170, -90, DESIGN.width - 90);
    item.y = clamp(item.y + (Math.random() - 0.5) * 170, -70, DESIGN.height - 70);
    item.rotate = clamp(item.rotate + (Math.random() - 0.5) * 28, -35, 35);
  });
  drawPoster();
}

function clashColors() {
  const loud = ["#ff00ff", "#00ffff", "#ffff00", "#00ff00", "#ff3300", "#0000ff"];
  state.background = loud[Math.floor(Math.random() * loud.length)];
  bgColor.value = state.background;
  state.pattern = ["checker", "dots", "stripes", "burst"][Math.floor(Math.random() * 4)];
  bgPattern.value = state.pattern;
  state.elements.forEach((item, index) => {
    item.color = loud[(index + 2) % loud.length];
    item.textColor = loud[(index + 4) % loud.length];
  });
  drawPoster();
}

function idiotMode() {
  state.background = "#ffffff";
  state.pattern = "solid";
  bgColor.value = state.background;
  bgPattern.value = state.pattern;
  state.elements = [];
  state.zCounter = 1;
  createFace();
  const face = selected();
  Object.assign(face, { x: 356, y: 342, w: 220, h: 220, rotate: 0 });
  createWordArt("You are an idiot!", "style-simple");
  const text = selected();
  Object.assign(text, { x: 105, y: 602, size: 84, rotate: 0 });
  createMarquee();
  const marquee = selected();
  Object.assign(marquee, { x: 190, y: 762, w: 520, h: 86, text: "HAHAHAHAHA" });
  selectItem(text.id);
}

function demo() {
  state.elements = [];
  state.zCounter = 1;
  state.background = "#52ff27";
  state.pattern = "solid";
  bgColor.value = state.background;
  bgPattern.value = state.pattern;

  createCylinder();
  Object.assign(selected(), { x: 54, y: 40, text: "6月29日\n佃煮の日", w: 792, h: 228, size: 88, rotate: -1 });

  createBubble();
  Object.assign(selected(), { x: 42, y: 282, text: "東京発祥", w: 420, h: 220, size: 52, rotate: -14, color: "#ffff00", textColor: "#ff0000", font: "Hiragino Mincho ProN" });

  createOval();
  Object.assign(selected(), { x: 438, y: 632, w: 404, h: 206, size: 33, rotate: 5 });

  createLabel();
  Object.assign(selected(), { x: 54, y: 880, text: "あなたは", w: 220, h: 82, color: "#ff0000", textColor: "#ffffff", size: 48, rotate: 0 });
  createLabel();
  Object.assign(selected(), { x: 150, y: 982, text: "のり派？", w: 244, h: 78, color: "#ffff00", textColor: "#111111", size: 48, rotate: -2 });
  createLabel();
  Object.assign(selected(), { x: 410, y: 982, text: "あさり派？", w: 275, h: 78, color: "#0058ff", textColor: "#ffffff", size: 47, rotate: 1 });
  createLabel();
  Object.assign(selected(), { x: 704, y: 984, text: "こんぶ派？", w: 166, h: 78, color: "#ff00cc", textColor: "#ffffff", size: 37, rotate: 0 });

  createShockFace();
  Object.assign(selected(), { x: 486, y: 1080, w: 108, h: 108, rotate: -2 });
  createShockFace();
  Object.assign(selected(), { x: 622, y: 1083, w: 108, h: 108, rotate: 2 });
  createShockFace();
  Object.assign(selected(), { x: 760, y: 1084, w: 108, h: 108, rotate: -1 });

  createDoodleFace();
  Object.assign(selected(), { x: 24, y: 1064, w: 174, h: 204, text: "オイシイヨ", size: 34, rotate: -2 });

  createWordArt("P.S.\n佃煮の生みの親は本能寺の変！？", "style-simple");
  Object.assign(selected(), { x: 210, y: 1168, size: 44, rotate: 0, textColor: "#111111", customTextColor: true, font: "Hiragino Kaku Gothic ProN" });
  selectItem(state.elements[0].id);
}

function clearPoster() {
  state.elements = [];
  state.selectedId = null;
  state.zCounter = 1;
  DESIGN.width = DEFAULT_DESIGN.width;
  DESIGN.height = DEFAULT_DESIGN.height;
  state.background = DEFAULT_BG;
  state.pattern = "solid";
  bgColor.value = state.background;
  bgPattern.value = state.pattern;
  drawPoster();
}

function duplicateSelected() {
  const item = selected();
  if (!item) return;
  const copy = structuredClone(item);
  copy.id = uid();
  copy.x += 36;
  copy.y += 36;
  copy.z = state.zCounter++;
  state.elements.push(copy);
  selectItem(copy.id);
}

function deleteSelected() {
  if (!state.selectedId) return;
  state.elements = state.elements.filter((item) => item.id !== state.selectedId);
  state.selectedId = null;
  drawPoster();
}

function bringFront() {
  const item = selected();
  if (!item) return;
  item.z = state.zCounter++;
  drawPoster();
}

function sendBack() {
  const item = selected();
  if (!item) return;
  item.z = 0;
  drawPoster();
}

function drawBackground(ctx) {
  ctx.fillStyle = state.background;
  ctx.fillRect(0, 0, DESIGN.width, DESIGN.height);
  if (state.pattern === "checker") {
    for (let y = 0; y < DESIGN.height; y += 72) {
      for (let x = 0; x < DESIGN.width; x += 72) {
        ctx.fillStyle = "rgba(255,255,255,.78)";
        ctx.fillRect(x, y, 36, 36);
        ctx.fillRect(x + 36, y + 36, 36, 36);
      }
    }
  }
  if (state.pattern === "dots") {
    ctx.fillStyle = "rgba(255,0,204,.82)";
    for (let y = 21; y < DESIGN.height; y += 42) {
      for (let x = 21; x < DESIGN.width; x += 42) {
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  if (state.pattern === "stripes") {
    ctx.save();
    ctx.rotate(-Math.PI / 4);
    const span = Math.hypot(DESIGN.width, DESIGN.height) * 2;
    for (let x = -span; x < span; x += 36) {
      ctx.fillStyle = x % 72 === 0 ? "rgba(255,255,0,.72)" : "rgba(0,0,255,.34)";
      ctx.fillRect(x, -span, 18, span * 2);
    }
    ctx.restore();
  }
  if (state.pattern === "burst") {
    ctx.save();
    ctx.translate(DESIGN.width / 2, DESIGN.height / 2);
    const radius = Math.hypot(DESIGN.width, DESIGN.height);
    for (let i = 0; i < 36; i++) {
      ctx.rotate((Math.PI * 2) / 36);
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,.75)" : "rgba(255,255,255,0)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, -60);
      ctx.lineTo(radius, 60);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
}

function withItemTransform(ctx, item, draw) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate((item.rotate * Math.PI) / 180);
  draw();
  ctx.restore();
}

function setExportFont(ctx, item, family = item.font || defaultFont) {
  ctx.font = `900 ${item.size}px ${cssFont(family)}`;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.lineJoin = "round";
}

function canvasWordArtColors(item, index = 0, total = 1) {
  if (item.customTextColor) return [item.textColor || "#ffffff", "#111111", "#111111"];
  if (item.style === "style-rainbow") {
    const colors = ["#e62958", "#ff8c00", "#ffe000", "#00aa44", "#0075ff"];
    return [colors[Math.round((index / Math.max(1, total - 1)) * (colors.length - 1))], "rgba(0,0,0,.12)", "rgba(0,0,0,.28)"];
  }
  if (item.style === "style-gold") return ["#ffb000", "#6b2b00", "#5b2500"];
  const styleMap = {
    "style-blue-arch": ["#31a8ff", "#1456b5", "#07508f"],
    "style-outline": ["#ffffff", "#7c7c7c", "#bdbdbd"],
    "style-black-warp": ["#070707", "#070707", "#b9b9b9"],
    "style-serif-split": ["#008cff", "#4c4c4c", "#f29a3b"],
    "style-purple": ["#a74dff", "#114fe8", "#6ee7ff"],
    "style-ghost": ["rgba(195,224,214,.7)", "rgba(32,82,58,.7)", "rgba(32,82,58,.7)"],
    "style-green": ["#0e3b16", "#81a685", "#071d0b"],
    "style-gray-chunk": ["#f2f2f2", "#676767", "#555555"],
    "style-simple": ["#000000", "#000000", "#dcdcdc"],
    "style-red-blue": ["#0a75c8", "#095190", "#e12727"],
    "style-aqua-serif": ["#2b8ed2", "#eaffff", "#0a6c9d"],
    "style-hollow-italic": ["#ffffff", "#6f6f6f", "#b4b4b4"],
    "style-neon": ["#ffff00", "#ff00ff", "#0000ff"],
    "style-chrome": ["#cfcfcf", "#111111", "#7a7a7a"],
    "style-fire": ["#ff7a00", "#7a0000", "#2b0000"],
    "style-candy": ["#ff66dd", "#ff00cc", "#ffff00"],
    "style-checker": ["#ffffff", "#111111", "#ff0000"],
    "style-offset": ["#ffffff", "#111111", "#00ffff"],
  };
  return styleMap[item.style] || styleMap["style-simple"];
}

function drawCurvedWordArt(ctx, item) {
  const text = wordArtDisplayText(item);
  const chars = Array.from(text);
  const curve = Number(item.curve || 0);
  const span = clamp(Math.abs(curve) / 100, 0.08, 1) * Math.PI * 0.95;
  const widths = chars.map((char) => ctx.measureText(char).width);
  const textWidth = Math.max(1, widths.reduce((sum, width) => sum + width, 0));
  const radius = Math.max(textWidth / span, item.size * 2.2);
  const centerX = textWidth / 2;
  const centerY = curve > 0 ? radius + item.size * 0.55 : -radius + item.size * 0.75;
  let cursor = 0;

  ctx.textBaseline = "middle";
  chars.forEach((char, index) => {
    const mid = cursor + widths[index] / 2;
    const angle = -span / 2 + (mid / textWidth) * span;
    const x = centerX + Math.sin(angle) * radius;
    const y = curve > 0 ? centerY - Math.cos(angle) * radius : centerY + Math.cos(angle) * radius;
    const rotation = curve > 0 ? angle : -angle;
    const [fill, stroke, shadow] = canvasWordArtColors(item, index, chars.length);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = shadow;
    ctx.fillText(char, 4, 5);
    ctx.lineWidth = item.style.includes("outline") || item.style.includes("hollow") ? 3 : 2;
    ctx.strokeStyle = stroke;
    ctx.strokeText(char, 0, 0);
    ctx.fillStyle = fill;
    ctx.fillText(char, 0, 0);
    ctx.restore();
    cursor += widths[index];
  });
}

function drawWordArt(ctx, item) {
  withItemTransform(ctx, item, () => {
    setExportFont(ctx, item, wordArtFont(item.style));
    if (Math.abs(Number(item.curve || 0)) >= 2) {
      drawCurvedWordArt(ctx, item);
      return;
    }
    const text = wordArtDisplayText(item);
    const depth = item.depth || 0;
    const gradient = ctx.createLinearGradient(0, 0, Math.max(220, ctx.measureText(text).width), 0);

    if (item.customTextColor) {
      ctx.fillStyle = "#111111";
      for (let i = depth; i > 0; i -= 2) ctx.fillText(text, i, i);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#111111";
      ctx.strokeText(text, 0, 0);
      ctx.fillStyle = item.textColor || "#ffffff";
      ctx.fillText(text, 0, 0);
      return;
    }

    if (item.style === "style-rainbow") {
      ["#e62958", "#ff8c00", "#ffe000", "#00aa44", "#0075ff"].forEach((color, index) => gradient.addColorStop(index / 4, color));
      ctx.fillStyle = gradient;
      ctx.shadowColor = "rgba(0,0,0,.25)";
      ctx.shadowOffsetX = depth / 2;
      ctx.shadowOffsetY = depth / 2;
      ctx.fillText(text, 0, 0);
      return;
    }

    if (item.style === "style-gold") {
      const gold = ctx.createLinearGradient(0, 0, 0, item.size);
      gold.addColorStop(0, "#fff05a");
      gold.addColorStop(0.45, "#ffb000");
      gold.addColorStop(0.56, "#7a290b");
      gold.addColorStop(1, "#c5631a");
      ctx.fillStyle = "#5b2500";
      for (let i = depth; i > 0; i--) ctx.fillText(text, i, i);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#6b2b00";
      ctx.strokeText(text, 0, 0);
      ctx.fillStyle = gold;
      ctx.fillText(text, 0, 0);
      return;
    }

    if (item.style === "style-purple") {
      gradient.addColorStop(0, "#114fe8");
      gradient.addColorStop(1, "#ff49da");
      ctx.fillStyle = "#6ee7ff";
      ctx.fillText(text, depth / 2, depth / 2);
      ctx.fillStyle = gradient;
      ctx.fillText(text, 0, 0);
      return;
    }

    if (["style-chrome", "style-fire", "style-candy"].includes(item.style)) {
      const paint = ctx.createLinearGradient(0, 0, 0, item.size);
      if (item.style === "style-chrome") {
        paint.addColorStop(0, "#ffffff");
        paint.addColorStop(0.3, "#8f8f8f");
        paint.addColorStop(0.46, "#111111");
        paint.addColorStop(0.56, "#ffffff");
        paint.addColorStop(1, "#4c4c4c");
      }
      if (item.style === "style-fire") {
        paint.addColorStop(0, "#ffff00");
        paint.addColorStop(0.45, "#ff7a00");
        paint.addColorStop(0.72, "#ff0000");
        paint.addColorStop(1, "#650000");
      }
      if (item.style === "style-candy") {
        paint.addColorStop(0, "#ff00cc");
        paint.addColorStop(0.35, "#ffffff");
        paint.addColorStop(0.7, "#00ffff");
        paint.addColorStop(1, "#ff00cc");
      }
      ctx.fillStyle = item.style === "style-chrome" ? "#7a7a7a" : "#2b0000";
      for (let i = depth; i > 0; i -= 2) ctx.fillText(text, i, i);
      ctx.lineWidth = 3;
      ctx.strokeStyle = item.style === "style-fire" ? "#7a0000" : "#111111";
      ctx.strokeText(text, 0, 0);
      ctx.fillStyle = paint;
      ctx.fillText(text, 0, 0);
      return;
    }

    if (item.style === "style-stripe") {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#111111";
      ctx.strokeText(text, 0, 0);
      const metrics = ctx.measureText(text);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, metrics.width + 20, item.size * 1.1);
      ctx.clip();
      for (let y = 0; y < item.size * 1.3; y += 20) {
        ctx.fillStyle = y % 40 === 0 ? "#ffffff" : "#ef4b34";
        ctx.fillRect(0, y, metrics.width + 20, 10);
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, y + 10, metrics.width + 20, 7);
      }
      ctx.globalCompositeOperation = "source-in";
      ctx.fillText(text, 0, 0);
      ctx.restore();
      return;
    }

    const styleMap = {
      "style-blue-arch": ["#31a8ff", "#1456b5", "#07508f"],
      "style-outline": ["#ffffff", "#7c7c7c", "#bdbdbd"],
      "style-black-warp": ["#070707", "#070707", "#b9b9b9"],
      "style-serif-split": ["#008cff", "#4c4c4c", "#f29a3b"],
      "style-ghost": ["rgba(195,224,214,.7)", "rgba(32,82,58,.7)", "rgba(32,82,58,.7)"],
      "style-green": ["#0e3b16", "#81a685", "#071d0b"],
      "style-gray-chunk": ["#f2f2f2", "#676767", "#555555"],
      "style-simple": ["#000000", "#000000", "#dcdcdc"],
      "style-red-blue": ["#0a75c8", "#095190", "#e12727"],
      "style-aqua-serif": ["#2b8ed2", "#eaffff", "#0a6c9d"],
      "style-hollow-italic": ["#ffffff", "#6f6f6f", "#b4b4b4"],
      "style-neon": ["#ffff00", "#ff00ff", "#0000ff"],
      "style-checker": ["#ffffff", "#111111", "#ff0000"],
      "style-offset": ["#ffffff", "#111111", "#00ffff"],
    };
    const [fill, stroke, shadow] = styleMap[item.style] || styleMap["style-simple"];
    ctx.fillStyle = shadow;
    for (let i = depth; i > 0; i -= 2) ctx.fillText(text, i, i);
    ctx.lineWidth = item.style.includes("outline") || item.style.includes("hollow") ? 3 : 2;
    ctx.strokeStyle = stroke;
    ctx.strokeText(text, 0, 0);
    ctx.fillStyle = fill;
    ctx.fillText(text, 0, 0);
  });
}

function starPath(ctx, w, h) {
  const points = [
    [0.5, 0],
    [0.58, 0.32],
    [0.86, 0.12],
    [0.7, 0.41],
    [1, 0.48],
    [0.69, 0.57],
    [0.88, 0.84],
    [0.6, 0.68],
    [0.5, 1],
    [0.4, 0.68],
    [0.12, 0.84],
    [0.31, 0.57],
    [0, 0.48],
    [0.3, 0.41],
    [0.14, 0.12],
    [0.42, 0.32],
  ];
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x * w, y * h);
    else ctx.lineTo(x * w, y * h);
  });
  ctx.closePath();
}

function bubblePath(ctx, w, h) {
  const points = [
    [0.5, 0],
    [0.58, 0.12],
    [0.7, 0.04],
    [0.74, 0.18],
    [0.9, 0.12],
    [0.86, 0.3],
    [1, 0.38],
    [0.88, 0.49],
    [1, 0.62],
    [0.84, 0.68],
    [0.9, 0.88],
    [0.72, 0.82],
    [0.66, 1],
    [0.53, 0.88],
    [0.4, 1],
    [0.34, 0.82],
    [0.16, 0.88],
    [0.22, 0.68],
    [0.06, 0.62],
    [0.18, 0.49],
    [0, 0.38],
    [0.14, 0.3],
    [0.1, 0.12],
    [0.27, 0.18],
    [0.31, 0.04],
    [0.43, 0.12],
  ];
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x * w, y * h);
    else ctx.lineTo(x * w, y * h);
  });
  ctx.closePath();
}

function drawCenteredText(ctx, item, w, h, family = "Arial Black") {
  ctx.fillStyle = item.textColor || "#111111";
  ctx.strokeStyle = item.type === "marquee" ? "#000000" : "#ffffff";
  ctx.lineWidth = 4;
  ctx.font = `900 ${item.size}px ${cssFont(item.font || family)}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = String(item.text || "").split(/\n|\s{2,}/).filter(Boolean);
  const lineHeight = item.size * 0.92;
  const start = h / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    if (isPopFont(item.font)) {
      ctx.save();
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,.45)";
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.strokeText(line, w / 2, start + index * lineHeight);
      ctx.restore();
    }
    ctx.strokeText(line, w / 2, start + index * lineHeight);
    ctx.fillText(line, w / 2, start + index * lineHeight);
  });
}

function roundedRectPath(ctx, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
}

function arrowPath(ctx, w, h) {
  const points = [
    [0, 0.24],
    [0.62, 0.24],
    [0.62, 0],
    [1, 0.5],
    [0.62, 1],
    [0.62, 0.76],
    [0, 0.76],
  ];
  points.forEach(([x, y], index) => (index ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)));
  ctx.closePath();
}

function ribbonPath(ctx, w, h) {
  const points = [
    [0, 0],
    [1, 0],
    [0.92, 0.5],
    [1, 1],
    [0, 1],
    [0.08, 0.5],
  ];
  points.forEach(([x, y], index) => (index ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)));
  ctx.closePath();
}

function shapeOverridePath(ctx, item) {
  const w = item.w;
  const h = item.h;
  ctx.beginPath();
  switch (item.shape) {
    case "rounded":
      roundedRectPath(ctx, w, h, ((item.shapeAmount ?? 50) / 100) * Math.min(w, h) * 0.45);
      break;
    case "ellipse":
      ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
      break;
    case "jagged":
      bubblePath(ctx, w, h);
      break;
    case "star":
      starPath(ctx, w, h);
      break;
    case "arrow":
      arrowPath(ctx, w, h);
      break;
    case "ribbon":
      ribbonPath(ctx, w, h);
      break;
    default:
      ctx.rect(0, 0, w, h);
      break;
  }
}

function drawShapeOverride(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.fillStyle = "#000000";
    ctx.save();
    ctx.translate(item.depth || 6, item.depth || 6);
    shapeOverridePath(ctx, item);
    ctx.fill();
    ctx.restore();
    shapeOverridePath(ctx, item);
    ctx.fillStyle = item.color || "#ffff00";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = item.shape === "star" ? "#ffff00" : "#111111";
    ctx.stroke();
    drawCenteredText(ctx, item, item.shape === "arrow" ? item.w * 0.68 : item.w, item.h);
  });
}

function drawBubble(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.beginPath();
    bubblePath(ctx, item.w, item.h);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    drawCenteredText(ctx, item, item.w, item.h);
  });
}

function drawStar(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.beginPath();
    starPath(ctx, item.w, item.h);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffff00";
    ctx.stroke();
    drawCenteredText(ctx, item, item.w, item.h);
  });
}

function drawMarquee(ctx, item) {
  withItemTransform(ctx, item, () => {
    for (let x = 0; x < item.w; x += 36) {
      ctx.fillStyle = x % 72 === 0 ? "#ff0000" : "#0000ff";
      ctx.fillRect(x, 0, 36, item.h);
    }
    ctx.lineWidth = 7;
    ctx.strokeStyle = "#ffffff";
    ctx.setLineDash([12, 9]);
    ctx.strokeRect(0, 0, item.w, item.h);
    ctx.setLineDash([]);
    drawCenteredText(ctx, item, item.w, item.h, "Comic Sans MS");
  });
}

function drawCylinder(ctx, item) {
  withItemTransform(ctx, item, () => {
    const gradient = ctx.createLinearGradient(0, 0, item.w, 0);
    ["#ff2600", "#ffe500", "#19cf41", "#04b7e7", "#3732cb"].forEach((color, index) => {
      gradient.addColorStop(index / 4, color);
    });
    ctx.fillStyle = gradient;
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(item.w / 2, item.h / 2, item.w / 2, item.h * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.clip();
    const shine = ctx.createLinearGradient(0, 0, 0, item.h);
    shine.addColorStop(0, "rgba(255,255,255,.65)");
    shine.addColorStop(0.28, "rgba(255,255,255,.18)");
    shine.addColorStop(0.72, "rgba(0,0,0,.04)");
    shine.addColorStop(1, "rgba(0,0,0,.22)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, item.w, item.h);
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(item.w / 2, item.h * 0.25, item.w / 2, item.h * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = item.textColor || "#ffffff";
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 5;
    ctx.font = `900 ${item.size}px ${cssFont(item.font)}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = String(item.text || "").split(/\n/);
    const lineHeight = item.size * 0.9;
    const start = item.h / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.strokeText(line, item.w / 2, start + index * lineHeight);
      ctx.fillText(line, item.w / 2, start + index * lineHeight);
    });
  });
}

function drawLabel(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(item.depth || 10, item.depth || 10, item.w, item.h);
    ctx.fillStyle = item.color;
    ctx.fillRect(0, 0, item.w, item.h);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(0, 0, item.w, item.h);
    drawCenteredText(ctx, item, item.w, item.h);
  });
}

function drawOval(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.fillStyle = item.color;
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(item.w * 0.2, 0);
    ctx.lineTo(item.w * 0.08, -70);
    ctx.lineTo(item.w * 0.36, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(item.w / 2, item.h / 2, item.w / 2, item.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    drawCenteredText(ctx, item, item.w, item.h, "Hiragino Kaku Gothic ProN");
  });
}

function drawRibbon(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(item.depth || 9, item.depth || 9, item.w, item.h);
    for (let x = -item.h; x < item.w + item.h; x += 48) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(0, -item.h, 24, item.h * 3);
      ctx.fillStyle = "#ffff00";
      ctx.fillRect(24, -item.h, 24, item.h * 3);
      ctx.restore();
    }
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#111111";
    ctx.strokeRect(0, 0, item.w, item.h);
    drawCenteredText(ctx, item, item.w, item.h);
  });
}

function drawArrow(ctx, item) {
  withItemTransform(ctx, item, () => {
    const points = [
      [0, 0.24],
      [0.62, 0.24],
      [0.62, 0],
      [1, 0.5],
      [0.62, 1],
      [0.62, 0.76],
      [0, 0.76],
    ];
    ctx.fillStyle = "rgba(0,0,0,.9)";
    ctx.beginPath();
    points.forEach(([x, y], index) => (index ? ctx.lineTo(x * item.w + 7, y * item.h + 7) : ctx.moveTo(x * item.w + 7, y * item.h + 7)));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = item.color;
    ctx.beginPath();
    points.forEach(([x, y], index) => (index ? ctx.lineTo(x * item.w, y * item.h) : ctx.moveTo(x * item.w, y * item.h)));
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#111111";
    ctx.stroke();
    drawCenteredText(ctx, item, item.w * 0.65, item.h);
  });
}

function drawStamp(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.strokeStyle = item.textColor || "#ff0000";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(item.w / 2, item.h / 2, item.w / 2 - 6, item.h / 2 - 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(item.w / 2, item.h / 2, item.w / 2 - 20, item.h / 2 - 20, 0, 0, Math.PI * 2);
    ctx.stroke();
    drawCenteredText(ctx, item, item.w, item.h);
  });
}

function drawPopup(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.fillStyle = item.color;
    ctx.fillRect(0, 0, item.w, item.h);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(0, 0, item.w, item.h);
    ctx.strokeStyle = "#555555";
    ctx.strokeRect(4, 4, item.w - 8, item.h - 8);
    const title = ctx.createLinearGradient(0, 0, item.w, 0);
    title.addColorStop(0, "#000080");
    title.addColorStop(1, "#1084d0");
    ctx.fillStyle = title;
    ctx.fillRect(8, 8, item.w - 16, 32);
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 22px ${cssFont("sans-serif")}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText("Microsoft Word", 16, 24);
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(36, 76, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = `900 28px ${cssFont(defaultFont)}`;
    ctx.fillText("!", 36, 77);
    ctx.fillStyle = item.textColor || "#000000";
    ctx.textAlign = "left";
    ctx.font = `700 ${item.size}px ${cssFont(item.font)}`;
    String(item.text || "")
      .split(/\n/)
      .forEach((line, index) => ctx.fillText(line, 72, 68 + index * item.size * 1.05));
    ctx.fillStyle = "#efefef";
    ctx.fillRect(item.w / 2 - 50, item.h - 46, 100, 30);
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(item.w / 2 - 50, item.h - 46, 100, 30);
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.font = `700 20px ${cssFont("sans-serif")}`;
    ctx.fillText("OK", item.w / 2, item.h - 31);
  });
}

function drawScribble(ctx, item) {
  withItemTransform(ctx, item, () => {
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(228, 0);
    ctx.moveTo(8, item.h - 10);
    ctx.lineTo(168, item.h - 2);
    ctx.stroke();
    ctx.fillStyle = item.textColor || "#111111";
    ctx.font = `500 ${item.size}px ${cssFont(item.font)}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    String(item.text || "")
      .split(/\n/)
      .forEach((line, index) => ctx.fillText(line, 18, 30 + index * item.size * 1.15));
  });
}

function drawShockFace(ctx, item) {
  withItemTransform(ctx, item, () => {
    const w = item.w;
    const h = item.h;
    const sx = w / 160;
    const sy = h / 160;
    ctx.scale(sx, sy);
    ctx.fillStyle = item.color;
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(55, 32);
    ctx.bezierCurveTo(70, 10, 103, 14, 112, 37);
    ctx.lineTo(119, 56);
    ctx.bezierCurveTo(135, 61, 146, 80, 139, 96);
    ctx.bezierCurveTo(134, 109, 122, 114, 114, 111);
    ctx.lineTo(108, 142);
    ctx.lineTo(61, 142);
    ctx.lineTo(58, 111);
    ctx.bezierCurveTo(45, 114, 27, 101, 27, 83);
    ctx.bezierCurveTo(27, 68, 39, 58, 51, 56);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#00a7ff";
    ctx.lineWidth = 6;
    [["M", 56, 28, 45, 10], ["M", 79, 22, 78, 3], ["M", 104, 27, 120, 10]].forEach((line) => {
      ctx.beginPath();
      ctx.moveTo(line[1], line[2]);
      ctx.lineTo(line[3], line[4]);
      ctx.stroke();
    });
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 3;
    [54, 107].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, 72, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = "#111111";
    [58, 103].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, 76, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#bd1026";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 4;
    ctx.fillRect(67, 92, 29, 38);
    ctx.strokeRect(67, 92, 29, 38);
  });
}

function drawDoodleFace(ctx, item) {
  withItemTransform(ctx, item, () => {
    const sx = item.w / 200;
    const sy = item.h / 240;
    ctx.scale(sx, sy);
    ctx.fillStyle = item.color;
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(82, 138, 68, 92, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    [58, 106].forEach((x) => {
      ctx.beginPath();
      ctx.ellipse(x, 126, 8, 16, 0, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(47, 174);
    ctx.quadraticCurveTo(82, 205, 117, 174);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(142, 94);
    ctx.lineTo(194, 54);
    ctx.moveTo(144, 126);
    ctx.lineTo(196, 126);
    ctx.stroke();
    ctx.fillStyle = item.textColor || "#111111";
    ctx.font = `500 ${item.size}px ${cssFont(item.font)}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(item.text || "", 158, 106);
  });
}

function drawFace(ctx, item) {
  withItemTransform(ctx, item, () => {
    const cx = item.w / 2;
    const cy = item.h / 2;
    const r = Math.min(item.w, item.h) * 0.44;
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.beginPath();
    ctx.arc(cx + 7, cy + 7, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = item.color;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.56, cy - r * 0.32);
    ctx.quadraticCurveTo(cx - r * 0.35, cy - r * 0.55, cx - r * 0.14, cy - r * 0.32);
    ctx.moveTo(cx + r * 0.14, cy - r * 0.32);
    ctx.quadraticCurveTo(cx + r * 0.35, cy - r * 0.55, cx + r * 0.56, cy - r * 0.32);
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(cx - r * 0.38, cy - r * 0.08, r * 0.12, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.38, cy - r * 0.08, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.55, cy + r * 0.32);
    ctx.quadraticCurveTo(cx, cy + r * 0.72, cx + r * 0.55, cy + r * 0.32);
    ctx.stroke();
    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.31, cy + r * 0.35);
    ctx.quadraticCurveTo(cx, cy + r * 0.5, cx + r * 0.31, cy + r * 0.35);
    ctx.stroke();
  });
}

function exportPoster() {
  const ctx = exportCanvas.getContext("2d");
  ctx.clearRect(0, 0, DESIGN.width, DESIGN.height);
  drawBackground(ctx);
  state.elements
    .slice()
    .sort((a, b) => a.z - b.z)
    .forEach((item) => {
      if (item.type !== "wordart" && item.shape && item.shape !== "auto") {
        drawShapeOverride(ctx, item);
        return;
      }
      if (item.type === "wordart") drawWordArt(ctx, item);
      if (item.type === "bubble") drawBubble(ctx, item);
      if (item.type === "star") drawStar(ctx, item);
      if (item.type === "marquee") drawMarquee(ctx, item);
      if (item.type === "cylinder") drawCylinder(ctx, item);
      if (item.type === "label") drawLabel(ctx, item);
      if (item.type === "oval") drawOval(ctx, item);
      if (item.type === "ribbon") drawRibbon(ctx, item);
      if (item.type === "arrow") drawArrow(ctx, item);
      if (item.type === "stamp") drawStamp(ctx, item);
      if (item.type === "popup") drawPopup(ctx, item);
      if (item.type === "scribble") drawScribble(ctx, item);
      if (item.type === "shock-face") drawShockFace(ctx, item);
      if (item.type === "doodle-face") drawDoodleFace(ctx, item);
      if (item.type === "face") drawFace(ctx, item);
    });
  const link = document.createElement("a");
  link.download = "dasa-wordart-poster.png";
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
}

bgColor.addEventListener("input", (event) => {
  state.background = event.target.value;
  drawPoster();
});

bgPattern.addEventListener("change", (event) => {
  state.pattern = event.target.value;
  drawPoster();
});

posterWidth.addEventListener("input", () => {
  setPosterSize(readNumberInput(posterWidth, DESIGN.width, 240, 2400), DESIGN.height);
});

posterHeight.addEventListener("input", () => {
  setPosterSize(DESIGN.width, readNumberInput(posterHeight, DESIGN.height, 240, 2400));
});

document.querySelector("#addBubble").addEventListener("click", createBubble);
document.querySelector("#addFace").addEventListener("click", createFace);
document.querySelector("#addStar").addEventListener("click", createStar);
document.querySelector("#addMarquee").addEventListener("click", createMarquee);
document.querySelector("#addCylinder").addEventListener("click", createCylinder);
document.querySelector("#addLabel").addEventListener("click", createLabel);
document.querySelector("#addOval").addEventListener("click", createOval);
document.querySelector("#addShockFace").addEventListener("click", createShockFace);
document.querySelector("#addDoodleFace").addEventListener("click", createDoodleFace);
document.querySelector("#addRibbon").addEventListener("click", createRibbon);
document.querySelector("#addArrow").addEventListener("click", createArrow);
document.querySelector("#addStamp").addEventListener("click", createStamp);
document.querySelector("#addPopup").addEventListener("click", createPopup);
document.querySelector("#addScribble").addEventListener("click", createScribble);
document.querySelector("#clearButton").addEventListener("click", clearPoster);
document.querySelector("#exportButton").addEventListener("click", exportPoster);
document.querySelector("#randomizeButton").addEventListener("click", randomizePositions);
document.querySelector("#clashButton").addEventListener("click", clashColors);
document.querySelector("#idiotButton").addEventListener("click", idiotMode);
document.querySelector("#duplicateButton").addEventListener("click", duplicateSelected);
document.querySelector("#deleteButton").addEventListener("click", deleteSelected);
document.querySelector("#bringFront").addEventListener("click", bringFront);
document.querySelector("#sendBack").addEventListener("click", sendBack);

selectedText.addEventListener("input", (event) => updateSelected({ text: event.target.value }));
selectedColor.addEventListener("input", (event) => updateSelected({ color: event.target.value }));
selectedTextColor.addEventListener("input", (event) => {
  const item = selected();
  updateSelected({ textColor: event.target.value, customTextColor: item?.type === "wordart" ? true : item?.customTextColor });
});
curveRange.addEventListener("input", (event) => {
  curveNumber.value = event.target.value;
  updateSelected({ curve: Number(event.target.value) });
});
curveNumber.addEventListener("input", () => {
  const value = readNumberInput(curveNumber, selected()?.curve || 0, -100, 100);
  curveRange.value = value;
  updateSelected({ curve: value });
});
shapeSelect.addEventListener("change", (event) => {
  updateSelected({ shape: event.target.value, shapeAmount: Number(shapeAmountRange.value) });
});
shapeAmountRange.addEventListener("input", (event) => {
  shapeAmountNumber.value = event.target.value;
  updateSelected({ shapeAmount: Number(event.target.value) });
});
shapeAmountNumber.addEventListener("input", () => {
  const value = readNumberInput(shapeAmountNumber, selected()?.shapeAmount ?? 50, 0, 100);
  shapeAmountRange.value = value;
  updateSelected({ shapeAmount: value });
});
rotateRange.addEventListener("input", (event) => {
  rotateNumber.value = event.target.value;
  updateSelected({ rotate: Number(event.target.value) });
});
rotateNumber.addEventListener("input", () => {
  const value = readNumberInput(rotateNumber, selected()?.rotate || 0, -180, 180);
  rotateRange.value = value;
  updateSelected({ rotate: value });
});
sizeRange.addEventListener("input", (event) => updateSelected({ size: Number(event.target.value) }));
depthRange.addEventListener("input", (event) => updateSelected({ depth: Number(event.target.value) }));

poster.addEventListener("pointerdown", (event) => {
  if (event.target === poster) {
    state.selectedId = null;
    drawPoster();
  }
});

window.addEventListener("resize", drawPoster);

buildSwatches();
buildWordArtGrid();
drawPoster();
