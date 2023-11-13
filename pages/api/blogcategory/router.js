import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      // check file exist or not
      if (!files) {
        return res.status(400).json({ message: "No files received." });
      }

      // configuration of path and name
      // old path where file availbale
      const oldPathimage = files.category_image[0].filepath; // Access the path of the uploaded image
      const oldPathicon = files.category_icon[0].filepath; // Access the path of the uploaded image

      // new path
      const nFileNameimage = `${Date.now()}.${
        files.category_image[0].originalFilename
      }`;
      const nFileNameicon = `${Date.now()}.${
        files.category_icon[0].originalFilename
      }`;
      // remove space
      const newFileNameicon = nFileNameicon.replace(/\s/g, "");
      const newFileNameimage = nFileNameimage.replace(/\s/g, "");

      // project dir
      const projectDirectory = path.resolve(
        __dirname,
        "../../../../../public/assets/upload/blog"
      );
      // combine path and image name
      const newPathicon = path.join(projectDirectory, newFileNameicon);
      const newPathimage = path.join(projectDirectory, newFileNameimage);

      fs.copyFile(oldPathimage, newPathimage, (moveErr1) => {
        if (moveErr1) {
          res.status(500).json({ message: "File move failed." });
        } else {
          fs.copyFile(oldPathicon, newPathicon, (moveErr2) => {
            if (moveErr2) {
              res.status(500).json({ message: "File move failed." });
            } else {
              const { category_title, category_description } = fields;
              conn.query(
                "INSERT INTO blog_category SET ? ",
                {
                  category_title: category_title,
                  category_description: category_description,
                  category_image: newFileNameimage,
                  category_icon: newFileNameicon,
                },
                (err, result) => {
                  if (err) {
                    res
                  .status(500)
                  .json({ message: "Error adding Blog category data" });
                  } else {
                    res.status(200).json(result);
                  }
                }
              );
            }
          });
        }
      });

    });
  }

  if (req.method == "GET") {
    try {
      // Query the database

      const q = "SELECT * FROM `blog_category`";
      console.log(q);
      const [rows] = await conn.query(q);
      console.log(rows);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    }
  }
}
