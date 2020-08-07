const express = require("express");
const multer = require("multer");

const userController = require("./controllers/UserController");
const eventController = require("./controllers/EventController");
const dashboardController = require("./controllers/DashboardController");
const loginController = require("./controllers/LoginController");
const registrationController = require("./controllers/RegistrationController");
const uploadConfig = require("./config/upload");
const approvalController = require("./controllers/ApprovalController");
const rejectionController = require("./controllers/RejectionController");
const verifyToken = require("./config/verifyToken");
const RegistrationController = require("./controllers/RegistrationController");

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get("/status", (req, res) => {
  res.send({
    status: 200,
  }); //send response
});

//Registration
routes.post(
  "/registration/:eventId",
  verifyToken,
  registrationController.create
);
routes.get(
  "/registration",
  verifyToken,
  RegistrationController.getMyRegistrations
);
routes.get(
  "/registration/:registration_id",
  registrationController.getRegistration
);
routes.post(
  "/registration/:registration_id/approvals",
  verifyToken,
  approvalController.approval
);
routes.post(
  "/registration/:registration_id/rejections",
  verifyToken,
  rejectionController.rejection
);

//Login
routes.post("/login", loginController.store);

//Dashboard
routes.get("/dashboard/:sport", verifyToken, dashboardController.getAllEvents); //Middleware checks for token before moving to controller
routes.get("/dashboard", verifyToken, dashboardController.getAllEvents);
routes.get("/user/events", verifyToken, dashboardController.getEventsByUserId);
routes.get("/event/:eventId", verifyToken, dashboardController.getEventById);

//Events
routes.post(
  "/event",
  verifyToken,
  upload.single("thumbnail"),
  eventController.createEvent
);

routes.delete("/event/:eventId", verifyToken, eventController.delete);

//Users
routes.post("/user/register", userController.createUser);

routes.get("/user/:userId", userController.getUserById);

module.exports = routes;
