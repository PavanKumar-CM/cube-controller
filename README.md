# 3D Cube Controller

A full stack web application that lets users interact with a 3D cube using sliders and buttons to control rotation and position.

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/PavanKumar-CM/cube-controller.git
cd cube-controller
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Create .env File
Create a `.env` file in the `backend` folder:
```
MONGO_URI=mongodb://127.0.0.1:27017/cubeApp
```

### 4. Start Backend
```bash
node server.js
```

### 5. Run Frontend
Open `frontend/index.html` in your browser or use Live Server.

## API Endpoints

**GET /api/cubes/:id**
- Get saved cube state

**POST /api/cubes/:id/save**
- Save current cube state

**POST /api/cubes/:id/reset**
- Reset cube to default values

## Tech Stack

- Frontend: HTML, CSS, JavaScript, Three.js
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Tools: Git, VS Code

## Limitations

- No user authentication
- Works best in Chrome/Firefox