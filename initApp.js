import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

export const initApp = (app) => {
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  app.use(
    fileUpload({
      createParentPath: true,
    })
  );

  app.set("view engine", "ejs");

  app.set("views", "./views");

  app.use(bodyParser.urlencoded({ extended: false }));
};
