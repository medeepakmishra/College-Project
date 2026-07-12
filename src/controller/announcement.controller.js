import Announcement from "../models/announcement.model.js";

/* =====================================================
   CREATE ANNOUNCEMENT (ADMIN)
===================================================== */

// export const createAnnouncement = async (req, res) => {
//   try {

//     console.log("ANNOUNCEMENT BODY:",req.body);
// console.log("USER:",req.user);
//     const { title, description, category } = req.body;

//     if (!title || !description) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and description are required",
//       });
//     }

//     const announcement = await Announcement.create({
//       title,
//       description,
//       category,
//       createdBy: req.user._id,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Announcement created successfully",
//       announcement,
//     });

//   } catch (error) {
//     console.error("Create Announcement Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

export const createAnnouncement = async(req,res)=>{

try{

console.log("BODY:",req.body);

const announcement = await Announcement.create({

    title: req.body.title,

    description: req.body.message,

    createdBy: req.user._id

});

return res.status(201).json({
    success:true,
    announcement
});


}
catch(error){

console.log("CREATE ANNOUNCEMENT ERROR:",error);

return res.status(400).json({
    success:false,
    message:error.message
});

}

}
/* =====================================================
   GET ALL ANNOUNCEMENTS
===================================================== */

export const getAllAnnouncements = async (req, res) => {
  try {

    const announcements = await Announcement.find({
      isActive: true,
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalAnnouncements: announcements.length,
      announcements,
    });

  } catch (error) {
    console.error("Get Announcements Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* =====================================================
   GET ANNOUNCEMENT BY ID
===================================================== */

export const getAnnouncementById = async (req, res) => {
  try {

    const announcement = await Announcement.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!announcement || !announcement.isActive) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      announcement,
    });

  } catch (error) {
    console.error("Get Announcement Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* =====================================================
   UPDATE ANNOUNCEMENT (ADMIN)
===================================================== */

export const updateAnnouncement = async (req, res) => {
  try {

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });

  } catch (error) {
    console.error("Update Announcement Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* =====================================================
   DELETE ANNOUNCEMENT (SOFT DELETE)
===================================================== */

export const deleteAnnouncement = async (req, res) => {
  try {

    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    announcement.isActive = false;

    await announcement.save();

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });

  } catch (error) {
    console.error("Delete Announcement Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};