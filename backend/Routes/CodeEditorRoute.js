const express = require("express");
const router = express.Router();

const { aiResponse } = require("../Controllers/CodeEditor");

router.post("/get-response", aiResponse);

module.exports = router;
