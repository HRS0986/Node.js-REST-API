const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/facilities.json");
const db = low(adapter);

// Add Facility  - OK
async function addFacility(facility) {
  db.setState(db.getState());
  const ID = +db.get("facilities").last().value().id + 1;
  facility["id"] = ID;
  await db.get("facilities").push(facility).write();
}

// Delete Facility - OK
async function deleteFacility(facilityId) {
  console.log(facilityId);
  db.setState(db.getState());
  await db
    .get("facilities")
    .remove((facility) => facility.id == facilityId)
    .write();
}

// Update Facility - OK
async function updateFacility(facility, id) {
  db.setState(db.getState());
  await db
    .get("facilities")
    .find((facility) => facility.id == id)
    .assign(facility)
    .write();
}

// Get All Facilities - OK
function getAllFacilities() {
  db.setState(db.getState());
  return db.get("facilities").value();
}

// Get Specific Facility - OK
function getFacility(facilityId) {
  db.setState(db.getState());
  return db
    .get(`facilities`)
    .find((facility) => facility.id == facilityId)
    .value();
}

module.exports = {
  addFacility,
  deleteFacility,
  getFacility,
  getAllFacilities,
  updateFacility,
};
