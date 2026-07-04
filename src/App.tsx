import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Guides from './pages/Guides';
import GuideLessonDetail from './pages/GuideLessonDetail';
import AiTools from './pages/AiTools';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import PromptLibrary from './pages/PromptLibrary';
import Textbooks from './pages/Textbooks';
import Profile from './pages/Profile';
import PromptThinkingChatbot from './pages/chatbots/AiGuideChatbot';
import StudyPromptMentorChatbot from './pages/chatbots/StudyPromptChatbot';
import PromptEvaluatorChatbot from './pages/chatbots/GeneralPromptChatbot';
import AdminRouteGuard from './components/admin/AdminRouteGuard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPosts from './pages/admin/AdminPosts';
import AdminPrompts from './pages/admin/AdminPrompts';
import AdminCurriculum from './pages/admin/AdminCurriculum';
import AdminResources from './pages/admin/AdminResources';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/guides/:slug" element={<GuideLessonDetail />} />
            <Route path="/ai-tools" element={<AiTools />} />
            <Route path="/ai-tools/hoc-tu-duy-prompt" element={<PromptThinkingChatbot />} />
            <Route path="/ai-tools/goi-y-prompt-hoc-tap" element={<StudyPromptMentorChatbot />} />
            <Route path="/ai-tools/danh-gia-prompt" element={<PromptEvaluatorChatbot />} />
            <Route path="/ai-tools/huong-dan-ai" element={<PromptThinkingChatbot />} />
            <Route path="/ai-tools/prompt-hoc-tap" element={<StudyPromptMentorChatbot />} />
            <Route path="/ai-tools/prompt-da-dung" element={<PromptEvaluatorChatbot />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/prompt-creator" element={<Navigate to="/ai-tools/prompt-hoc-tap" replace />} />
            <Route path="/prompts" element={<PromptLibrary />} />
            <Route path="/textbooks" element={<Textbooks />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route
            path="/admin"
            element={
              <AdminRouteGuard>
                <AdminLayout />
              </AdminRouteGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="prompts" element={<AdminPrompts />} />
            <Route path="curriculum" element={<AdminCurriculum />} />
            <Route path="resources" element={<AdminResources />} />
            <Route path="users" element={<Navigate to="/admin" replace />} />
            <Route path="settings" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
