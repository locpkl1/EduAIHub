import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Guides from './pages/Guides';
import AiTools from './pages/AiTools';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import PromptLibrary from './pages/PromptLibrary';
import Textbooks from './pages/Textbooks';
import Profile from './pages/Profile';
import AiGuideChatbot from './pages/chatbots/AiGuideChatbot';
import StudyPromptChatbot from './pages/chatbots/StudyPromptChatbot';
import GeneralPromptChatbot from './pages/chatbots/GeneralPromptChatbot';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/ai-tools" element={<AiTools />} />
            <Route path="/ai-tools/huong-dan-ai" element={<AiGuideChatbot />} />
            <Route path="/ai-tools/prompt-hoc-tap" element={<StudyPromptChatbot />} />
            <Route path="/ai-tools/prompt-da-dung" element={<GeneralPromptChatbot />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/prompt-creator" element={<Navigate to="/ai-tools/prompt-hoc-tap" replace />} />
            <Route path="/prompts" element={<PromptLibrary />} />
            <Route path="/textbooks" element={<Textbooks />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
