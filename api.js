const fs = require("fs/promises")
const {readFileSync, writeFileSync} = require("fs")

const userDB = "./db/users.json"
const bookDB = "./db/books.json"
const metaDB = "./db/meta.json"

let metaData

const meta = {
    get bookCount() {
        metaData = JSON.parse(readFileSync(metaDB, "utf8")) 
        let count = metaData.bookcount
        return count
    },
    set bookCount(count) {
        metaData.bookcount = count
        writeFileSync(metaDB, JSON.stringify(metaData))
    }
}

// Users

async function getAllUsers() {
    const users = await readDB(userDB)
    return users
}

async function createUser(user) {
    db = await appendDB(userDB, user)
    return db
}

async function authenticateUser(auth) {
    const db = await readDB(userDB)
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


// Books
async function createBook(book) {
    let newbook = {}
    
    // Auto-increment book id and book count
    newbook.id = meta.bookCount + 1
    meta.bookCount = book.id
    
    // Set newbook's title
    newbook.title = book.title

    // Save new book to db
    const books = await appendDB(bookDB, newbook)

    return books
}



// Utils

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

// async function updateDB(loc, key, value) {
//     const db = await readDB(loc)
//     console.log(db[key])
//     eval(`db.${key} = value`)
//     console.log(db[key])
//     await fs.writeFile(loc, JSON.stringify(db))
// }

module.exports = {
    // User
    getAllUsers,
    createUser,
    authenticateUser,
    // Book
    createBook
}