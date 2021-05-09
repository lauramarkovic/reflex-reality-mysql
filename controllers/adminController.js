const cloudinary = require("cloudinary");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const passport = require("passport");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const db = require("../config/connection");

// Express validator setup
const {
  check,
  body,
  validationResult
} = require("express-validator");

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Nodemailer setup
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

exports.adminGet = (req, res) => {
  res.render("admin", {
    title: "Reflex-Reality | Admin"
  });
}

exports.registerGet = (req, res) => {
  res.render("register", {
    title: "Reflex-Reality | Registrácia",
    errors: false
  });
}

exports.registerPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("register", {
      title: "Reflex-Reality | Errors occured",
      errors: errors.array()
    });
    return;
  } else {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name || null;
    const email = req.body.email;
    const password = req.body.password;
    // const resetToken = null;
    // const resetTokenExpiration = null;
    // const isAdmin = 0;
    bcrypt.hash(password, 12).then((hashedPassword) => {
      db.query("INSERT INTO users (first_name, last_name, email, password) VALUES(?,?,?,?)", [firstName, lastName, email, hashedPassword], (error, result) => {
        if (error) throw error;
        res.redirect("/admin");
        transporter.sendMail({
          to: email,
          from: "reflex-reality@reflex-reality.sk",
          subject: "Úspešná registrácia!",
          html: {
            path: "public/pages/email_template.html"
          }
        })
      });
    });
  }
}

exports.loginPost = passport.authenticate("local-login", {
  successRedirect: "/",
  successFlash: "Boli ste úspešne prihlásený!",
  failureRedirect: "/admin",
  failureFlash: "Nepodarilo sa Vám prihlásiť, skúste znova!"
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("info", "Boli ste úspešne odhlásený.");
  res.redirect("/");
}

exports.userGet = async (req, res) => {
  try {
    const userId = req.params.userId;
    const sql = `SELECT * FROM users WHERE id = ${userId}`;
    db.query(sql, (error, result) => {
      console.log(result);
      res.render("user", {
        title: "Reflex-Reality | Môj profil",
        user: result[0]
      });
    });
  } catch (error) {
    next(error);
  }
}

exports.createProductGet = (req, res) => {
  res.render("new", {
    title: "Pridať novú ponuku",
    updating: false,
    deleting: false,
    errors: false
  });
}

exports.createProductPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("new", {
        title: "Pridať ponuku | Vyskytla sa chyba",
        updating: false,
        deleting: false,
        errors: errors.array()
      });
      return;
    } else {
      const formData = {
        product_category: req.body.product_category,
        product_name: req.body.product_name,
        product_name_hu: req.body.product_name_hu,
        product_detail: req.body.product_detail,
        product_detail_hu: req.body.product_detail_hu,
        product_area: req.body.product_area || null,
        product_location: req.body.product_location,
        product_location_hu: req.body.product_location_hu,
        product_price: req.body.product_price,
        product_price_hu: req.body.product_price_hu,
        imageURL: req.body.imageURL || null,
        imageID: req.body.imageID || null,
        date_of_creation: req.body.date_of_creation
      }

      const sql = "INSERT INTO products SET ?";

      await db.query(sql, formData, (error, result) => {
        if (error) throw error;
        req.flash("success", `Ponuka '${formData.product_name}' bola úspešne pridaná.`);
        res.redirect(`/all/${formData.product_category}`);
      });
    }
  } catch (error) {
    next(error);
  }
}

exports.updateProductGet = async (req, res, next) => {
  try {
    const updateMode = req.query.update;
    if (!updateMode) {
      return res.redirect("/");
    }
    const productId = req.params.productId;
    const sql = `SELECT * FROM products WHERE id = ${productId}`;
    db.query(sql, (error, result) => {
      if (error) throw error;
      res.render("new", {
        title: "Upraviť ponuku",
        updating: updateMode,
        deleting: false,
        product: result[0],
        errors: false
      });
    })
  } catch (error) {
    next(error);
  }
}

exports.updateProductPost = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const updatedFormData = {
      product_category: req.body.product_category,
      product_name: req.body.product_name,
      product_name_hu: req.body.product_name_hu,
      product_detail: req.body.product_detail,
      product_detail_hu: req.body.product_detail_hu,
      product_area: req.body.product_area || null,
      product_location: req.body.product_location,
      product_location_hu: req.body.product_location_hu,
      product_price: req.body.product_price,
      product_price_hu: req.body.product_price_hu,
      imageURL: req.body.imageURL || null,
      imageID: req.body.imageID || null,
      date_of_creation: req.body.date_of_creation
    }
    const sql = `UPDATE products SET ? WHERE id = ${productId}`;
    db.query(sql, updatedFormData, (error, result) => {
      if(error) throw error;
      req.flash("success", `Ponuka '${updatedFormData.product_name}' bola úspešne zmenená.`);
      res.redirect(`/all/${updatedFormData.product_category}/id/${productId}`);
    });
  } catch (error) {
    next(error);
  }
}

exports.deleteProductGet = async (req, res, next) => {
  try {
    const deleteMode = req.query.delete;
    if (!deleteMode) {
      return res.redirect("/");
    }
    const productId = req.params.productId;
    const sql = `SELECT * FROM products WHERE id = ${productId}`;
    db.query(sql, (error, result) => {
      if (error) throw error;
      res.render("new", {
        title: "Vymazať ponuku",
        deleting: deleteMode,
        updating: false,
        product: result[0],
        errors: false
      });
    });
  } catch (error) {
    next(error);
  }
}

exports.deleteProductPost = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const sql = `DELETE FROM products WHERE id = ${productId}`;
    db.query(sql, (error, result) => {
      if(error) throw error;
      req.flash("info", `Ponuka číslo '${productId}' bola úspešne odstránená.`);
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
}

exports.deleteFromCloudinary = async (req, res, next) => {
  try {
    if (req.body.imageID) {
      const stringID = req.body.imageID;
      const publicIDS = stringID.split(",");
      console.log(publicIDS);

      for (let i = 0; i < publicIDS.length; i++) {
        await cloudinary.v2.uploader.destroy(publicIDS[i])
          .then(result => {
            next();
          })
          .catch(() => {
            res.redirect("/admin/add-product");
          })
      }

    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

exports.resetGet = (req, res, next) => {
  res.render("reset", {
    title: "Reflex-Reality | Zmena hesla"
  });
}

exports.resetPost = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const emailField = req.body.email;
    const sql = `SELECT * FROM users WHERE email = "${emailField}"`;
    db.query(sql, (error, result) => {
      if (error) throw error;
      if (!result[0]) {
        req.flash("error", "Nenašiel sa účet k uvedenej e-mailovej adrese.");
        return res.redirect("/reset");
      }
      const date = Date.now();
      const expDate = date + 3600000;
      const newDate = Number(expDate);
      tokenAddition = {
        resetToken: token,
        resetTokenExpiration: newDate
      }
      const sql2 = `UPDATE users SET ? WHERE email = "${emailField}"`;
      db.query(sql2, tokenAddition, (error, result) => {
        if (error) throw error;
        req.flash("info", "Zaslali sme Vám e-mail s odkazom na obnovu hesla.");
        res.redirect("/admin");
        transporter.sendMail({
          to: req.body.email,
          from: "reflex-reality@reflex-reality.sk",
          subject: "Žiadosť o zmenu hesla",
          html: `
          <p>Vážený klient, <br> Zaznamenali sme Vašu požiadavku o zmenu hesla. <br> Kliknite na nasledovný odkaz: <a href="http://localhost:3000/reset/${token}">LINK</a></p>
          `
        });
      })
    })
  })
}

exports.newPasswordGet = (req, res, next) => {
  const token = req.params.token;
  const currDate = Date.now();
  const currDateToNumber = Number(currDate);
  console.log(currDateToNumber);
  const sql = `SELECT * FROM users WHERE resetToken = "${token}" AND resetTokenExpiration > "${currDateToNumber}"`;
  db.query(sql, (error, result) => {
    if (error) throw error;
    if(!result.length) {
      req.flash("error", "Platnosť obnovy hesla už vypršala!");
      res.redirect("/admin");
    }
    if(result.length) {
      res.render("new_password", {
        title: "Reflex-Reality | Zmena hesla",
        userId: result[0].id,
        passwordToken: token
      });
    }
  })
}

exports.newPasswordPost = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const sql = `SELECT * FROM users WHERE id = ${userId}`;
  db.query(sql, (error, result) => {
    if(error) throw error;
    bcrypt.hash(newPassword, 12).then((hashedPassword) => {
      const newData = {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiration: undefined
      }
      const sql2 = `UPDATE users SET ? WHERE id = ${userId}`;
      db.query(sql2, newData, (error, result) => {
        if(error) throw error;
        console.log(result);
        req.flash("success", "Vaše heslo je úspešne zmenené!");
        res.redirect("/admin");
      })
    })
  })
}

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    next();
    return;
  }
  res.redirect("/");
}