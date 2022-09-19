const http = require("http")
const {
    // User
    getAllUsers,
    createUser,
    authenticateUser,
    // Book
    createBook

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
     */
    if (req.url === "/books" && req.method === "POST") {
        // Create a new book
        const buffers = []
        req.on("data", chunk => buffers.push(chunk))
        req.on("end", async() => {
            const data = Buffer.concat(buffers).toString("utf8")
            const book = JSON.parse(data)
            const books = await createBook(book)
            res.end(JSON.stringify(books))
        })

    }
})

server.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`)
})