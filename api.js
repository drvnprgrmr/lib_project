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
    
    // Check book matches schema
    if (!book.title) throw new Error("Invalid format")

    // Auto-increment book id and book count
    newbook.id = meta.bookCount + 1
    meta.bookCount = newbook.id
    
    // Set newbook's title
    newbook.title = book.title

    // Save new book to db
    const books = await appendDB(bookDB, newbook)

    return books
}

async function deleteBook(id) {
    let books = await readDB(bookDB)
    let foundBook

    await books.forEach((book, i) => {
        if (book.id === id) {
            foundBook = book
            books.splice(i, 1)
            return
        }
    })

    if (!foundBook) throw new Error("Book does not exist")

    await writeDB(bookDB, books)

    return books

}

async function updateBook(id, updates) {
    let books = await readDB(bookDB)
    let updatedBook

    // Only accept updates to these fields
    let acceptedFields = [
        "title",
        "status"
    ]
    Object.keys(updates).forEach(field => {
        if (!(acceptedFields.find(x => x === field))) {
            throw new Error("Field not accepted")
        }
    })

    let notFound = true

    await books.forEach((book, i) => {
        if (book.id === id) {
            // Update the book
            updatedBook = {
                ...book,
                ...updates
            }

            // Remove previous book
            books.splice(i, 1)

            // Add updated book
            books.splice(i, 0, updatedBook)

            notFound = false
            return
        }
    });

    if (notFound) throw new Error("Book not found")

    await writeDB(bookDB, JSON.stringify(books))

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
        await fs.writeFile(loc, JSON.stringify(db), "utf8")
        return db

    } catch (err) {
        throw new Error(err)
    }
}

async function writeDB(loc, data) {
    const err = await fs.writeFile(loc, JSON.stringify(data), "utf8")
    if (err) throw new Error(err.toString())
    return data
}

module.exports = {
    // User
    getAllUsers,
    createUser,
    authenticateUser,
    // Book
    createBook,
    deleteBook,
    updateBook
}