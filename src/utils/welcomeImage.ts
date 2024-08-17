import { createCanvas, loadImage } from "@napi-rs/canvas";
import { GuildMember } from "discord.js";
import { join } from "path";

const backgroundImg = join(__dirname, "../assets/img/background_bot.jpg");

export const welcomeImage = async (member: GuildMember) => {
  const width = 1200;
  const height = 600;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  try {
    const memberUser = member.user.displayName;
    const background = await loadImage(backgroundImg);
    const avatar = await loadImage(member.user.displayAvatarURL({ size: 256, extension: "png" }));

    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    const margin = 20;

    ctx.drawImage(background, margin, margin, width - 40, height - 40);

    const marginAvatarX = margin + 100;
    const marginAvatarY = (height - 256) / 2;

    ctx.shadowColor = "transparent";
    ctx.font = "bold 60px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    const textY = marginAvatarY + 256 / 2;
    ctx.fillText(memberUser, marginAvatarX + 600, textY + 20);

    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("¡Bienvenid@ al Servidor! Estamos felices de tenerte con nosotros.", width / 2, height - 60);

    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(marginAvatarX + 256 / 2, marginAvatarY + 256 / 2, 256 / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.arc(marginAvatarX + 256 / 2, marginAvatarY + 256 / 2, 256 / 2 - 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, marginAvatarX, marginAvatarY, 256, 256);

    return canvas.toBuffer("image/png");
  } catch (error) {
    console.log("error :>> ", error);
  }
};
