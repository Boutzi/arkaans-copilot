import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
GlobalFonts.registerFromPath(join(__dirname, "../assets/fonts/Poppins-Bold.ttf"), "Poppins-Bold");
GlobalFonts.registerFromPath(join(__dirname, "../assets/fonts/Poppins-SemiBold.ttf"), "Poppins-SemiBold");
import axios from "axios";
import type { WelcomeImageOptions } from "../types/welcomeImage.js";

export async function generateWelcomeImage(options: WelcomeImageOptions): Promise<Buffer> {
  const { username, avatarUrl, backgroundUrl, hexColor, quote, guildName, guildIconUrl } = options;

  // 1. Charger et redimensionner le background
  // 2. Créer le canvas
  // 3. Dessiner le background
  // 4. Dessiner l'avatar arrondi
  // 5. Dessiner le texte
  // 6. Dessiner l'icône de la guild
  // 7. Retourner le buffer

  // Charger le background
  const bgResponse = await axios.get(backgroundUrl, { responseType: "arraybuffer" });
  const bgBuffer = Buffer.from(bgResponse.data);
  const background = await loadImage(bgBuffer);

  // Créer le canvas aux dimensions du background redimensionné
  const WIDTH = 800;
  const HEIGHT = 400;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Dessiner le background
  ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);

  // Charger l'avatar
  const avatarResponse = await axios.get(avatarUrl, { responseType: "arraybuffer" });
  const avatarBuffer = Buffer.from(avatarResponse.data);
  const avatar = await loadImage(avatarBuffer);

  // Dessiner l'avatar arrondi
  const AVATAR_SIZE = 160;
  const CENTER_X = WIDTH / 2;
  const AVATAR_Y = 30;

  // Contour blanc
  ctx.save();
  ctx.beginPath();
  ctx.arc(CENTER_X, AVATAR_Y + AVATAR_SIZE / 2, AVATAR_SIZE / 2 + 6, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
  ctx.restore();

  // Avatar clipé en cercle
  ctx.save();
  ctx.beginPath();
  ctx.arc(CENTER_X, AVATAR_Y + AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, CENTER_X - AVATAR_SIZE / 2, AVATAR_Y, AVATAR_SIZE, AVATAR_SIZE);
  ctx.restore();

  const CENTER_Y = HEIGHT / 2;

  // WELCOME
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  ctx.font = "35px Poppins-SemiBold";
  ctx.fillStyle = "white";
  ctx.fillText("WELCOME", CENTER_X, CENTER_Y + 40);
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "black";
  ctx.strokeText("WELCOME", CENTER_X, CENTER_Y + 40);

  // Nom du membre
  ctx.font = "70px Poppins-Bold";
  ctx.fillStyle = hexColor;
  ctx.fillText(username.toUpperCase(), CENTER_X, CENTER_Y + 105);
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "black";
  ctx.strokeText(username.toUpperCase(), CENTER_X, CENTER_Y + 105);

  // Quote
  const displayQuote = quote ?? `Welcome to ${guildName}!`;
  ctx.font = "25px Poppins-SemiBold";
  ctx.fillStyle = "white";
  ctx.fillText(displayQuote, CENTER_X, CENTER_Y + 140);

  // Icône de la guild
  if (guildIconUrl) {
    const iconResponse = await axios.get(guildIconUrl, { responseType: "arraybuffer" });
    const iconBuffer = Buffer.from(iconResponse.data);
    const guildIcon = await loadImage(iconBuffer);

    const ICON_SIZE = 30;
    const ICON_X = 15;
    const ICON_Y = HEIGHT - 45;

    // Icône arrondie
    ctx.save();
    ctx.beginPath();
    ctx.arc(ICON_X + ICON_SIZE / 2, ICON_Y + ICON_SIZE / 2, ICON_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(guildIcon, ICON_X, ICON_Y, ICON_SIZE, ICON_SIZE);
    ctx.restore();

    // Nom de la guild
    ctx.textAlign = "left";
    ctx.font = "20px Poppins-SemiBold";
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
    ctx.shadowBlur = 8;
    ctx.fillText(guildName, ICON_X + ICON_SIZE + 10, ICON_Y + ICON_SIZE / 2 + 7);
  }

  return canvas.toBuffer("image/png");
}
