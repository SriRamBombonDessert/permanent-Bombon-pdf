import formidable from "formidable";
import fs from "fs";
import path from "path";

export const handler = async (event) => {
  const form = formidable({
    multiples: false,
    maxFileSize: 50 * 1024 * 1024
  });

  return new Promise((resolve) => {
    form.parse(event, async (err, fields, files) => {
      if (err) {
        resolve({
          statusCode: 400,
          body: JSON.stringify({ message: "Upload failed" })
        });
        return;
      }

      const file = files.file[0];
      const data = fs.readFileSync(file.filepath);

      const outputPath = path.join(
        process.cwd(),
        "menu.pdf"
      );

      fs.writeFileSync(outputPath, data);

      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: "PDF updated successfully ✅" })
      });
    });
  });
};
