import express from "express";
import { config } from "./config.js";
import fs, { readdirSync } from "fs";
import { mapTitleToKebabCase } from "./utils.js";

// probably converting from markdown to html is complicated, so I didn't want to reinvent the wheel, I just used this library that I found
import showdown from "showdown";
const converter = new showdown.Converter();

const app = express();

const {
  port,
  ARTICLES_PATH,
  DEFAULT_ROUTE_MESSAGE,
  BLOG_ROUTE,
  DEFAULT_ROUTE,
  NOT_FOUND_ROUTE,
  NOT_FOUND_ROUTE_MESSAGE,
  POSTS_ROUTE
} = config;
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

const getAllPosts = (res) => {
    fs.readdir(ARTICLES_PATH, (err, files) => {
        const html = `<html>${files.map(file=> `<li><a href="/blog/${mapTitleToKebabCase(file)}">${file}</a></li>`)}</html>`;
        res.send(html);
    });
};

const resetError = () => {
  error = null;
};

// here I watch for any added files to the folder. If a new file is added to the folder, the articles object will be updated
fs.watch(ARTICLES_PATH, (eventType, fileName) => {
  articles[mapTitleToKebabCase(fileName)] = fileName;
});

app.get(DEFAULT_ROUTE, (req, res) => {
  res.send(error || `<html><a href="/posts">See all available posts!</a></html>`);
  resetError();
});

app.get(POSTS_ROUTE, (req, res) => {
    getAllPosts(res);
});

app.get(NOT_FOUND_ROUTE, (req, res) => {
  res.send(error || NOT_FOUND_ROUTE_MESSAGE);
});

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

app.get(BLOG_ROUTE, (req, res) => {
  getPost(req.params.title.toLowerCase(), res);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export default app;
