
import {BrowserRouter,Routes,Route} from 'react-router-dom'

import Home from './components/Home'

// import DLModelPage from './components/DLModelPage'
import ModelPage from './components/ModelPage'

function App() {
  return(
    <BrowserRouter>
      <Routes>
        {/* <Route path='/signup' element={<Signup/>}></Route> */}
        {/* <Route path='/' element={<Login/>}></Route> */}
        {/* <Route path='/home' element={<Home/>}></Route> */}
        {/* <Route path='/otp' element={<Otp/>}></Route> */}
        <Route path='/' element={<Home/>}></Route>
        {/* <Route path='/dlmodel' element={<DLModelPage/>}></Route> */}
        <Route path='/model' element={<ModelPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
