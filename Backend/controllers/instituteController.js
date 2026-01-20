import Institute from "../models/Institute.js";
import User from "../models/User.js";

// Create a new institute (Admin only)
export const createInstitute = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Institute name is required" });
        }

        const newInstitute = new Institute({
            name,
            description,
            createdBy: req.userId,
        });

        const savedInstitute = await newInstitute.save();
        res.status(201).json(savedInstitute);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all institutes (Public/Auth for dropdowns)
export const getAllInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find().populate("createdBy", "name email");
        res.status(200).json(institutes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get institutes created by the logged-in admin
export const getMyInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find({ createdBy: req.userId });
        res.status(200).json(institutes);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update an institute (Owner Admin only)
export const updateInstitute = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const institute = await Institute.findById(id);

        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        if (institute.createdBy.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to update this institute" });
        }

        institute.name = name || institute.name;
        institute.description = description || institute.description;

        const updatedInstitute = await institute.save();
        res.status(200).json(updatedInstitute);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete an institute (Owner Admin only)
export const deleteInstitute = async (req, res) => {
    try {
        const { id } = req.params;

        const institute = await Institute.findById(id);

        if (!institute) {
            return res.status(404).json({ message: "Institute not found" });
        }

        if (institute.createdBy.toString() !== req.userId) {
            return res.status(403).json({ message: "Not authorized to delete this institute" });
        }

        await Institute.findByIdAndDelete(id);
        res.status(200).json({ message: "Institute deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
