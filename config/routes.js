module.exports = function (app, config, passport) {
  app.get(
    "/",
    passport.authenticate(config.passport.strategy, {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    function (req, res) {
      if (req.isAuthenticated()) {
        res.render("index.html", {
          user: req.user,
          title: config.app.name,
          backUrl: config.app.backUrl,
        });
      } else {
        res.render("index.html", {
          user: null,
          title: config.app.name,
          backUrl: config.app.backUrl,
        });
      }
    }
  );

  app.get(
    "/login",
    passport.authenticate(config.passport.strategy, {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.post(
    "/login/callback",
    passport.authenticate(config.passport.strategy, {
      failureRedirect: "/",
      failureFlash: true,
    }),
    function (req, res) {
      res.redirect("/");
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
