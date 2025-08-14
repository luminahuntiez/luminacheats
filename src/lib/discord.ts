//

export async function userHasRoleForProduct(discordUserId: string, requiredRoleId: string): Promise<boolean> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    console.error("Discord configuration missing: DISCORD_GUILD_ID, DISCORD_BOT_TOKEN");
    return false;
  }

  const url = `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${botToken}`,
    },
    cache: "no-store",
  });

  if (res.status === 404) return false;
  if (!res.ok) {
    console.error("Failed to fetch guild member:", res.status, await res.text());
    return false;
  }

  const data = (await res.json()) as { roles?: string[] };
  const roles = data.roles ?? [];
  return roles.includes(requiredRoleId);
}

export async function getUserRoleIds(discordUserId: string): Promise<string[] | null> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!guildId || !botToken) return null;
  const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}` as string, {
    headers: { Authorization: `Bot ${botToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { roles?: string[] };
  return data.roles ?? [];
}



