const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.use(express.static("public"))

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get("/", (req, res) =>{
    res.render("index")
})

app.post("/convert-mp3", async (req, res) =>{
    const videoID = req.body.videoID
    if (videoID === undefined || videoID === "" || videoID === null) {
        return res.render("index", {success: false, message: "Please enter a video ID"})
    }else{
        
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,{
            "method": "GET",
            "headers": {
                "x-rapidapi-key" : process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });
        const response = await fetchAPI.json()
        if (response.status === "ok") {
            return res.render("index", {success: true, song_title: response.title, song_link: response.link})
        }else{
            return res.render("index", {success: false, message: response.msg})
        }
    }
})

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})

