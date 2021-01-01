// external dependencies
const axios = require("axios");
const { JSDOM } = require("jsdom");

// node built-in modules
const fs = require("fs");

// local dependecies
const PRAYER_NAMES = require("./data/names");
const CITIES = require("./data/cities");
const { sleep } = require("./sleep");
const { API_URL } = require("./config");
const { chunk } = require("./utils");

const getByCityAndMonth = async (cityId, month) =>
  await axios.get(`${API_URL}ville=${cityId}&mois=${month}`);

const parsePrayersFromResponse = (response) => {
  const dom = new JSDOM(`${response.data}`);
  const tds = Array.from(dom.window.document.querySelectorAll("#horaire td"))
    .splice(9) // Remove the first 9, they are just headers
    .map((e) => e.textContent.trim());

  let prayers = chunk(tds, 7);

  prayers = prayers.map((p) => {
    let prayer = {};
    PRAYER_NAMES.forEach((e, j) => {
      prayer[e.name] = p[j + 1];
    });
    prayer.day = parseInt(p[0]);
    return prayer;
  });

  return prayers;
};

const main = async (fn, limit = 120) => {
  const start = Date.now();
  let results = [];
  for (let cityIndex = 1; cityIndex <= limit; cityIndex++) {
    city = CITIES.filter((c) => c._id === cityIndex)[0];
    if (!city) continue;

    console.log(`Getting data for ${city.names.fr}`);
    for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
      try {
        let data = await getByCityAndMonth(cityIndex, monthIndex);
        let monthPrayer = parsePrayersFromResponse(data);
        // Add City infos and day
        monthPrayer.forEach((m) => {
          m.city = city._id;
          m.month = monthIndex;
        });
        results.push(...monthPrayer);
      } catch (ex) {
        // console.log(`Something bad happened for city ${city.names.fr}`);
        // console.log(ex);
        // break;
        monthIndex = monthIndex - 1;
        console.log(`Retrying getting data for ${city.names.fr} after 5 s`);
        sleep(5);
      }
    }
    console.log(`done for city ${city.names.fr}`);
  }
  console.log(`${results.length}/${116 * 365} records found`);
  fn(results);
  const time = ((Date.now() - start) / 1000) * 60;
  console.log(`done in ${time} minutes`);
};

const saveJson = (name) => (prayers) =>
  fs.writeFileSync(name + ".json", JSON.stringify(prayers));

(async () => {
  await main(saveJson(`prayers_${new Date().toLocaleDateString().join(" ")}`));
})();
