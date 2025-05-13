const http = require("http");
const app = require("./app.js");
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, (req,res)=>{
	console.log('info',`server listening on http://localhost:${PORT}`);
});