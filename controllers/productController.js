const querystring = require("querystring");
const db = require("../config/connection");

exports.indexGet = (req, res, next) => {
  const sql = "SELECT * FROM products ORDER BY RAND() LIMIT 8";
  db.query(sql, (error, result) => {
    if(error) throw error;
    for(let i = 0; i < result.length; i++) {
      let imgArr = [];
      imgArr.push(result[i].imageURL.split(","));
      let imageArrSingle;
      imageArrSingle = imgArr[0];
      result[i].imageURL = imageArrSingle;
    }
    res.render('index', { 
      title: 'Reflex-Reality',
      indexProducts: result
    });
  });
}

exports.categoryGet = async (req, res, next) => {
  try {
    const lang = req.params.lang || null;
    const langData = querystring.parse(lang) || null;
    const categoryParam = req.params.category;
    const sql = `SELECT * FROM products WHERE product_category = "${categoryParam}" ORDER BY date_of_creation DESC`;
    db.query(sql, (error, result) => {
      if (error) throw error;
      for(let i = 0; i < result.length; i++) {
        let imgArr = [];
        if(result[i].imageURL) {
          imgArr.push(result[i].imageURL.split(","));
          let imageArrSingle;
          imageArrSingle = imgArr[0];
          result[i].imageURL = imageArrSingle;
        }
      }
      res.render("category", {
        title: "Reflex-Reality",
        categoryProducts: result,
        langData
      });
    });
  } catch (error) {
    next(error);
  }
}

exports.productDetail = async (req, res, next) => {
  try {
    const lang = req.params.lang || null;
    const langData = querystring.parse(lang) || null;
    const productParam = req.params.productId;
    const sql = `SELECT * FROM products WHERE id = "${productParam}"`;
    db.query(sql, (error, result) => {
      if(error) throw error;
      for(let i = 0; i < result.length; i++) {
        let imgArr = [];
        imgArr.push(result[i].imageURL.split(","));
        let imageArrSingle;
        imageArrSingle = imgArr[0];
        result[i].imageURL = imageArrSingle;
      }
      console.log(result);
      res.render("product", {
        title: "Reflex-Reality",
        product: result[0],
        langData
      });
    });
  } catch (error) {
    next(error);
  }
}

exports.contact = (req, res, next) => {
  const lang = req.params.lang || null;
  const langData = querystring.parse(lang) || null;
  res.render("contact", {
    title: "Reflex-Reality | Kontakt",
    langData
  });
}

exports.searchResults = async (req, res, next) => {
  try {
    const searchQuery = req.body;
    const searchTerm = searchQuery.search;
    const sql = `SELECT * FROM products WHERE MATCH (product_name,product_name_hu,product_detail,product_detail_hu,product_location,product_location_hu) AGAINST ("${searchTerm}") `;
    db.query(sql, (error, result) => {
      if(error) throw error;
      for(let i = 0; i < result.length; i++) {
        let imgArr = [];
        imgArr.push(result[i].imageURL.split(","));
        let imageArrSingle;
        imageArrSingle = imgArr[0];
        result[i].imageURL = imageArrSingle;
      }
      res.render("search_results", {
        title: "Reflex-Reality | Výsledky hľadania",
        searchProducts: result
      })
    });
  } catch (error) {
    next(error);
  }
}