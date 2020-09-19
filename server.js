import fs from "fs";
import express from "express";
import showdown from "showdown";
// probably converting from markdown to html is complicated, so I didn't want to reinvent the wheel, I just used this library that I found
import { mapTitleToKebabCase } from "./utils.js";
import { config } from "./config.js";
import { initApp } from "./initApp.js";

const {
  port,
  POSTS_PATH,
  BLOG_ROUTE,
  DEFAULT_ROUTE,
  NOT_FOUND_ROUTE,
  NOT_FOUND_ROUTE_MESSAGE,
  POSTS_ROUTE,
  UPLOAD_ROUTE,
} = config;

const app = express();
const converter = new showdown.Converter();

// posts is the object where we keep the mapping between the original file name and the kebab-case one
const posts = {};

// an error object that will hold all the errors of the app. Before sending any response to the client, I verify if the app has any error.
// I am aware that there are other methods for error handling and this is not the best.
let error = null;

const resetError = () => {
  error = null;
};

// this tell express what to use
initApp(app);

// here I watch for any added files to the folder. If a new file is added to the folder, the posts object will be updated
fs.watch(POSTS_PATH, (eventType, fileName) => {
  posts[mapTitleToKebabCase(fileName)] = fileName;
});

// this function reads all the files from the posts folder and populates the posts object with the corresponding original filename to the kebab-case
(() => {
  fs.readdir(POSTS_PATH, (err, files) => {
    if (err) {
      error = err;
    }
    files.forEach((file) => {
      posts[mapTitleToKebabCase(file)] = file;
    });
  });
})();

// this render all the posts
const getAllPosts = (res) => {
  res.render("posts", {
    // root: "./",
    posts,
  });
  resetError();
};

//this will render the converted file
const getPost = (title, res) => {
  if (posts[title]) {
    fs.readFile(`${POSTS_PATH}/${posts[title]}`, (err, data) => {
      error = err || error;
      res.send(error || converter.makeHtml(data.toString()));
    });
  } else {
    res.redirect(NOT_FOUND_ROUTE);
  }
  resetError();
};

app.get(DEFAULT_ROUTE, (req, res) => {
  if (error) {
    res.send(error);
  } else {
    res.render("default", { UPLOAD_ROUTE, POSTS_ROUTE });
  }
  resetError();
});

app.get(UPLOAD_ROUTE, (req, res) => {
  if (error) {
    res.send(error);
  } else {
    res.render("uploadPost", { UPLOAD_ROUTE });
  }
  resetError();
});

app.post(UPLOAD_ROUTE, (req, res) => {
  fs.writeFile(
    `${POSTS_PATH}/${req.files.upload.name}`,
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
  console.log(`Server startd:${port}`);
});

export default app;
