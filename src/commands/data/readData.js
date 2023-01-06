const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("data")
    .setDescription("Gets data from Google sheet."),
  async execute(interaction, client, props) {
    const { gSheets, auth, spreadsheetId } = props;

    try {
      interaction.deferReply();

      const sheet = await gSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1",
      });
      const contentList = sheet.data.values;

      let message = `${contentList.length - 1} rows of data:`;

      //content = [name, type, date]
      for (let i = 1; i < contentList.length; i++) {
        message = message.concat(
          "\n",
          `${i}) **${contentList[i][0]}**  <${contentList[i][1]}>  [${contentList[i][2]}]`
        );
      }

      interaction.editReply(message);
    } catch (error) {
      console.error(error);
      interaction.editReply("Failed to fetch data at this time :(");
    }
  },
};

/*
Example sheet data:
----------------------------------------
Name                | Type  | Date
----------------------------------------
Forspoken 	        | Game	| 2023-01-24
Hogwarts Legacy	    | Game	| 2023-02-10
Starfield	          | Game	| 2023-02-16
Throne And Liberty	| Game	| 2023-02-23
Sons Of The Forest	| Game	| 2023-03-01
Wild Hearts	        | Game	| 2023-03-17
-----------------------------------------
*/
