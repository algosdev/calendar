import WrapperLayout from '../layouts/WrapperLayout'
import ContainerPage from '../pages/container'
import LoginPage from '../pages/login'
import Calendar from '../components/Calendar'
const routes = [
  {
    path: '',
    element: <WrapperLayout />,
    children: [
      { path: '', element: <Calendar /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'container/:id', element: <ContainerPage /> },
    ],
  },
]
export default routes
