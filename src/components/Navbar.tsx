import {NavLink} from 'react-router-dom';

import {useState} from 'react';
import store from '../stores/store';

const Burger = (props: any) => {
  const {isActive, setIsActive} = props;

  return (
    <div
      className={`z-20 flex flex-col w-16 gap-2 mt-6 ml-6 p-4 duration-300 ${
        isActive ? 'bg-amber-100' : 'bg-white'
      } shadow-xl`}
      onClick={() => setIsActive(!isActive)}
    >
      <div
        className={`w-8 h-0.5 bg-black duration-300 ${
          isActive ? 'rotate-45 translate-y-2.5' : ''
        }`}
      ></div>
      <div
        className={`w-8 h-0.5 bg-black duration-300 ${
          isActive ? '-translate-x-20 opacity-0' : ''
        }`}
      ></div>
      <div
        className={`w-8 h-0.5 bg-black duration-300 ${
          isActive ? '-rotate-45 -translate-y-2.5' : ''
        }`}
      ></div>
    </div>
  );
};

interface NavBarProp {
  setLogOut: () => void;
}

const NavBar = ({setLogOut}: NavBarProp) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const userRole: string = store.user.role;

  return (
    <>
      <div
        className={`fixed z-30 h-screen bg-amber-100 w-[83vw] duration-300 ${
          isActive ? 'md:w-[50vw] lg:w-[17vw]' : 'w-[0vw]'
        } select-none`}
      >
        <Burger isActive={isActive} setIsActive={setIsActive}>
          {' '}
        </Burger>
        <ol
          className={`z-20 h-full w-full flex flex-col text-2xl justify-start items-center gap-10 pt-24 ${
            isActive ? '' : '-translate-x-20 opacity-0'
          }`}
        >
          <li onClick={() => setIsActive(false)}>
            <NavLink
              className={({isActive}) => (isActive ? 'underline' : '')}
              to="/"
            >
              Historique
            </NavLink>
          </li>
          <li onClick={() => setIsActive(false)}>
            <NavLink
              className={({isActive}) =>
                isActive
                  ? `underline ${userRole === 'Admin' ? '' : 'hidden'}`
                  : `${userRole === 'Admin' ? '' : 'hidden'}`
              }
              to="/admin"
            >
              Admin
            </NavLink>
          </li>
          <li onClick={() => setIsActive(false)}>
            <NavLink
              className={({isActive}) =>
                isActive
                  ? `underline ${userRole === 'Admin' ? '' : 'hidden'}`
                  : `${userRole === 'Admin' ? '' : 'hidden'}`
              }
              to="/statistics"
            >
              Statistiques
            </NavLink>
          </li>
          <li>
            <a
              className="cursor-pointer"
              onClick={() => {
                setLogOut();
                setIsActive(false);
              }}
            >
              Déconnexion
            </a>
          </li>
        </ol>
      </div>
      <div
        className={`z-20 fixed overlay w-screen h-screen bg-black opacity-50 ${
          isActive ? '' : 'hidden'
        }`}
        onClick={() => setIsActive(!isActive)}
      ></div>
    </>
  );
};

export default NavBar;
