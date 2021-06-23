import {BrowserRouter, Route } from 'react-router-dom'
import { Home } from '../src/pages/Home'
import { NewRoom } from '../src/pages/NewRoom'
import { AuthContextProvider } from './contexts/AuthContext';


function App() {


  return (

      <BrowserRouter>
      <AuthContextProvider>
      <Route path="/" exact component={Home} />
      <Route path="/rooms/new" component={NewRoom} />
      </AuthContextProvider>
      
      </BrowserRouter>

  );
}

export default App;
