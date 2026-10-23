const fs = require("fs");
const readline = require("readline");

const filePath = "data/hourly_transportation_202406_partial.csv";

const reader = readline.createInterface({
    input: fs.createReadStream(filePath),
});

let lineCount = 0;

let badLineCount = 0;

reader.on("line", (line) => {
  lineCount++;
  const parts = line.split(",");
  if (parts.length !== 13) {
    badLineCount++;
    console.log("Bad line", lineCount, ":", line);
  }
});

reader.on("close", () => {
  console.log("Total lines:", lineCount);
  console.log("Bad lines:", badLineCount);
}); 
