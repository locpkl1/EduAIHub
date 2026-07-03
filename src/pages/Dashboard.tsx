import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SavedPrompt, Task, LearningProgress } from '../types/database';
import { Calendar, Sparkles, Clock, CheckSquare, TrendingUp, UserCircle, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile, loading: authLoading, isGuest, displayName } = useAuth();
  const [recentPrompts, setRecentPrompts] = useState<SavedPrompt[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [progressSubject, setProgressSubject] = useState('');
  const [progressMinutes, setProgressMinutes] = useState('25');
  const [loggingProgress, setLoggingProgress] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (profile && isSupabaseConfigured) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [profile, authLoading]);

  async function fetchDashboardData() {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [promptsRes, tasksRes, progressRes] = await Promise.all([
        supabase
          .from('saved_prompts')
          .select('*')
          .eq('user_id', profile!.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('tasks')
          .select('*')
          .eq('user_id', profile!.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', profile!.id)
          .gte('created_at', weekAgo.toISOString())
          .order('created_at', { ascending: false }),
      ]);

      setRecentPrompts(promptsRes.data || []);
      setRecentTasks(tasksRes.data || []);
      setWeeklyProgress(progressRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();
    if (!profile || !newTaskTitle.trim() || isGuest) return;
    setAddingTask(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        user_id: profile.id,
        title: newTaskTitle.trim(),
        completed: false,
      });
      if (error) throw error;
      setNewTaskTitle('');
      await fetchDashboardData();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setAddingTask(false);
    }
  }

  async function toggleTask(task: Task) {
    if (!profile || isGuest) return;
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id)
        .eq('user_id', profile.id);
      if (error) throw error;
      setRecentTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async function handleLogProgress(e: FormEvent) {
    e.preventDefault();
    if (!profile || !progressSubject.trim() || isGuest) return;
    const minutes = parseInt(progressMinutes, 10);
    if (!minutes || minutes < 1) return;

    setLoggingProgress(true);
    try {
      const { error } = await supabase.from('learning_progress').insert({
        user_id: profile.id,
        subject: progressSubject.trim(),
        duration_minutes: minutes,
        session_type: minutes === 25 ? 'pomodoro' : 'manual',
      });
      if (error) throw error;
      setProgressSubject('');
      await fetchDashboardData();
    } catch (error) {
      console.error('Error logging progress:', error);
    } finally {
      setLoggingProgress(false);
    }
  }

  const totalMinutes = weeklyProgress.reduce((sum, p) => sum + p.duration_minutes, 0);
  const completedTasks = recentTasks.filter((t) => t.completed).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  const welcomeName = isGuest ? 'Bạn (chế độ Khách)' : displayName || profile?.full_name || 'Học sinh';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {isGuest && (
        <div
          className="border rounded-xl p-4 flex items-start gap-3"
          style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
        >
          <UserCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
          <div>
            <p className="font-medium" style={{ color: 'var(--color-text)' }}>Chế độ Khách</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Bạn đang trải nghiệm mà chưa đăng nhập. Dữ liệu prompt và tiến độ sẽ không được lưu.
              Đăng nhập Google từ menu để đồng bộ học tập.
            </p>
          </div>
        </div>
      )}

      <div
        className="rounded-xl border p-6 sm:p-8"
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>{getGreeting()}</p>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{welcomeName}</h1>
            <p className="mt-2" style={{ color: 'var(--color-text-muted)' }}>Chúc bạn một ngày học tập hiệu quả!</p>
          </div>
          {profile?.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2"
              style={{ borderColor: 'var(--color-border)' }}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Clock, value: totalMinutes, label: 'Phút học tuần này' },
          { icon: TrendingUp, value: weeklyProgress.length, label: 'Phiên học tập' },
          { icon: Sparkles, value: recentPrompts.length, label: 'Prompt gần đây' },
          { icon: CheckSquare, value: `${completedTasks}/${recentTasks.length}`, label: 'Công việc' },
        ].map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="rounded-xl border p-4 sm:p-6"
            style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--color-primary-light)' }}>
              <Icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Prompt gần đây</h2>
            <div className="flex items-center gap-3">
              <Link to="/prompts" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>Xem tất cả</Link>
              <Link to="/ai-tools/prompt-hoc-tap" className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>Tạo mới</Link>
            </div>
          </div>

          {recentPrompts.length > 0 ? (
            <div className="space-y-3">
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-4 rounded-lg border"
                  style={{ backgroundColor: 'var(--color-bg-muted)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>{prompt.subject || prompt.purpose}</p>
                      <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>{prompt.purpose}</p>
                    </div>
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-light)' }} />
                  </div>
                  <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>{prompt.prompt_content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{isGuest ? 'Đăng nhập để lưu prompt' : 'Chưa có prompt nào'}</p>
              <Link to="/ai-tools/prompt-hoc-tap" className="inline-block mt-2 text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                Tạo prompt {isGuest ? 'ngay' : 'đầu tiên'}
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Việc cần làm</h2>

          {!isGuest && (
            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Thêm công việc mới..."
                className="input-field flex-1 text-sm"
              />
              <button type="submit" disabled={addingTask || !newTaskTitle.trim()} className="btn-primary px-3">
                {addingTask ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              </button>
            </form>
          )}

          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => toggleTask(task)}
                  disabled={isGuest}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors"
                  style={{ backgroundColor: 'var(--color-bg-muted)' }}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                      task.completed ? '' : ''
                    }`}
                    style={{
                      backgroundColor: task.completed ? 'var(--color-primary)' : 'transparent',
                      borderColor: task.completed ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12">
                        <path
                          fill="currentColor"
                          d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`flex-1 ${task.completed ? 'line-through' : ''}`}
                    style={{ color: task.completed ? 'var(--color-text-light)' : 'var(--color-text)' }}
                  >
                    {task.title}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{isGuest ? 'Đăng nhập để đồng bộ công việc' : 'Chưa có công việc — thêm ở trên'}</p>
            </div>
          )}
        </div>
      </div>

      {!isGuest && (
        <div className="rounded-xl border p-6" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Ghi nhận phiên học</h2>
          <form onSubmit={handleLogProgress} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={progressSubject}
              onChange={(e) => setProgressSubject(e.target.value)}
              placeholder="Môn học (VD: Toán, Lý...)"
              className="input-field flex-1 text-sm"
              required
            />
            <input
              type="number"
              min={1}
              max={480}
              value={progressMinutes}
              onChange={(e) => setProgressMinutes(e.target.value)}
              className="input-field w-full sm:w-28 text-sm"
              aria-label="Số phút học"
            />
            <button type="submit" disabled={loggingProgress} className="btn-primary whitespace-nowrap">
              {loggingProgress ? 'Đang lưu...' : 'Lưu phiên học'}
            </button>
          </form>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-light)' }}>
            Mặc định 25 phút (Pomodoro). Thay đổi số phút nếu cần.
          </p>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          to="/ai-tools/prompt-hoc-tap"
          className="rounded-xl p-6 flex items-center gap-4 transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
        >
          <Sparkles className="w-8 h-8" />
          <div>
            <p className="font-semibold">Tạo Prompt mới</p>
            <p className="text-sm opacity-80">Hỗ trợ AI học tập</p>
          </div>
        </Link>

        <Link
          to="/textbooks"
          className="rounded-xl border p-6 flex items-center gap-4 transition-colors"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <BookOpenIcon className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Bản đồ chương trình</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Xem ngữ cảnh học tập</p>
          </div>
        </Link>

        <Link
          to="/prompts"
          className="rounded-xl border p-6 flex items-center gap-4 transition-colors"
          style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <LibraryIcon className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text)' }}>Kho Prompt</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Prompt cá nhân & tham khảo</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function BookOpenIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function LibraryIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}
