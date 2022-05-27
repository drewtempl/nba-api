const getTeams = async function () {
  return new Promise((resolve, reject) => {
    const teams = [];
    console.log("scraping teams...");

    request("https://www.espn.com/nba/teams", function (error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $(".mt4 .ContentList__Item").each((i, el) => {
          let name = $(el).find("h2").text();
          let abbrev = $(el).find(".AnchorLink:first").attr("href");

          let array = abbrev.split("/");
          abbrev = array[5];

          let logoURL = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

          let team = new Team({
            name: `${name}`,
            abvr: `${abbrev}`,
            logo: `${logoURL}`,
          });

          team.save();
        });
      }
      resolve();
    });
  });
};

module.exports = getTeams;
