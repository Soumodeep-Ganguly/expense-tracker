import Categories from "../pages/categories";
import Dashboard from "../pages/dashboard/dashboard";
import Expenses from "../pages/expenses";
import Settings from "../pages/settings";

const Routes = [
  {
    path: '/',
    view: <Dashboard />,
    layout: 'auth',
    permission: "user",
    title: 'Dashboard | MERN Dev'
  },
  {
    path: '/expenses',
    view: <Expenses />,
    layout: 'auth',
    permission: "user",
    title: 'Expenses | MERN Dev'
  },
  {
    path: '/categories',
    view: <Categories />,
    layout: 'auth',
    permission: "user",
    title: 'Expenses | MERN Dev'
  },
  {
    path: '/settings',
    view: <Settings />,
    layout: 'auth',
    permission: "user",
    title: 'Settings | MERN Dev'
  }
]

export default Routes;