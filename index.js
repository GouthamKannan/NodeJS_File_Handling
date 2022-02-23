const express = require("express");
const fs = require("fs");
const AdmZip = require("adm-zip");
require("dotenv").config({ path: ".env" });

const app = express();

app.get("/", (req, res) => {
  return res.json("success");
});

app.get("/createfile", (req, res) => {
  //create and write file
  let timestamp = new Date();

  let date = ("0" + timestamp.getDate()).slice(-2);
  let month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
  let year = timestamp.getFullYear();
  let hours = timestamp.getHours();
  let minutes = timestamp.getMinutes();
  let seconds = timestamp.getSeconds();

  let filename = `${year + month + date + "-" + hours + minutes + seconds}.txt`;
  try {
    if (!fs.existsSync("./files"))
      fs.mkdir("./files", { recursive: true }, (err) => {
        console.log(err);
      });
    fs.appendFile(`./files/${filename}`, timestamp.toString(), (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    return res.json(`error in file creation :: ${error.message}`);
  }

  return res.json(`file created :: ${filename}`);
});

app.get("/retrivefiles", (req, res) => {
  const zip = new AdmZip();

  if (fs.existsSync("./files")) {
    var fileDir = fs.readdirSync(`${__dirname}/files`);

    if (fileDir.length > 0) {
      for (var i = 0; i < fileDir.length; i++) {
        zip.addLocalFile(`${__dirname}/files/${fileDir[i]}`);
      }

      const downloadName = `files.zip`;

      const data = zip.toBuffer();

      zip.writeZip(__dirname + "/" + downloadName);

      res.set("Content-Type", "application/octet-stream");
      res.set("Content-Disposition", `attachment; filename=${downloadName}`);
      res.set("Content-Length", data.length);
      res.send(data);
    } else res.json("No data to retrive");
  } else res.json("No data to retrive");
});

app.listen(process.env.PORT, () => {
  console.log(`server running at port ${process.env.PORT}`);
});
