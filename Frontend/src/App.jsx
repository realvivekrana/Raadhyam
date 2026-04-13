import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
//main
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};
import RaadhyamHomepage from './WelcomePages/WelcomePage'
import AboutUs from './WelcomePages/AboutUsPage'
import LoginPage from './Auth/Login'
import RegisterPage from './Auth/Register'
import ContactPage from './WelcomePages/Contect'
import CoursesPage from './WelcomePages/CoursesPage'
import MusicNotesPage from './WelcomePages/NotesPage'
import MainDashboardAdmin from './AdminDashboard/AdminMain'
import UserMain from './UserDashboard/UserMain'

function App() {

  return (
    <>
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RaadhyamHomepage />} />
        <Route path="/About-Us" element={<AboutUs />} />
        <Route path="/Contact-Us" element={<ContactPage />} />


        <Route path="/dashboard/admin" element={<MainDashboardAdmin />} />
        <Route path="/dashboard/home" element={<UserMain />} />
        <Route path="/dashboard/user" element={<UserMain />} />
        <Route path="/user-panel" element={<UserMain />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Courses" element={<CoursesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/Notes" element={<MusicNotesPage />} />
        <Route path="/notes" element={<MusicNotesPage />} />
        <Route path="/music-notes/:noteId" element={<MusicNotesPage />} />

        
      </Routes>
    </Router>
    </>

  )
}

export default App
