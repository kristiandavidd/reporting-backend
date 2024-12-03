const db = require('../config/db'); // Import database connection

exports.getAllReportsPotentialDanger = async (req, res) => {
    try {
        const query = `SELECT * FROM report_potential_danger ORDER BY created_at DESC`;
        const connection = await db.getConnection();
        const [results] = await connection.query(query);
        connection.release();

        // Berikan respon data
        return res.status(200).json({
            message: "Data laporan berhasil diambil.",
            data: results,
        });
    } catch (error) {
        console.error("Error saat mengambil laporan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllReportsIncident = async (req, res) => {
    try {
        const query = `SELECT * FROM report_incident ORDER BY created_at DESC`;
        const connection = await db.getConnection();
        const [results] = await connection.query(query);
        connection.release();

        // Berikan respon data
        return res.status(200).json({
            message: "Data laporan berhasil diambil.",
            data: results,
        });
    } catch (error) {
        console.error("Error saat mengambil laporan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllReportsApar = async (req, res) => {
    try {
        const query = `SELECT * FROM report_apar ORDER BY created_at DESC`;
        const connection = await db.getConnection();
        const [results] = await connection.query(query);
        connection.release();

        // Berikan respon data
        return res.status(200).json({
            message: "Data laporan berhasil diambil.",
            data: results,
        });
    } catch (error) {
        console.error("Error saat mengambil laporan:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.getAllReportsP3k = async (req, res) => {
    try {
        const [reports] = await db.query("SELECT * FROM report_p3k");
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch reports', error });
    }
};