import { Route, Routes } from "react-router-dom"
import FormSeguimiento from "./components/FormSeguimiento.jsx"
import SeguimientoContextProvider from "./context/SeguimientoContextProvider.jsx"
import IndividualSeguimiento from "./pages/IndividualSeguimiento.jsx"
import Status from "./pages/Status.jsx"
import StatusContextProvider from "./context/StatusContextProvider.jsx"
import EditStatusPage from "./pages/EditStatusPage.jsx"

function App() {

  return (
    <>
      <SeguimientoContextProvider>
        <StatusContextProvider>
        
          <Routes>
            <Route path="/status/:statusid" element={<Status />} />
            <Route path="/search-seguimiento" element={<IndividualSeguimiento />} />
            <Route path="/create-seguimiento" element={<FormSeguimiento />} />
            <Route path="/edit-status" element={<EditStatusPage />} />
          </Routes>
          
        </StatusContextProvider>
      </SeguimientoContextProvider>
    </>
  )
}

export default App
