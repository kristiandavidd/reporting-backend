
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

module.exports = {
    updateStatusPotentialDanger,
    updateStatusIncident,
    updateStatusApar,
    updateStatusP3k
};
