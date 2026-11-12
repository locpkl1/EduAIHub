import type { Profile } from '../types/database';

export function recommendLearning(profile: Profile | null) {
  const suggestions: { title: string; to: string; reason: string }[] = [];
  const add = (title: string, to: string, reason: string) => { if (!suggestions.some(item => item.to === to)) suggestions.push({ title, to, reason }); };
  if (profile?.common_problems.includes('Không biết viết prompt')) add('Học tư duy prompt', '/ai-tools/hoc-tu-duy-prompt', 'Bạn đã chọn “Không biết viết prompt” trong hồ sơ.');
  if (profile?.common_problems.includes('Không biết đánh giá prompt của mình')) add('Đánh giá prompt', '/ai-tools/danh-gia-prompt', 'Bạn muốn biết cách đánh giá prompt mình viết.');
  if (profile?.common_problems.includes('Không biết kiểm chứng thông tin')) add('Kiểm chứng phản hồi AI', '/guides/dung-tin-ai-chi-vi-thuyet-phuc', 'Bạn đã chọn khó khăn khi kiểm chứng thông tin.');
  if (profile?.learning_goals.includes('Tạo prompt tốt hơn')) add('Gợi ý prompt học tập', '/ai-tools/goi-y-prompt-hoc-tap', 'Dựa trên mục tiêu “Tạo prompt tốt hơn” bạn đã chọn.');
  if (profile?.learning_goals.includes('Ôn kiểm tra')) add('Luyện tập và ôn thi cùng AI', '/guides/dung-ai-luyen-tap-ghi-nho-on-thi', 'Dựa trên mục tiêu “Ôn kiểm tra” bạn đã chọn.');
  if (['Từng bước', 'Hỏi đáp Socratic'].includes(profile?.preferred_learning_style || '')) add('Biến AI thành người hướng dẫn', '/guides/tu-duy-hoc-tap-cung-ai', `Bạn đã chọn cách học “${profile?.preferred_learning_style}”.`);
  if (!suggestions.length) add('Làm quen với EduAI-Hub', '/guides/huong-dan-su-dung-eduai-hub-va-ba-tro-ly-ai', 'Một điểm khởi đầu nếu bạn chưa chọn mục tiêu trong hồ sơ.');
  return suggestions.slice(0, 2);
}
