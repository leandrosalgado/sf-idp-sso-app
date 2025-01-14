module.exports = function (app, config, passport) {
  const folderPath = __dirname;

  app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
      res.render("index.html", {
        user: req.user,
        title: config.app.name,
        backUrl: config.app.backUrl,
      });
    } else {
      res.redirect("/login");
    }
  });

  app.get(
    "/login",
    passport.authenticate(config.passport.strategy, {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.get("/files/:name", function (req, res) {
    if (req.isAuthenticated()) {
      const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      console.log({ originalUrl: fullUrl });
      res.location(fullUrl);

      res.download(`${folderPath}/helloworld.txt`, req.params.name, (err) => {
        if (err) {
          console.error(err);
        }
      });
    } else {
      console.log({ redirectUrl: req.session.returnTo });
      req.session.returnTo = req.originalUrl;
      res.redirect("/login");
    }
  });

  app.post(
    "/login/callback",
    passport.authenticate(config.passport.strategy, {
      failureRedirect: "/",
      failureFlash: true,
    }),
    function (req, res) {
      const redirectTo = req.session.returnTo || "/";
      console.log(redirectTo);
      res.redirect(redirectTo);
      delete req.session.returnTo;
    }
  );

  app.get("/signup", function (req, res) {
    res.render("signup");
  });

  app.get("/profile", function (req, res) {
    console.log({ user: req.user });
    if (req.isAuthenticated()) {
      res.render("profile.html", {
        user: req.user,
        title: config.app.name,
      });
    } else {
      res.redirect("/login");
    }
  });

  app.get("/logout", function (req, res) {
    req.logout();
    // TODO: invalidate session on IP
    res.redirect("/");
  });
};
