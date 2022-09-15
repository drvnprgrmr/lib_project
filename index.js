const http = require("http")
const { getAllUsers, createUser } = require("./api")

const port = process.env["PORT"] || 3000

const server = http.createServer(async(req, res) => {
    res.setHeader("Content-Type", "application/json")

    // User routes
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
    }
})

server.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`)
})