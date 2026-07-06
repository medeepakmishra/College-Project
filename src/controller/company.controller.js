import Company from "../models/company.model.js";

/* =====================================================
   CREATE COMPANY (Admin)
===================================================== */
export const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      website,
      logo,
      description,
      hrName,
      hrEmail,
      hrContact,
    } = req.body;

    // Validation
    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    // Check duplicate
    const existingCompany = await Company.findOne({
      companyName: companyName.trim(),
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "Company already exists",
      });
    }

    const company = await Company.create({
      companyName,
      website,
      logo,
      description,
      hrName,
      hrEmail,
      hrContact,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   GET ALL COMPANIES
===================================================== */
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalCompanies: companies.length,
      companies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   GET COMPANY BY ID
===================================================== */
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!company || !company.isActive) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   UPDATE COMPANY
===================================================== */
export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   DELETE COMPANY (Soft Delete)
===================================================== */
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    company.isActive = false;

    await company.save();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};