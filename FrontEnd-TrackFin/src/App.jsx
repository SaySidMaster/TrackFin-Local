import { useState } from 'react'
import SideNavBar from './components/SideNavBar.jsx'
import './styles/global.css'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SideNavBar />
      <div style={{ marginLeft: '250px', padding: '40px' }}>
      </div>
    </>
  )
}

export default App
