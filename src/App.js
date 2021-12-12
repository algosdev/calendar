import './App.css'
import Calendar from './components/Calendar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className='App'>
      <Calendar />
      <ToastContainer autoClose={3000} hideProgressBar />
    </div>
  )
}

export default App
