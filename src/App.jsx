import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './components/commonComponents/navbar';
import HeroSection from './components/commonComponents/herosection';
import Footer from './components/commonComponents/footer';
// import { app } from "./firebase";
// import { getAuth, create } from 'firebase/auth';

// const db = getDatabase(app);
// const auth = getAuth(app);

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <HeroSection />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
