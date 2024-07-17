import { Route, Routes } from "react-router-dom"
import FormSeguimiento from "./components/FormSeguimiento.jsx"
import SeguimientoContextProvider from "./context/SeguimientoContextProvider.jsx"
import IndividualSeguimiento from "./pages/IndividualSeguimiento.jsx"
import Status from "./pages/Status.jsx"
import StatusContextProvider from "./context/StatusContextProvider.jsx"
import EditStatusPage from "./pages/EditStatusPage.jsx"
import Seguimientos from "./pages/Seguimientos.jsx"
import EditDeadlinePage from "./pages/EditDeadlinePage.jsx"

function App() {

  return (
    <>
      <SeguimientoContextProvider>
        <StatusContextProvider>
        
          <Routes>
            <Route path="/seguimientos" element={<Seguimientos />} />
            <Route path="/status/:statusid" element={<Status />} />
            <Route path="/search-seguimiento" element={<IndividualSeguimiento />} />
            <Route path="/create-seguimiento" element={<FormSeguimiento />} />
            <Route path="/edit-status" element={<EditStatusPage />} />
            <Route path="/edit-deadline" element={<EditDeadlinePage />} />
            <Route path="/delete-seguimiento" element={<IndividualSeguimiento />} />
          </Routes>
          
        </StatusContextProvider>
      </SeguimientoContextProvider>
    </>
  )
}

export default App
