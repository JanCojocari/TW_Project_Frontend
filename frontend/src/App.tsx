import './App.css'
import {Outlet} from "react-router-dom"
import Header from "./layout/Header.tsx";
import Footer from "./layout/Footer.tsx";
import { Box } from "@mui/material";

function App() {
  return (
    <>
        <Header/>
        <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Outlet/>
        </Box>    
        <Footer/>
    </>
  )
}

export default App
