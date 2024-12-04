
const db = require('../config/db'); // Sesuaikan dengan koneksi database Anda

// Fungsi untuk mengupdate status laporan
const updateStatusPotentialDanger = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        const [result] = await db.execute(
            'UPDATE report_potential_danger SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ message: 'Failed to update status' });
    }
};

const updateStatusIncident = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        const [result] = await db.execute(
            'UPDATE report_incident SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ message: 'Failed to update status' });
    }
};

const updateStatusApar = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        const [result] = await db.execute(
            'UPDATE report_apar SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ message: 'Failed to update status' });
    }
};

const updateStatusP3k = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        const [result] = await db.execute(
            'UPDATE report_p3k SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).json({ message: 'Failed to update status' });
    }
};

const getReportAparById = async (req, res) => {
    const { id } = req.params;

    try {
        // Query the database to get the report
        const [rows] = await db.execute('SELECT * FROM report_apar WHERE id = ?', [id]);

        // If the report is not found, return a 404 response
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Return the report data
        return res.json({ data: rows[0] });
    } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const getReportP3kById = async (req, res) => {
    const { id } = req.params;

    try {
        // Query the database to get the report and related items
        const [rows] = await db.execute(`
            SELECT rp.*, rpi.name, rpi.stock, rpi.condition 
            FROM report_p3k rp
            LEFT JOIN report_p3k_items rpi ON rp.id = rpi.report_id
            WHERE rp.id = ?`, [id]);

        // If the report is not found, return a 404 response
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Organize data into report and items
        const report = rows[0];
        const items = rows.map(row => ({
            name: row.name,
            stock: row.stock,
            condition: row.condition
        }));

        return res.json({
            data: {
                report: {
                    id: report.id,
                    name: report.penanggungjawab,
                    lantai: report.lantai,
                    departemen: report.departemen,
                    date: report.created_at,
                    status: report.status
                },
                items
            }
        });
    } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};


const getReportIncidentById = async (req, res) => {
    const { id } = req.params;

    try {
        // Query the database to get the report
        const [rows] = await db.execute('SELECT * FROM report_incident WHERE id = ?', [id]);

        // If the report is not found, return a 404 response
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Return the report data
        return res.json({ data: rows[0] });
    } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

const getReportPotentialDangerById = async (req, res) => {
    const { id } = req.params;

    try {
        // Query the database to get the report
        const [rows] = await db.execute('SELECT * FROM report_potential_danger WHERE id = ?', [id]);

        // If the report is not found, return a 404 response
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Return the report data
        return res.json({ data: rows[0] });
    } catch (error) {
        console.error('Error fetching report:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    updateStatusPotentialDanger,
    updateStatusIncident,
    updateStatusApar,
    updateStatusP3k,
    getReportAparById,
    getReportP3kById,
    getReportIncidentById,
    getReportPotentialDangerById
};
