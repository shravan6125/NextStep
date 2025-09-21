const User = require("../Models/User"); 
const Mentor = require("../Models/Mentor"); 
const MentorshipRequest = require("../Models/MentorshipRequest");

exports.createRequest = async (req, res) => {
  try {
    console.log(" Mentorship Request Received:", req.body);
    const { studentId, mentorId, message } = req.body;

    //  Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    //  Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    //  Check if a pending or accepted request already exists
    const existingRequest = await MentorshipRequest.findOne({
      studentId,
      mentorId,
      status: { $in: ["pending", "accepted"] }, // Check both pending & accepted requests
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(400).json({ error: "You have already sent a request to this mentor." });
      } else if (existingRequest.status === "accepted") {
        return res.status(400).json({ error: "You are already connected with this mentor. Start chatting!" });
      }
    }

    //  Save new request with status "pending"
    const request = new MentorshipRequest({ studentId, mentorId, message, status: "pending" });
    await request.save();

    console.log(" Request saved successfully:", request);
    res.status(201).json({ message: "Mentorship request sent successfully!", request });
  } catch (error) {
    console.error(" Server error:", error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};


  const mongoose = require("mongoose"); 
  exports.getRequestsForMentor = async (req, res) => {
    try {
        let { mentorId } = req.params;

        console.log(` Received Mentor ID: ${mentorId}`);

        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: "Invalid Mentor ID format" });
        }

        const requests = await MentorshipRequest.find({ mentorId, status: "pending" })
            .populate("studentId", "name email profileImage"); 

        if (!requests || requests.length === 0) {
            console.log(" No pending requests found.");
            return res.status(200).json([]); 
        }

        console.log(" Pending Requests Found:", requests);
        res.status(200).json(requests);
    } catch (error) {
        console.error(" Error fetching mentor requests:", error);
        res.status(500).json({ message: "Error fetching requests", error: error.message });
    }
};

  exports.updateRequestStatus = async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
  
      // Update request status (Accepted or Rejected)
      const updatedRequest = await MentorshipRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({ error: "Request not found" });
      }
  
      //  If accepted, allow chat access
      if (status === "accepted") {
        console.log(" Mentorship request accepted. Chat enabled.");
      } else if (status === "rejected") {
        console.log(" Mentorship request rejected.");
      }
  
      res.status(200).json({ message: "Request updated", request: updatedRequest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  exports.getRequestStatus = async (req, res) => {
    try {
        const { studentId, mentorId } = req.params;
        const request = await MentorshipRequest.findOne({ studentId, mentorId });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        res.json({ status: request.status });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving request status", error });
    }
};;




exports.getAcceptedRequestsForMentor = async (req, res) => {
    try {
        let { mentorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(mentorId)) {
            return res.status(400).json({ message: "Invalid Mentor ID format" });
        }

        mentorId = new mongoose.Types.ObjectId(mentorId);

        const acceptedRequests = await MentorshipRequest.find({ mentorId, status: "accepted" })
            .populate("studentId", "name email profileImage");

        res.status(200).json(acceptedRequests);
    } catch (error) {
        console.error(" Error fetching accepted mentorships:", error);
        res.status(500).json({ message: "Error fetching accepted mentorships", error: error.message });
    }
};
