import { IncomingForm } from "formidable";
import fs from "fs";

export const handler = async (event) => {
  return new Promise((resolve) => {
    const form = new IncomingForm({
      multiples: false,
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

      // formidable v3 structure
      const file = files.file[0];
      const data = fs.readFileSync(file.filepath);

      // TEMP write (Netlify allows during runtime)
      fs.writeFileSync("/tmp/menu.pdf", data);

      resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: "PDF uploaded successfully ✅"
        })
      });
    });
  });
};
