const express = require("express");
const router = express.Router();

const { aiResponse,executeCode } = require("../Controllers/CodeEditor");

router.post("/get-response", aiResponse);
router.post("/execute-code", executeCode);

module.exports = router;
