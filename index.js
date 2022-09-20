const http = require("http")
const {
    // User
    getAllUsers,
    createUser,
    authenticateUser,
    // Book
    createBook,
    deleteBook,
    updateBook

} = require("./api")

const port = process.env["PORT"] || 3000

const server = http.createServer(async(req, res) => {
    res.setHeader("Content-Type", "application/json")

    /**
     * User routes
     * - Get all users
     * - Create user
     * - Authenticate user
     */
    if (req.url === "/users" && req.method === "GET") {
        const users = await getAllUsers()
        res.end(users)
    } else if (req.url === "/users" && req.method === "POST") {
        let buffers = []
        req.on("data", chunk => buffers.push(chunk))
        req.on("end", async() => {
            const user = Buffer.concat(buffers).toString("utf8")
            db = await createUser(JSON.parse(user))
            res.end(JSON.stringify(db))
        })
    } else if (req.url === "/user/auth" && req.method === "POST") {
        let buffers = []
        req.on("data", chunk => buffers.push(chunk))
        req.on("end", async() => {
            const userAuth = Buffer.concat(buffers).toString("utf8")
            authenticateUser(JSON.parse(userAuth))
                .then((user) => {
                    res.end(JSON.stringify(user))
                })
                .catch((err) => {
                    res.writeHead(401)
                    res.end(err.toString())
                })
        })
    }

    /**
     * Book routes
     * - Create a new book
     * - Delete book
     * - Update book
     */
    if (req.url === "/books" && req.method === "POST") {
        // Create a new book
        const buffers = []
        req.on("data", chunk => buffers.push(chunk))
        req.on("end", async() => {
            const data = Buffer.concat(buffers).toString("utf8")
            const book = JSON.parse(data)
            createBook(book).then(books => {
                res.end(JSON.stringify(books))
            }).catch(err => {
                res.writeHead(400).end(err.toString())
            })
            
        })

    } else if (req.url === "/books" && req.method === "DELETE") {
        // Delete book
        const buffers = []
        req.on("data", chunk => buffers.push(chunk))
        req.on("end", async() => {
            const data = Buffer.concat(buffers).toString("utf8")
            const { id } = JSON.parse(data)
            await deleteBook(id).then((books) => {
                res.end(JSON.stringify(books))
            }).catch(err => {
                res.writeHead(400).end(err.toString())
            })
            res.end()
        })
    } else if (req.url === "/books" && req.method === "PUT") {
        // Update book
        const buffers = []
        req.on("data", chunk => buffers.push(chunk))
        req.on("end", async() => {
            const data = Buffer.concat(buffers).toString("utf8")
            let id, updates
            try {
                ({id, updates} = JSON.parse(data))
            } catch (err) {
                res.writeHead(400).end(err.toString())
                return
            } 
            updateBook(id, updates).then(updatedBook => {
                res.end(JSON.stringify(updatedBook))
            }).catch(err => {
                res.writeHead(400).end(err.toString())
            })
        })
    }
})

server.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`)
})