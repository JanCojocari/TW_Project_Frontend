import './App.css'
import {Outlet} from "react-router-dom"
import Header from "./layout/Header.tsx";
import Footer from "./layout/Footer.tsx";
function App() {
  return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
    </>
  )
}

export default App
