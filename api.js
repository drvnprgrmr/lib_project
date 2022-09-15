const { rejects } = require("assert")
const { error } = require("console")
const fs = require("fs/promises")
const { json } = require("stream/consumers")

const usersDB = "./db/users.json"

async function getAllUsers() {
    const users = await readDB(usersDB)
    return users
}

async function createUser(user) {
    db = await appendDB(usersDB, user)
    return db
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
    createUser
}