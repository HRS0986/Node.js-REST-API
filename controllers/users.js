const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/users.json");
const db = low(adapter);

async function addUser(user) {
  db.setState(db.getState());
  const isUser = await db.get("users").find(data => data.email == user.email).value();   
  if (!isUser) {
    const ID = db.get("users").size().value() + 1; 
    user["id"] = ID;
    db.get("users")
      .push(user)
      .write()
    return { status:true, message:"User Added" };
  }
  return { status:false, message:"This email already registered" };
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
}

module.exports = { addUser, deleteUser, updateUser, loginUser };
