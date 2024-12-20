const express = require('express');
const router = express.Router();
const verifController = require('../controllers/verifController');

// Route untuk mengupdate status laporan potensi bahaya
router.get('/potential-danger/:id', verifController.getReportPotentialDangerById);
router.get('/incident/:id', verifController.getReportIncidentById);
router.get('/apar/:id', verifController.getReportAparById);
router.get('/p3k/:id', verifController.getReportP3kById);

router.put('/potential-danger/:id', verifController.updateStatusPotentialDanger);
router.put('/incident/:id', verifController.updateStatusIncident);
router.put('/apar/:id', verifController.updateStatusApar);
router.put('/p3k/:id', verifController.updateStatusP3k);



module.exports = router;