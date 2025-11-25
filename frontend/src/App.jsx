import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>🎭 NAHB - Not Another Hero's Book</h1>
          <p>Application de livres interactifs</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Bienvenue sur NAHB</h2>
      <p>Le frontend est correctement configuré ! 🚀</p>
      <p>Backend API: http://localhost:5000</p>
      <p>Frontend: http://localhost:3000</p>
    </div>
  )
}

export default App
