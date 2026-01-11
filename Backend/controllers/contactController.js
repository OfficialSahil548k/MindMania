import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
    const contactData = req.body;
    const newContact = new Contact(contactData);

    try {
        await newContact.save();
        res.status(201).json(newContact);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
