const express = require('express');
const multer = require('multer');
const { createReportInsident, createReportApar, createReportPotentialDanger, createReportP3k, getReportsP3k } = require('../controllers/reportController');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder untuk menyimpan file
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

// Rute untuk laporan APAR
router.post('/apar', upload.single('img_url'), createReportApar);
// router.post('/apar', upload.fields([{ name: 'img_url' }]), (req, res) => {
//     console.log(req.body);
//     console.log(req.files); // img_url will be here
//     res.send('File uploaded successfully');
// });


// Rute untuk laporan insiden dengan file bukti foto
router.post('/incident', upload.single('bukti_foto'), createReportInsident);
router.post('/potential-danger', upload.single('bukti_foto'), createReportPotentialDanger);
router.post('/p3k', createReportP3k);

router.get('/apar/edit/:id', reportController.editApar);
// Add this in your route file
router.put('/apar/update/:id', upload.single('img_url'), reportController.updateApar);

// Route untuk mengambil data report berdasarkan ID
router.get("/p3k/:id", reportController.getReportById);

// Route untuk mengupdate data report
router.put("/p3k/:id", reportController.updateReport);


module.exports = router;
