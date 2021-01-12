const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/users.json");
const db = low(adapter);

function addUser(user) {
  db.setState(db.getState());
  const ID = db.get("users").size().value() + 1;
  const isUser = db.get("users").find({ email: user.email }).value();
  if (!isUser) {
    user["id"] = ID;
    db.get("users")
      .push(user)
      .write()      
    return true;
  }
  return false;
}

function deleteUser(userId) {
  db.setState(db.getState());
  db.get("users").remove({ id: userId }).write();
}

function updateUser(user) {
  db.setState(db.getState());
  db.get("users")
    .find({ id: user.id })
    .assign({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
    })
    .write();
}

async function loginUser(user) {
  db.setState(db.getState());
  const isUser = await db
    .get("users")
    .find(user)
    .value();
  return isUser !== undefined
  // if (isUser !== undefined) {
  //   return true;
  // } else {
  //     console.log(false);
  //     return false;
  // }
}

module.exports = { addUser, deleteUser, updateUser, loginUser };
