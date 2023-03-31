import { AutocompleteInteraction, Client, CommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export interface Command {
    data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    run: (client: Client, interaction: CommandInteraction) => Promise<any>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}