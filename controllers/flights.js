const knex = require("../db/knex.js");

module.exports = {
  // CHANGE ME TO AN ACTUAL FUNCTION
  goHome: (req, res) => {
    res.render("index")
  },
  
  getLogin: (req, res) => {
    res.render("login")
  }
}
