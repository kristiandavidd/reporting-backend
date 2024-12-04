const db = require('../config/db'); // Import database connection

exports.createReportInsident = async (req, res) => {
    try {
        const {
            nama_pelapor,
            kategori,
            departemen,
            lokasi_insiden,
            jenis_kelamin,
            waktu_kejadian,
            no_telp,
            jenis_insiden,
            penyebab_insiden,
            penjelasan,
            masalah_penyebab,
            isKimia,
            tingkat_keparahan,
        } = req.body;

        // Pastikan file diupload
        const filePath = req.file ? req.file.path : null;

        // Pastikan masalah_penyebab adalah array atau string JSON yang valid
        let masalahPenyebabArray;
        if (Array.isArray(masalah_penyebab)) {
            masalahPenyebabArray = masalah_penyebab;
        } else if (typeof masalah_penyebab === 'string') {
            try {
                masalahPenyebabArray = JSON.parse(masalah_penyebab);
            } catch (error) {
                masalahPenyebabArray = [];
            }
        } else {
            masalahPenyebabArray = [];
        }

        // Query SQL untuk menyimpan data
        const query = `
            INSERT INTO report_incident (
                nama_pelapor, kategori, departemen, lokasi_insiden, jenis_kelamin, waktu_kejadian,
                no_telp, jenis_insiden, penyebab_insiden, penjelasan, masalah_penyebab, isKimia,
                tingkat_keparahan, bukti_foto
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Nilai untuk query
        const values = [
            nama_pelapor,
            kategori,
            departemen,
            lokasi_insiden,
            jenis_kelamin,
            waktu_kejadian,
            no_telp,
            jenis_insiden,
            penyebab_insiden,
            penjelasan,
            JSON.stringify(masalahPenyebabArray),  // Simpan array sebagai JSON string
            isKimia,
            tingkat_keparahan,
            filePath,
        ];

        // Simpan ke database
        const connection = await db.getConnection();
        const result = await connection.query(query, values);

        // Lepas koneksi setelah digunakan
        connection.release();

        // Berikan respon
        return res.status(201).json({
            message: 'Laporan berhasil disimpan ke database',
            data: { id: result.insertId, ...req.body, bukti_foto: filePath },
        });
    } catch (error) {
        console.error('Error saat menyimpan laporan:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createReportPotentialDanger = async (req, res) => {
    try {
        const {
            nama_pelapor,
            id_number,
            no_telp,
            waktu_kejadian,
            kategori,
            institusi,
            tujuan,
            lokasi_insiden,
            potensi_bahaya,
            resiko_bahaya,
            perbaikan,
        } = req.body;

        // Pastikan file diupload
        const filePath = req.file ? req.file.path : null;

        // Pastikan masalah_penyebab adalah array atau string JSON yang valid

        // Query SQL untuk menyimpan data
        const query = `
            INSERT INTO report_potential_danger (
                nama_pelapor, id_number, no_telp, waktu_kejadian, kategori, institusi, tujuan, lokasi_insiden,
                potensi_bahaya, resiko_bahaya, perbaikan, bukti_foto
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Nilai untuk query
        const values = [
            nama_pelapor,
            id_number,
            no_telp,
            waktu_kejadian,
            kategori,
            institusi,
            tujuan,
            lokasi_insiden,
            potensi_bahaya,
            resiko_bahaya,
            perbaikan,
            filePath,
        ];

        // Simpan ke database
        const connection = await db.getConnection();
        const result = await connection.query(query, values);

        // Lepas koneksi setelah digunakan
        connection.release();

        // Berikan respon
        return res.status(201).json({
            message: 'Laporan berhasil disimpan ke database',
            data: { id: result.insertId, ...req.body, bukti_foto: filePath },
        });
    } catch (error) {
        console.error('Error saat menyimpan laporan:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createReportApar = async (req, res) => {
    try {
        const {
            dept,
            ruang,
            lantai,
            jenis,
            ukuran,
            tgl_beli,
            tgl_isi,
            tgl_exp,
        } = req.body;

        const formattedTglBeli = tgl_beli || null;
        const formattedTglIsi = tgl_isi || null;
        const formattedTglExp = tgl_exp || null;


        // Ensure that the file exists in req.file (for single file uploads)
        const img_url = req.file ? req.file.path : null;

        // If no file was uploaded, img_url will be null

        // Save the report with the image URL (or without if no file)
        const query = `
            INSERT INTO report_apar (dept, ruang, lantai, jenis, ukuran, tgl_beli, tgl_isi, tgl_exp, img_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [dept, ruang, lantai, jenis, ukuran, formattedTglBeli, formattedTglIsi, formattedTglExp, img_url]);

        res.status(201).json({ message: 'Report created successfully' });
    } catch (error) {
        console.error('Error creating report:', error);
        res.status(500).json({ error: 'Failed to create report' });
    }
};

exports.createReportP3k = async (req, res) => {
    const { penanggungjawab, lantai, departemen, items } = req.body;

    try {
        // Simpan data pelaporan ke tabel utama
        const [result] = await db.query(
            "INSERT INTO report_p3k (penanggungjawab, lantai, departemen) VALUES (?, ?, ?)",
            [penanggungjawab, lantai, departemen]
        );

        const reportId = result.insertId;

        // Simpan data barang ke tabel items
        const itemsData = items.map(item => [reportId, item.name, item.stock, item.condition]);
        await db.query(
            "INSERT INTO report_p3k_items (report_id, name, stock, `condition`) VALUES ?",
            [itemsData]
        );

        res.status(201).json({ message: 'Report created successfully', reportId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create report', error });
    }
};

exports.editApar = async (req, res) => {
    try {
        const query = 'SELECT * FROM report_apar WHERE id = ?';
        const [rows] = await db.query(query, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Apar not found' });
        }

        res.json(rows[0]);  // Mengirimkan data kepada frontend
    } catch (error) {
        console.error('Error fetching apar data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

// Fungsi untuk memperbarui data berdasarkan ID
exports.updateApar = async (req, res) => {
    const { dept, ruang, lantai, jenis, ukuran, tgl_beli, tgl_isi, tgl_exp, status } = req.body;
    let img_url = req.body.img_url; // Jika tidak ada file baru, pakai img_url dari body (URL sebelumnya)

    try {
        // Menangani file upload jika ada file baru
        if (req.file) {
            // Menyimpan path file yang di-upload
            img_url = `/uploads/${req.file.filename}`;
        }

        // Mengonversi tgl_beli, tgl_isi, tgl_exp ke format yang diterima MySQL (YYYY-MM-DD HH:MM:SS)
        const formattedTglBeli = new Date(tgl_beli).toISOString().slice(0, 19).replace('T', ' ');
        const formattedTglIsi = new Date(tgl_isi).toISOString().slice(0, 19).replace('T', ' ');
        const formattedTglExp = new Date(tgl_exp).toISOString().slice(0, 19).replace('T', ' ');

        // Query untuk memperbarui data
        const query = `
            UPDATE report_apar 
            SET dept = ?, ruang = ?, lantai = ?, jenis = ?, ukuran = ?, tgl_beli = ?, tgl_isi = ?, tgl_exp = ?, img_url = ?, status = ?
            WHERE id = ?
        `;

        const result = await db.query(query, [dept, ruang, lantai, jenis, ukuran, formattedTglBeli, formattedTglIsi, formattedTglExp, img_url, status, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Apar not found' });
        }

        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating apar data:', error);
        res.status(500).json({ error: 'Failed to update data' });
    }
};

exports.getReportById = async (req, res) => {
    const { id } = req.params;

    try {
        const [reportRows] = await db.execute("SELECT * FROM report_p3k WHERE id = ?", [id]);

        if (reportRows.length === 0) {
            return res.status(404).json({ message: "Report not found" });
        }

        const report = reportRows[0];

        const [itemsRows] = await db.execute("SELECT * FROM report_p3k_items WHERE report_id = ?", [id]);

        report.items = itemsRows;

        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update report
exports.updateReport = async (req, res) => {
    const { id } = req.params;
    const { penanggungjawab, lantai, departemen, items } = req.body;

    try {
        // Start a transaction to ensure consistency
        const connection = await db.getConnection();
        await connection.beginTransaction();

        // Update report utama
        const [updateReportResult] = await connection.execute(
            "UPDATE report_p3k SET penanggungjawab = ?, lantai = ?, departemen = ? WHERE id = ?",
            [penanggungjawab, lantai, departemen, id]
        );

        if (updateReportResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Report not found" });
        }

        // Update items
        if (items && items.length > 0) {
            for (const item of items) {
                await connection.execute(
                    "UPDATE report_p3k_items SET name = ?, stock = ?, `condition` = ? WHERE id = ? AND report_id = ?",
                    [item.name, item.stock, item.condition, item.id, id]
                );
            }
        }

        await connection.commit();
        res.json({ message: "Report updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};