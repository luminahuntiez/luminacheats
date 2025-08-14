import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionsBitField, GuildMember, Role, TextChannel, EmbedBuilder, ChannelType } from "discord.js";

export const commands = [
  new SlashCommandBuilder()
    .setName("grant")
    .setDescription("Grant a role to a user")
    .addUserOption(option => option.setName("user").setDescription("The user to grant the role to").setRequired(true))
    .addRoleOption(option => option.setName("role").setDescription("The role to grant").setRequired(true)),
  
  new SlashCommandBuilder()
    .setName("revoke")
    .setDescription("Revoke a role from a user")
    .addUserOption(option => option.setName("user").setDescription("The user to revoke the role from").setRequired(true))
    .addRoleOption(option => option.setName("role").setDescription("The role to revoke").setRequired(true)),
  
  new SlashCommandBuilder()
    .setName("review")
    .setDescription("Submit a review")
    .addIntegerOption(option => option.setName("stars").setDescription("Rating (1-5)").setRequired(true).setMinValue(1).setMaxValue(5))
    .addStringOption(option => option.setName("message").setDescription("Review message").setRequired(true))
    .addStringOption(option => option.setName("image").setDescription("Image URL (optional)").setRequired(false)),
  
  new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete a review by message ID")
    .addStringOption(option => option.setName("message_id").setDescription("Message ID to delete").setRequired(true)),
  
  new SlashCommandBuilder()
    .setName("restore")
    .setDescription("Restore all reviews to Discord channel"),
  
  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear all reviews"),
  
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Change product status")
    .addStringOption(option => 
      option.setName("product")
        .setDescription("Product to update")
        .setRequired(true)
        .addChoices(
          { name: "Fortnite Private", value: "fortnite-private" },
          { name: "Free Spoofer", value: "free-spoofer" },
          { name: "Paid Spoofer", value: "paid-spoofer" },
          { name: "Free CS2", value: "free-cs2" },
          { name: "Paid CS2", value: "paid-cs2" },
          { name: "Discord Bot", value: "discord-bot" },
          { name: "Downloads", value: "downloads" },
          { name: "CDN", value: "cdn" },
          { name: "Route", value: "route" }
        )
    )
    .addStringOption(option => 
      option.setName("status")
        .setDescription("Custom status message")
        .setRequired(true)
    )
    .addStringOption(option => 
      option.setName("color")
        .setDescription("Status color")
        .setRequired(true)
        .addChoices(
          { name: "Green", value: "green" },
          { name: "Orange", value: "orange" },
          { name: "Red", value: "red" }
        )
    ),
  
  new SlashCommandBuilder()
    .setName("builder")
    .setDescription("Toggle website maintenance mode")
    .addStringOption(option => 
      option.setName("countdown")
        .setDescription("Countdown in minutes (optional)")
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName("reason")
        .setDescription("Reason for maintenance (optional)")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
];

export async function handleInteraction(interaction: ChatInputCommandInteraction) {
  switch (interaction.commandName) {
    case "grant": {
      const member = interaction.options.getMember("user") as GuildMember | null;
      const role = interaction.options.getRole("role") as Role | null;
      if (!member || !role) return interaction.reply({ content: "Invalid args", flags: 64 });
      await member.roles.add(role.id);
      return interaction.reply({ content: `Granted role ${role.name} to ${member.user.tag}`, flags: 64 });
    }
    case "revoke": {
      const member = interaction.options.getMember("user") as GuildMember | null;
      const role = interaction.options.getRole("role") as Role | null;
      if (!member || !role) return interaction.reply({ content: "Invalid args", flags: 64 });
      await member.roles.remove(role.id);
      return interaction.reply({ content: `Revoked role ${role.name} from ${member.user.tag}`, flags: 64 });
    }
    case "review": {
      const stars = interaction.options.getInteger("stars", true);
      const message = interaction.options.getString("message", true);
      const image = interaction.options.getString("image");

      if (stars < 1 || stars > 5) {
        return interaction.reply({ content: "Stars must be between 1 and 5.", flags: 64 });
      }

      if (message.length < 3) {
        return interaction.reply({ content: "Message must be at least 3 characters long.", flags: 64 });
      }

      // Check for duplicate review first
      try {
        const checkRes = await fetch(process.env.REVIEWS_API_URL || "http://localhost:3000/api/reviews", {
          headers: { "Authorization": `Bearer ${process.env.REVIEWS_API_SECRET}` }
        });
        if (checkRes.ok) {
          const existingReviews = await checkRes.json();
          const recentDuplicate = existingReviews.reviews?.find((r: any) => 
            r.authorId === interaction.user.id && 
            r.message === message &&
            Date.now() - r.createdAt < 5 * 60 * 1000 // 5 minutes
          );
          if (recentDuplicate) {
            return interaction.reply({ content: "You've already submitted this review recently. Please wait a few minutes.", flags: 64 });
          }
        }
      } catch (error) {
        console.error("Error checking for duplicates:", error);
      }

      const starStr = "⭐".repeat(stars) + "☆".repeat(5 - stars);
      const postedIds: string[] = [];

      // Post to vouches channel
      const vouchChannelId = process.env.VOUCHES_CHANNEL_ID || process.env.REVIEWS_CHANNEL_ID;
      if (vouchChannelId) {
        try {
          const channel = await interaction.client.channels.fetch(vouchChannelId);
          if (channel && channel.isTextBased() && channel.type === ChannelType.GuildText) {
            const embed = new EmbedBuilder()
              .setTitle("🌟 New Vouch Submitted!")
              .setDescription(`**Rating:** ${starStr}\n\n**Message:**\n${message}`)
              .setAuthor({ 
                name: interaction.user.username, 
                iconURL: interaction.user.displayAvatarURL(),
                url: "https://luminacheats.com"
              })
              .setFooter({ text: "Powered by Lumina • luminacheats.com" })
              .setColor(0x8b5cf6)
              .setTimestamp();
            if (image) embed.setImage(image);
            const msg = await (channel as TextChannel).send({ embeds: [embed] });
            postedIds.push(msg.id);
          }
        } catch (error) {
          console.error("Error posting to vouches channel:", error);
        }
      }

      // Post to reviews channel if different
      const reviewsChannelId = process.env.REVIEWS_CHANNEL_ID;
      if (reviewsChannelId && reviewsChannelId !== vouchChannelId) {
        try {
          const channel = await interaction.client.channels.fetch(reviewsChannelId);
          if (channel && channel.isTextBased() && channel.type === ChannelType.GuildText) {
            const embed = new EmbedBuilder()
              .setTitle("🌟 New Vouch Submitted!")
              .setDescription(`**Rating:** ${starStr}\n\n**Message:**\n${message}`)
              .setAuthor({ 
                name: interaction.user.username, 
                iconURL: interaction.user.displayAvatarURL(),
                url: "https://luminacheats.com"
              })
              .setFooter({ text: "Powered by Lumina • luminacheats.com" })
              .setColor(0x8b5cf6)
              .setTimestamp();
            if (image) embed.setImage(image);
            const msg = await (channel as TextChannel).send({ embeds: [embed] });
            postedIds.push(msg.id);
          }
        } catch (error) {
          console.error("Error posting to reviews channel:", error);
        }
      }

      // Send DM to user
      try {
        const dmEmbed = new EmbedBuilder()
          .setTitle("✅ Vouch Submitted Successfully!")
          .setDescription(`**Rating:** ${starStr}\n\n**Message:**\n${message}`)
          .setAuthor({ 
            name: "Lumina Cheats", 
            iconURL: interaction.client.user?.displayAvatarURL(),
            url: "https://luminacheats.com"
          })
          .setFooter({ text: "Thank you for your feedback! • luminacheats.com" })
          .setColor(0x10b981)
          .setTimestamp();
        if (image) dmEmbed.setImage(image);
        await interaction.user.send({ embeds: [dmEmbed] });
      } catch (error) {
        console.error("Error sending DM:", error);
      }

      // Submit to website API
      try {
        const reviewData = {
          authorId: interaction.user.id,
          authorName: interaction.user.username,
          authorAvatar: interaction.user.displayAvatarURL(),
          stars,
          message,
          imageUrl: image || null,
          messageIds: postedIds
        };

        const res = await fetch(process.env.REVIEWS_API_URL || "http://localhost:3000/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.REVIEWS_API_SECRET}`
          },
          body: JSON.stringify(reviewData)
        });

        if (res.ok) {
          return interaction.reply({ content: "✅ Vouch submitted successfully! Check your DMs for confirmation.", flags: 64 });
        } else {
          console.error("API error:", await res.text());
          return interaction.reply({ content: "❌ Failed to submit vouch to website.", flags: 64 });
        }
      } catch (error) {
        console.error("Error submitting to API:", error);
        return interaction.reply({ content: "❌ Failed to submit vouch to website.", flags: 64 });
      }
    }
    case "delete": {
      const messageId = interaction.options.getString("message_id", true);
      const channelIds = [process.env.VOUCHES_CHANNEL_ID, process.env.REVIEWS_CHANNEL_ID].filter(Boolean) as string[];
      let deleted = 0;
      for (const cid of channelIds) {
        try {
          const channel = await interaction.client.channels.fetch(cid);
          if (channel && channel.isTextBased()) {
            await (channel as TextChannel).messages.delete(messageId);
            deleted++;
          }
        } catch {}
      }
      const apiUrl = process.env.REVIEWS_API_URL || "http://localhost:3000/api/reviews";
      const apiSecret = process.env.REVIEWS_API_SECRET;
      if (apiSecret) {
        try {
          await fetch(apiUrl, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiSecret}` },
            body: JSON.stringify({ messageId }),
          });
        } catch {}
      }
      return interaction.reply({ content: `Delete requested. Discord deletions: ${deleted}`, flags: 64 });
    }
    case "clear": {
      try {
        const res = await fetch(process.env.REVIEWS_API_URL || "http://localhost:3000/api/reviews", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.REVIEWS_API_SECRET}`
          },
          body: JSON.stringify({ clearAll: true })
        });

        if (res.ok) {
          return interaction.reply({ content: "✅ All reviews cleared successfully.", flags: 64 });
        } else {
          return interaction.reply({ content: "❌ Failed to clear reviews.", flags: 64 });
        }
      } catch (error) {
        console.error("Error clearing reviews:", error);
        return interaction.reply({ content: "❌ Error clearing reviews.", flags: 64 });
      }
    }
    case "status": {
      const product = interaction.options.getString("product", true);
      const status = interaction.options.getString("status", true);
      const color = interaction.options.getString("color", true);

      try {
        const res = await fetch(process.env.REVIEWS_API_URL?.replace('/reviews', '/status') || "http://localhost:3000/api/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.REVIEWS_API_SECRET}`
          },
          body: JSON.stringify({ product, status, color })
        });

        if (res.ok) {
          const data = await res.json();
          
          const embed = new EmbedBuilder()
            .setTitle("Status Updated")
            .setDescription(`**${data.product.name}** status changed to **${status}**`)
            .setColor(color === "green" ? 0x10b981 : color === "orange" ? 0xf59e0b : 0xef4444)
            .setTimestamp()
            .setFooter({ text: "Lumina Status System" });

          return interaction.reply({ embeds: [embed], flags: 64 });
        } else {
          const errorText = await res.text();
          return interaction.reply({ content: `Failed to update status: ${errorText}`, flags: 64 });
        }
      } catch (error) {
        console.error("Error updating status:", error);
        return interaction.reply({ content: "Error updating status.", flags: 64 });
      }
    }
    case "builder": {
      // Check for required role
      const requiredRoleId = "1387553877913764031";
      const member = interaction.member as GuildMember;
      
      if (!member.roles.cache.has(requiredRoleId)) {
        return interaction.reply({ 
          content: "You don't have permission to use this command. Required role: <@&1387553877913764031>", 
          flags: 64 
        });
      }

      const countdown = interaction.options.getString("countdown");
      const reason = interaction.options.getString("reason");

      try {
        // Get current maintenance status
        const getRes = await fetch(process.env.REVIEWS_API_URL?.replace('/reviews', '/maintenance') || "http://localhost:3000/api/maintenance");
        const currentData = await getRes.json();
        const newEnabled = !currentData.enabled;

        // Calculate countdown timestamp if provided
        let countdownTimestamp = null;
        if (countdown && newEnabled) {
          const minutes = parseInt(countdown);
          if (!isNaN(minutes) && minutes > 0) {
            countdownTimestamp = Date.now() + (minutes * 60 * 1000);
          }
        }

        // Update maintenance status
        const res = await fetch(process.env.REVIEWS_API_URL?.replace('/reviews', '/maintenance') || "http://localhost:3000/api/maintenance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.REVIEWS_API_SECRET}`
          },
          body: JSON.stringify({ 
            enabled: newEnabled, 
            enabledBy: interaction.user.username,
            countdown: countdownTimestamp,
            reason: reason || null
          })
        });

        if (res.ok) {
          const embed = new EmbedBuilder()
            .setTitle(newEnabled ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled")
            .setDescription(newEnabled 
              ? "Website is now in maintenance mode."
              : "Website is back to normal operation."
            )
            .setColor(newEnabled ? 0xf59e0b : 0x10b981)
            .addFields(
              { name: "Status", value: newEnabled ? "Under Construction" : "Operational", inline: true },
              { name: "Updated By", value: interaction.user.username, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: "Lumina Builder System" });

          if (newEnabled && countdownTimestamp) {
            const hours = Math.floor(parseInt(countdown!) / 60);
            const minutes = parseInt(countdown!) % 60;
            embed.addFields({ 
              name: "Countdown", 
              value: `${hours > 0 ? `${hours}h ` : ''}${minutes}m`, 
              inline: true 
            });
          }

          if (newEnabled && reason) {
            embed.addFields({ name: "Reason", value: reason, inline: false });
          }

          return interaction.reply({ embeds: [embed], flags: 64 });
        } else {
          return interaction.reply({ content: "Failed to toggle maintenance mode.", flags: 64 });
        }
      } catch (error) {
        console.error("Error toggling maintenance mode:", error);
        return interaction.reply({ content: "Error toggling maintenance mode.", flags: 64 });
      }
    }
    default:
      return interaction.reply({ content: "Unknown command", flags: 64 });
  }
}


