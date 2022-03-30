module.exports = function (app, config, passport) {
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

  var text = { "hello.txt": "Hello World!", "bye.txt": "Goodbye Cruel World!" };
  app.get("/files/:name", function (req, res) {
    if (req.isAuthenticated()) {
      res.set({
        "Content-Disposition": `attachment; filename="${req.params.name}"`,
      });
      res.send(text[req.params.name]);
    } else {
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
      res.redirect(req.session.returnTo || "/");
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
