import { motion } from 'framer-motion'
import './App.css'

function App() {
  return (
    <motion.main
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1>Welcome</h1>
      <p>This homepage fades in with Framer Motion.</p>
    </motion.main>
  )
}

export default App
