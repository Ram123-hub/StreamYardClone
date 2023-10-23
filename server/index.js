const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});




const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/signup_demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SECRET = "SEcR4t";

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post("/users/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(403).json({ message: "User already exists" });
    } else {
      const newUser = new User({ username, email, password });
      await newUser.save();
      const token = jwt.sign({ email, role: "user" }, SECRET, {
        expiresIn: "1h",
      });
      res.json({ message: "User created successfully", token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ email, role: "user" }, SECRET, {
        expiresIn: "1h",
      });
      res.json({ message: "Logged in successfully", token });
    } else {
      res.status(403).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const rooms = {};
const users = {};

io.on("connection", (socket) => {
  console.log("a user conncected" + socket.id);

  socket.on("disconnect", (params) => {
    Object.keys(rooms).map((roomId) => {
      rooms[roomId].users = rooms[roomId].users.filter((x) => x !== socket.id);
    });
    delete users[socket.id];
  });

  socket.on("join", (params) => {
    const roomId = params.roomId;
    users[socket.id] = {
      roomId: roomId,
    };
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
      };
    }
    rooms[roomId].users.push(socket.id);
    console.log("user added to room" + roomId);
  });

  socket.on("localDescription", (params) => {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;
    otherUsers.forEach((otherUsers) => {
      if (otherUsers !== socket.id) {
        io.to(otherUsers).emit("localDescription", {
          description: params.description,
        });
      }
    });
  });

  socket.on("remoteDescription",(params)=>{
    let roomId = users[socket.id].roomId;    
    let otherUsers = rooms[roomId].users;

    otherUsers.forEach(otherUser => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("remoteDescription", {
            description: params.description
        })
      }
    })
  })


  socket.on("iceCandidate",(params)=>{
    let roomId = users[socket.id].roomId;    
    let otherUsers = rooms[roomId].users;

    otherUsers.forEach(otherUser => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("iceCandidate", {
          candidate: params.candidate
        })
      }
    })
  })

  socket.on("iceCandidateReply", (params) => {
    let roomId = users[socket.id].roomId;    
    let otherUsers = rooms[roomId].users;

    otherUsers.forEach(otherUser => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("iceCandidateReply", {
          candidate: params.candidate
        })
      }
    })
  });


});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
