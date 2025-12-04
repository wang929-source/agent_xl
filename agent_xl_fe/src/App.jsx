import { Outlet } from 'react-router-dom';
import AppRouter from './router';
import './App.css'
import { GlobalContext } from './context';

function App() {

  return (
    <>
      <GlobalContext.Provider
        value={{ lang: 'zh-CN'}}
      >
        <AppRouter />
        <Outlet />
      </GlobalContext.Provider>
    </>
  )
}

export default App
