const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

exports.handler = async (event) => {
  return new Promise((resolve) => {
    const form = new formidable.IncomingForm({
      maxFileSize: 50 * 1024 * 1024
    });

    form.parse(event, (err, fields, files) => {
      if (err) {
        resolve({
          statusCode: 400,
          body: JSON.stringify({ message: "Upload failed" })
        });
        return;
      }

      const file = files.file;
      const data = fs.readFileSync(file.filepath);

      const outputPath = path.join(
        process.cwd(),
        "public",
        "menu.pdf"
      );

      fs.writeFileSync(outputPath, data);

      resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: "PDF updated successfully ✅"
        })
      });
    });
  });
};
