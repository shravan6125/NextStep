
const express = require("express");
const requestController = require("../controllers/requestController");

const router = express.Router();

router.post("/", requestController.createRequest);
router.get("/:mentorId", requestController.getRequestsForMentor);
router.patch("/:requestId", requestController.updateRequestStatus);
router.get("/status/:studentId/:mentorId", requestController.getRequestStatus);
router.get("/accepted/:mentorId", requestController.getAcceptedRequestsForMentor);
module.exports = router;
