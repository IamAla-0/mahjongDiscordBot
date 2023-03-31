import { Client, CommandInteraction, Interaction, Message } from "discord.js";
import { inject, injectable } from "inversify";
import { Commands } from "./command/commands";
import { TYPES } from "./types";

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string
    ) {
        this.client = client;
        this.token = token;
    }

    public registerCommand(): void {
        this.client.on("ready", async () => {
            if (!this.client.user || !this.client.application) {
                return;
            }
            await this.client.application.commands.set(Commands.map(c => c.data));

            console.log(`${this.client.user.username} is online`)
        })
        this.client.on("interactionCreate", async (interaction: Interaction) => {
            if (interaction.isCommand() || interaction.isContextMenuCommand()){
                await this.handleSlashCommand(this.client, interaction);
            }
            if (interaction.isAutocomplete()) {
                const slashCommand = Commands.find(c => c.data.name === interaction.commandName);
                await slashCommand.autocomplete(interaction)
            }
        })
    }

    async handleSlashCommand(client: Client, interaction: CommandInteraction): Promise<void>{
        const slashCommand = Commands.find(c => c.data.name === interaction.commandName);
        if (!slashCommand) {
            interaction.followUp({ ephemeral: true, content: "Error: cannot find slash command" });
            return;
        }

        await interaction.deferReply({ephemeral: true});

        slashCommand.run(client, interaction)
            .catch(err => {
                if (typeof err === "string") interaction.editReply(err);
                else interaction.editReply(JSON.stringify(err));
                console.log(err)
            })
    }

    public listen(): Promise<string> {
        this.client.on('messageCreate', async (message: Message) => {
            console.log("Message received! Content: ", message.content)
        })

        return this.client.login(this.token)
    }
}