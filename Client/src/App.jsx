import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'       // old file kept
import BlogTitles from './pages/BlogTitles'           // old file kept
import Generateimages from './pages/Generateimages'   // old file kept
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/ai' element={<Layout/>}>
            <Route index element={<Dashboard/>} />

            {/* Repurpose old components into new tools */}
            <Route path='summarizer' element={<WriteArticle/>} />
            <Route path='meeting-notes' element={<BlogTitles/>} />
            <Route path='research-assistant' element={<Generateimages/>} />
            <Route path='email-composer' element={<RemoveBackground/>} />
            <Route path='slide-deck' element={<RemoveObject/>} />
            <Route path='resume-matcher' element={<ReviewResume/>} />

            <Route path='community' element={<Community/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
