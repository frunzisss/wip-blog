import express from "express";
import { config } from "./config.js";
import fs from "fs";
import { mapTitleToKebabCase } from "./utils.js";

// probably converting from markdown to html is complicated, so I didn't want to reinvent the wheel, I just used this library that I found
import showdown from "showdown";
import { initApp } from "./initApp.js";
const converter = new showdown.Converter();

const {
  port,
  ARTICLES_PATH,
  BLOG_ROUTE,
  DEFAULT_ROUTE,
  NOT_FOUND_ROUTE,
  NOT_FOUND_ROUTE_MESSAGE,
  POSTS_ROUTE,
  ADD_ROUTE,
} = config;

const app = express();
initApp(app);

// here I watch for any added files to the folder. If a new file is added to the folder, the articles object will be updated
fs.watch(ARTICLES_PATH, (eventType, fileName) => {
  articles[mapTitleToKebabCase(fileName)] = fileName;
});

// articles is the object where we keep the mapping between the original file name and the kebab-case one
const articles = {};

// an error object that will hold all the errors of the app. Before sending any response to the client, I verify if the app has any error.
// I am aware that there are other methods for error handling and this is not the best.
let error = null;

// this function reads all the files from the posts folder and populates the articles object with the corresponding original filename to the kebab-case
const readFiles = (() => {
  fs.readdir(ARTICLES_PATH, (err, files) => {
    if (err) {
      error = err;
    }
    files.forEach((file) => {
      articles[mapTitleToKebabCase(file)] = file;
    });
  });
})();

// this is getting all the posts which are inserted into the ejs template
const getAllPosts = (res) => {
  fs.readdir(ARTICLES_PATH, (err, files) => {
    if (error) {
      res.send(error);
    } else {
      res.render("articles", {
        root: "./",
        files: files.map((file) => mapTitleToKebabCase(file)),
      });
    }
    resetError();
  });
};

//this will render the file
const getPost = (title, res) => {
  if (articles[title]) {
    const t = fs.readFile(
      `${ARTICLES_PATH}/${articles[title]}`,
      (err, data) => {
        error = err || error;
        res.send(error || converter.makeHtml(data.toString()));
        resetError();
      }
    );
  } else {
    res.redirect(NOT_FOUND_ROUTE);
  }
  resetError();
};

const resetError = () => {
  error = null;
};

app.get(DEFAULT_ROUTE, (req, res) => {
  if (error) {
    res.send(error);
  } else {
    res.sendFile("./htmlPages/default.html", { root: "./" });
  }
  resetError();
});

app.get(ADD_ROUTE, (req, res) => {
  if (error) {
    res.send(error);
  } else {
    res.sendFile("./htmlPages/addNewFile.html", { root: "./" });
  }
  resetError();
});

app.post(ADD_ROUTE, (req, res) => {
  fs.writeFile(
    `${ARTICLES_PATH}/${req.files.upload.name}`,
    req.files.upload.data,
    () => {
      res.redirect(POSTS_ROUTE);
    }
  );
});

app.get(POSTS_ROUTE, (req, res) => {
  getAllPosts(res);
});

app.get(NOT_FOUND_ROUTE, (req, res) => {
  res.send(error || NOT_FOUND_ROUTE_MESSAGE);
});

app.get(BLOG_ROUTE, (req, res) => {
  getPost(req.params.title.toLowerCase(), res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
