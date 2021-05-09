const mysql = require("mysql");

// database - create connection
const db = mysql.createConnection({
  host: "localhost",
  user: "reflexdata",
  password: process.env.DB_PASSWORD,
  database: "reflexdata"
});

// database - connect
db.connect(function (err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }

  console.log('Connected as id ' + db.threadId);
});

module.exports = db;