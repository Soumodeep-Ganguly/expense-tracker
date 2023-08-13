import SignIn from "../pages/auth/signin";
import SignUp from "../pages/auth/signup";

const Routes = [
  {
    path: '/signup',
    view: <SignUp />,
    layout: 'auth',
    title: 'SignUp | MERN Dev'
  },
  {
    path: '/signin',
    view: <SignIn />,
    layout: 'auth',
    title: 'SignIn | MERN Dev'
  }
]

export default Routes;