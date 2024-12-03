const express = require("express");
const router = express.Router();
const { getAllReportsPotentialDanger, getAllReportsIncident, getAllReportsApar, getAllReportsP3k } = require("../controllers/trackingController");

router.get("/potential-danger", getAllReportsPotentialDanger);
router.get("/incident", getAllReportsIncident);
router.get("/apar", getAllReportsApar);
router.get("/p3k", getAllReportsP3k);

module.exports = router;