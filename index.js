import express from "express";

const app = express();

app.get('/', (req, res) => {
	res.send("Hello, client.")
})




app.listen(4444, err => {
	return err ? console.log(err) : console.log("Everything is OK")
})