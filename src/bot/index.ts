import dotenv from "dotenv";
import { Client, GatewayIntentBits, REST, Routes, Events, ChannelType, type TextChannel, EmbedBuilder } from "discord.js";
import { commands, handleInteraction } from "./commands";

dotenv.config({ path: ".env.local" });
const token = process.env.DISCORD_BOT_TOKEN!;
const clientId = process.env.DISCORD_CLIENT_ID!;
const guildId = process.env.DISCORD_GUILD_ID!;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
}

export async function startBot() {
  await registerCommands();
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    try {
      if (interaction.commandName === "restore") {
        const vouchChannelId = process.env.VOUCHES_CHANNEL_ID || process.env.REVIEWS_CHANNEL_ID;
        if (!vouchChannelId) {
          return interaction.reply({ content: "No vouches channel configured.", flags: 64 });
        }
        
        await interaction.deferReply({ flags: 64 });
        
        try {
          const res = await fetch(process.env.REVIEWS_API_URL || "http://localhost:3000/api/reviews");
          const data = await res.json();
          const channel = await client.channels.fetch(vouchChannelId);
          
          if (channel && channel.isTextBased() && channel.type === ChannelType.GuildText) {
            let restored = 0;
            for (const r of data.reviews ?? []) {
              const starStr = "⭐".repeat(r.stars) + "☆".repeat(5 - r.stars);
              const embed = new EmbedBuilder()
                .setTitle("🔄 Vouch Restored!")
                .setDescription(`**Rating:** ${starStr}\n\n**Message:**\n${r.message}`)
                .setAuthor({ 
                  name: r.authorName, 
                  iconURL: r.authorAvatar || undefined,
                  url: "https://luminacheats.com"
                })
                .setFooter({ text: "Powered by Lumina • luminacheats.com" })
                .setColor(0xf59e0b)
                .setTimestamp(new Date(r.createdAt));
              if (r.imageUrl) embed.setImage(r.imageUrl);
              await (channel as TextChannel).send({ embeds: [embed] });
              restored++;
            }
            return interaction.editReply({ content: `Restored ${restored} vouches.` });
          } else {
            return interaction.editReply({ content: "Could not access the vouches channel." });
          }
        } catch {
          return interaction.editReply({ content: "Failed to restore vouches." });
        }
      } else {
        // Handle other commands
        await handleInteraction(interaction);
      }
    } catch (error) {
      console.error("Interaction error:", error);
      try {
        if (interaction.deferred) {
          await interaction.editReply({ content: "An error occurred while processing the command." });
        } else if (!interaction.replied) {
          await interaction.reply({ content: "An error occurred while processing the command.", flags: 64 });
        }
      } catch {
        // Ignore reply errors
      }
    }
  });
  
  await client.login(token);
  console.log("Discord bot logged in.");
}

if (require.main === module) {
  startBot().catch((err) => {
    console.error("Bot error", err);
    process.exit(1);
  });
}


