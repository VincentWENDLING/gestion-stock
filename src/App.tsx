import {Routes, Route, useNavigate} from 'react-router-dom';

import NavBar from './components/Navbar';

import Admin from './pages/Admin';

import OrderPage from './pages/Order';
import Lab from './pages/Lab';
import Delivery from './pages/Delivery';

import History from './pages/History';
import Statistiques from './pages/Statistics';
import Unauthorized from './pages/Unauthorized';
import LogIn from './pages/LogIn';

import store from './stores/store';
import {useEffect, useState} from 'react';
import {User} from './types';

const App = () => {
  const navigate = useNavigate();

  const user = sessionStorage.getItem('user');

  if (user !== '' && user !== null) {
    store.logIn(JSON.parse(user));
  }

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(store.isLoggedIn);

  const setLogIn = (user: User) => {
    setIsLoggedIn(true);
    store.logIn(user);
  };

  const setLogOut = () => {
    setIsLoggedIn(false);
    store.logOut();
    navigate('login');
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('login');
    }
  }, []);

  return (
    <div>
      <NavBar setLogOut={setLogOut} />
      <main className="h-screen w-screen overflow-scroll">
        <Routes>
          <Route path="login" element={<LogIn setLogIn={setLogIn} />}></Route>
          <Route path="order" element={<OrderPage />}></Route>
          <Route path="lab" element={<Lab />}></Route>
          <Route path="delivery" element={<Delivery />}></Route>
          <Route path="admin" element={<Admin />}></Route>
          <Route path="/" element={<History />}></Route>
          <Route path="statistics" element={<Statistiques />}></Route>
          <Route path="unauthorized" element={<Unauthorized />}></Route>
        </Routes>
      </main>
    </div>
  );
};

export default App;
