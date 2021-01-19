const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config");
const fs = require("fs");
const randexp = require("randexp");

const listener = app.listen(config.port, () => {
  console.log(
    `Firepaste server is listening on port ${listener.address().port}!`
  );
  setup();
});

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  next();
});

app.set("view engine", "ejs");
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(bodyParser.text({ type: "text/*", limit: config.pasteSizeLimit }));

app.use(express.static(__dirname + "/public"));

app.post("/paste", (req, res) => {
  let pasteID = genPasteID();
  console.log(req.body);
  fs.writeFile(`./pastes/${pasteID}.firepaste`, req.body, (err) => {
    if (err) throw err;
    res.send({ success: true, data: { pasteID: pasteID } });
    addPaste(app, `${pasteID}.firepaste`);
  });
});

app.get("/:paste", (req, res, next) => {
  if (fs.existsSync(`./pastes/${req.params.paste}.firepaste`)) {
    let data = fs.readFileSync(
      `./pastes/${req.params.paste}.firepaste`,
      "utf-8"
    );
    res.render(__dirname + "/public/index.ejs", { paste: data });
  } else {
    res.redirect("/");
  }
});
app.get("/", (req, res, next) => {
  res.render(__dirname + "/public/index.ejs", { paste: "" });
});

function setup() {
  fs.readdirSync("./pastes/").forEach((pasteFile) => {
    if (!pasteFile.endsWith(".firepaste")) return;

    addPaste(app, pasteFile);
  });
}

function addPaste(app, pasteFile) {
  app.get(`/${pasteFile.replace(".firepaste", "")}`, (req, res) => {
    let content = fs
      .readFileSync(`./pastes/${pasteFile}/`, "utf-8")
      .split("\n")
      .join("<br>");

    res.send(content);
  });
}

function genPasteID() {
  let regexp = /^[a-zA-Z1-9]{5}/;
  let id = new randexp(regexp).gen();

  if (fs.existsSync(`./pastes/${id}.firepaste`)) return genPasteID();

  return id;
}
