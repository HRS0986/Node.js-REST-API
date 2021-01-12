const express = require("express");
const passport = require("passport");
const router = express.Router();
const facilitiesController = require("../controllers/facilities");


// Get specific facility
router.get("/:id", passport.authenticate("jwt"), function (req, res) {
  const ID = parseInt(req.params.id);
  const facility = facilitiesController.getFacility(ID);
  res.status(200).send(facility);
});


// Delete Facility
router.delete("/:id", passport.authenticate("jwt"), function (req, res) {
  const ID = parseInt(req.params.id);
  facilitiesController
    .deleteFacility(ID)
    .then((data) => {
      res.status(200).send("Facility Deleted");
    })
    .catch((err) => {
      res.status(500).send("Delete Failed");
    });
});


// Get all facilities
router.get("/", passport.authenticate("jwt"), function (req, res) {
  const data = facilitiesController.getAllFacilities();
  res.status(200).send(data);
});


// Add new facility
router.post("/", passport.authenticate("jwt"), function (req, res) {
  const facility = req.body;
  facilitiesController
    .addFacility(facility)
    .then(res.status(201).send("Facility Added"))
    .catch((err) => console.log("Failed to add facility", err));
});


// Update Facility
router.put("/:id", passport.authenticate("jwt"), function (req, res) {
  const ID = req.params.id;
  facilitiesController
    .updateFacility(req.body, ID)
    .then((data) => res.status(200).send("Facility Updated"))
    .catch((err) => res.status(500).send("Failed to update facility"));
});

module.exports = router;
