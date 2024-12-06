const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "likeme",
  password: "**********",
  port: 5432,
})


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ mensaje: "Error en el servidor" })
})

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id ASC")
    res.json(result.rows)
  } catch (error) {
    console.error("Error al obtener posts", error)
    res.status(500).json({ mensaje: "Error al obtener posts" })
  }
})

app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body
    await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0)",
      [titulo, img, descripcion]
    )
    res.status(201).send("Post agregado exitosamente")
  } catch (error) {
    console.error("Error al agregar post", error)
    res.status(500).json({ mensaje: "Error al agregar post" })
  }
})

app.put("/posts/like/:id", async (req, res) => {
  try {
    const { id } = req.params
    await pool.query("UPDATE posts SET likes = likes + 1 WHERE id = $1", [id])
    res.status(200).send("Like agregado exitosamente")
  } catch (error) {
    console.error("Error al dar like", error)
    res.status(500).json({ mensaje: "Error al dar like" })
  }
})

app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params
    await pool.query("DELETE FROM posts WHERE id = $1", [id])
    res.status(200).send("Post eliminado exitosamente")
  } catch (error) {
    console.error("Error al eliminar post", error)
    res.status(500).json({ mensaje: "Error al eliminar post" })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})