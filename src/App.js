import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRoutes } from 'react-router'
import routes from './routes'
function App() {
  const routing = useRoutes(routes)
  return (
    <>
      {routing}
      <ToastContainer autoClose={3000} hideProgressBar />
    </>
  )
}

export default App
