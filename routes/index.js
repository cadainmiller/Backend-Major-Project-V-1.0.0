const router = require("express").Router();

router.route("/").get((req, res) => {
  res.send("API IS WORKING");
});

module.exports = router;
