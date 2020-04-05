const prayers = require("./prayers.json").data;
const fs = require("fs");
const result = {};
prayers.forEach(prayer => {
  if (prayer.city >= 109) {
    result[`${prayer.city}_${prayer.month}_${prayer.day}`] = prayer;
  }
});

// console.log(result);

fs.writeFileSync("remain.json", JSON.stringify({ prayers: result }));
