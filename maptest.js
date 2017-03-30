const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});


function findName (name, callback) {
client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query("SELECT * FROM users", (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    callback(result.rows);
  });
});
}

findName(process.argv[2], function(data) {
console.log(data);
client.end();
});
