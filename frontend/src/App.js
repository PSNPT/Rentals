import Layout from './pages/Layout';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Signout from './pages/Signout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { APIContext } from './APIContext';
import { useAPIContext } from './APIContext';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Property from './pages/Property';
import PropertyEdit from './pages/PropertyEdit';
import Error404 from './pages/Error404';
import PropertyCreate
 from './pages/PropertyCreate';
import PropertyManage
 from './pages/PropertyManage';
import ListingManage from './pages/ListingManage';
import Listing from './pages/Listing';
import ListingEdit from './pages/ListingEdit';
import ListingCreateIntermediate from './pages/ListingCreateIntermediate';
import ListingCreate from './pages/ListingCreate';
import Home from './pages/Home';
import ReservationCreate from './pages/ReservationCreate';
import Reservation from './pages/Reservation';
import ReservationManage from './pages/ReservationManage';
import NotificationManage from './pages/NotificationManage';
import Error401 from './pages/Error401';
import ReservationComment from './pages/ReservationComment';

function App() {

  return (
  <APIContext.Provider value={useAPIContext()}>
  <BrowserRouter> 
  <Routes>
  <Route path='/' element={<Layout />}>
    <Route path='signup' element={<Signup />}></Route>
    <Route path='signin' element={<Signin />}></Route>
    <Route path='home' element={<Home />}></Route>
    <Route path='signout' element={<Signout />}></Route>
    <Route path='profile/:id' element={<Profile />}></Route>
    <Route path='profile/edit' element={<ProfileEdit />}></Route>
    <Route path='property/:id' element={<Property />}></Route>
    <Route path='property/:id/edit' element={<PropertyEdit />}></Route>
    <Route path='property/create' element={<PropertyCreate />}></Route>
    <Route path='property/manage' element={<PropertyManage />}></Route> 
    <Route path='listing/manage' element={<ListingManage />}></Route> 
    <Route path='listing/:id' element={<Listing/>}></Route> 
    <Route path='listing/:id/edit' element={<ListingEdit />}></Route> 
    <Route path='listing/create' element={<ListingCreateIntermediate />}></Route> 
    <Route path='listing/:id/create' element={<ListingCreate />}></Route>
    <Route path='reservation/:id/create' element={<ReservationCreate />}></Route> 
    <Route path='reservation/:id/comment' element={<ReservationComment />}></Route> 
    <Route path='reservation/:id' element={<Reservation />}></Route> 
    <Route path='reservation/manage' element={<ReservationManage />}></Route> 
    <Route path='notification/manage' element={<NotificationManage />}></Route> 
    <Route path='404' element={<Error404 />}></Route>
    <Route path='401' element={<Error401 />}></Route>
  </Route>
  </Routes>
  </BrowserRouter>
  </APIContext.Provider>);

}

export default App;