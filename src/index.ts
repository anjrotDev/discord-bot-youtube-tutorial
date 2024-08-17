import http from "http";
import { Client, GatewayIntentBits, Events, Message, GuildMember, EmbedBuilder, AttachmentBuilder } from "discord.js";
import dotenv from "dotenv";
import { welcomeImage } from "./utils/welcomeImage";
dotenv.config();

const discordToken = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: Object.keys(GatewayIntentBits) as Array<keyof typeof GatewayIntentBits>
});

client.once(Events.ClientReady, async () => {
  console.log(`Ready running bot ${client.user?.username}`);
});

client.once(Events.MessageCreate, async (message: Message) => {
  if (message.content === "!hola") message.reply(`Hola ${message.author}, como estas?`);

  if (message.content === "!avatar") message.channel.send(message.author.displayAvatarURL({ size: 256, extension: "png" }));
});

client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
  const welcomeChannel = member.guild.channels.cache.find(channel => channel.name.includes("bienvenidos"));

  if (!welcomeChannel || !welcomeChannel.isTextBased()) return;

  try {
    const buffer = await welcomeImage(member);
    const avatar = member.user.displayAvatarURL({ size: 256, extension: "png" });

    const attachment = new AttachmentBuilder(buffer as Buffer, { name: "welcome-img.png" });

    // inside a command, event listener, etc.
    const welcomeEmbedMsg = new EmbedBuilder()
      .setColor("White")
      .setTitle(`🎉 Bienvenid@ a la comunidad ${member.user.displayName} 🎉`)
      .setAuthor({
        name: "Anjrot Dev",
        iconURL: "https://anjrot-blog-images.s3.amazonaws.com/img/blog/anjrot_logo_fiverr.jpg",
        url: "https://anjrot.com"
      })
      .setDescription(
        `¡Hola ${member.user.displayName} y bienvenid@ a nuestra comunidad! 🎉 Nos alegra mucho tenerte aquí. Este es un lugar donde desarrolladores de todos los niveles se reúnen para compartir conocimientos, aprender juntos y apoyarse mutuamente en sus proyectos. No dudes en explorar los canales, participar en las discusiones y preguntar cualquier cosa que necesites. ¡Estamos aquí para ayudarte a crecer y a mejorar tus habilidades! 🚀`
      )
      .setThumbnail(avatar)
      .setImage("attachment://welcome-img.png")
      .setTimestamp()
      .setFooter({ text: "Bienvenid@ al servidor", iconURL: "https://anjrot-blog-images.s3.amazonaws.com/img/blog/anjrot_logo_fiverr.jpg" });

    welcomeChannel.send({ embeds: [welcomeEmbedMsg], files: [attachment] });
  } catch (error) {
    console.log("error :>> ", error);
  }
});

client.on(Events.ShardDisconnect, (event, shardId) => {
  console.log(`Shard ${shardId} disconnected. Attempting to reconnect...`);
});

client.on(Events.ShardReconnecting, shardId => {
  console.log(`Shard ${shardId} is attempting to reconnect...`);
});

client.on(Events.ShardResume, (shardId, replayedEvents) => {
  console.log(`Shard ${shardId} has resumed. Replayed ${replayedEvents} events.`);
});

client.login(discordToken);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Bot is Running!!!");
});

process.on("uncaughtException", err => {
  console.error("Uncaught Exception:", err);
  client.login(process.env.DISCORD_TOKEN);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  client.login(process.env.DISCORD_TOKEN);
});

const Port = process.env.PORT || 8080;

server.listen(Port, () => {
  console.log(`Health check server running on port ${Port}`);
});
