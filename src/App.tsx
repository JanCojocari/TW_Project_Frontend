import './App.css'
import {Outlet} from "react-router-dom"
import Header from "./components/Header.tsx";
function App() {
  return (
    <>
        <Header/>
      <Outlet/>
    </>
  )
}

export default App
