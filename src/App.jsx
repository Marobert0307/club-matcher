import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Layout from './components/Layout.jsx';

import Home from './pages/Home.jsx';
import ProfileSetup from './pages/ProfileSetup.jsx';
import Explore from './pages/Explore.jsx';
import ClubDetail from './pages/ClubDetail.jsx';
import AIAdvisor from './pages/AIAdvisor.jsx';
import Matches from './pages/Matches.jsx';
import Apply from './pages/Apply.jsx';
import MyApplications from './pages/MyApplications.jsx';
import Admin from './pages/Admin.jsx';
import AdminClub from './pages/AdminClub.jsx';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* 独立页面（无底部 Tab 栏） */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/club/:id" element={<ClubDetail />} />
          <Route path="/apply/:id" element={<Apply />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/club/:id" element={<AdminClub />} />

          {/* 带底部导航栏的页面 */}
          <Route path="/explore" element={<Layout><Explore /></Layout>} />
          <Route path="/ai-advisor" element={<Layout><AIAdvisor /></Layout>} />
          <Route path="/matches" element={<Layout><Matches /></Layout>} />
          <Route path="/my-applications" element={<Layout><MyApplications /></Layout>} />

          {/* 兜底 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
