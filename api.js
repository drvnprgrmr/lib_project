const fs = require("fs/promises")

const usersDB = "./db/users.json"

async function getAllUsers() {
    const users = await readDB(usersDB)
    return users
}

async function createUser(user) {
    db = await appendDB(usersDB, user)
    return db
}

async function authenticateUser(auth) {
    const db = await readDB(usersDB)
    let foundUser
    await db.forEach((user) => {
        if (user.username === auth.username) {
            foundUser = user
            return
        }
    });
    if (!foundUser) throw new Error("User doesn't exist")
    else if (foundUser.password !== auth.password) {
        throw new Error("Incorrect password")
    } else return foundUser

}

async function readDB(loc) {
    const content = await fs.readFile(loc, "utf8")
    return JSON.parse(content)
}

async function appendDB(loc, data) {
    try {
        const db = await readDB(loc)
        db.push(data)
        console.log(db)
        await fs.writeFile(loc, JSON.stringify(db), "utf8")
        return db

    } catch (err) {
        throw new Error(err)
    }
}


module.exports = {
    getAllUsers,
    createUser,
    authenticateUser
}