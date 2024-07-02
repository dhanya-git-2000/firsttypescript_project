import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import Content from './components/content';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login';
import Mainpage from './components/mainpage';
import Entry from './components/entryPage';

interface LocationState {
  name:string;
  index:number;
  position: string;
  department: string;
  phone: string;
  role: string;
  email_id: string;
  password: string;
}

/*const MainpageWrapper: React.FC = () => {
  const location = useLocation();
  const { state } = location as { state: LocationState };
  return <Mainpage 
  name={state.name}
  role={state.role}
  index={state.index}
  position={state.position}
  department={state.department}
  phone={state.phone}
  email_id={state.email_id}
  password={state.password} />;
};*/
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/"element={<Entry/>} />
      <Route path="/mainpage" element={<Mainpage/>} /> 
      <Route path="/content" element={<Content/>} /> 
    </Routes>
  </Router>
    )};
export default App;



