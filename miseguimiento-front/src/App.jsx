import { Route, Routes } from "react-router-dom"
import SeguimientoContextProvider from "./context/SeguimientoContextProvider.jsx"
import IndividualSeguimiento from "./pages/IndividualSeguimiento.jsx"
import Status from "./pages/Status.jsx"
import StatusContextProvider from "./context/StatusContextProvider.jsx"
import EditStatusPage from "./pages/EditStatusPage.jsx"
import Seguimientos from "./pages/Seguimientos.jsx"
import EditDeadlinePage from "./pages/EditDeadlinePage.jsx"
import PostSeguimientoPage from "./pages/PostSeguimientoPage.jsx"
import GetStarted from "./pages/GetStarted.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import AuthContextProvider from "./context/AuthContextProvider.jsx"
import Notifications from "./components/Notifications.jsx"
import ProtectedRoutes from "./ProtectedRoutes.jsx"

function App() {

  return (
    <>
      <AuthContextProvider>
        <SeguimientoContextProvider>
          <StatusContextProvider>

            <Notifications />

            <Routes>
              <Route path="/" element={<GetStarted />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoutes />}>
                <Route path="/seguimientos" element={<Seguimientos />} />
                <Route path="/search-status" element={<Status />} />
                <Route path="/search-seguimiento" element={<IndividualSeguimiento />} />
                <Route path="/create-seguimiento" element={<PostSeguimientoPage />} />
                <Route path="/edit-status" element={<EditStatusPage />} />
                <Route path="/edit-deadline" element={<EditDeadlinePage />} />
                <Route path="/delete-seguimiento" element={<IndividualSeguimiento />} />
              </Route>
              
            </Routes>
            
          </StatusContextProvider>
        </SeguimientoContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
