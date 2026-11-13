import { guideLessons } from '../../data/guideLessons';
import { learningTools } from '../../data/learningTools';

export type GuidanceActionId = 'start' | 'tools' | 'resources';
export interface GuidanceReply {
  title: string;
  paragraphs: readonly string[];
  links: readonly { label: string; to: string }[];
}

/** Future service boundary; no network adapter is implemented in this release. */
export interface LearningAssistantAdapter {
  getGuidance(action: GuidanceActionId): Promise<GuidanceReply>;
}

export const greetingMessages = {
  guest: ['Chào mừng bạn đến với EduAI-Hub!', 'Chưa biết bắt đầu từ đâu? Mình sẽ hướng dẫn bạn nhé!'],
  member: ['Chào mừng bạn trở lại EduAI-Hub!', 'Bạn muốn bắt đầu với Cẩm nang AI, khám phá trợ lý học tập hay xem lại prompt đã lưu?'],
} as const;

export const guestWelcome: GuidanceReply = {
  title: 'Chào mừng bạn đến với EduAI-Hub!',
  paragraphs: ['EduAI-Hub giúp học sinh học cách sử dụng AI chủ động và hiệu quả.', 'Để bắt đầu học cùng ba trợ lý AI, sử dụng cẩm nang và lưu prompt cá nhân, bạn hãy đăng nhập trước nhé!'],
  links: [{ label: 'Tìm hiểu EduAI-Hub', to: '/about' }, { label: 'Xem tài nguyên', to: '/textbooks' }],
};

export const memberWelcome: GuidanceReply = {
  title: 'Chào mừng bạn đến với không gian học tập!',
  paragraphs: ['Bạn có thể bắt đầu với Cẩm nang AI, chọn một trợ lý phù hợp hoặc xem lại những prompt đã lưu.'],
  links: [{ label: 'Bắt đầu Cẩm nang AI', to: '/guides' }, { label: 'Chọn công cụ AI', to: '/ai-tools' }, { label: 'Xem Kho Prompt', to: '/prompts' }],
};

export const guidanceActions: readonly { id: GuidanceActionId; label: string }[] = [
  { id: 'start', label: 'Tôi nên bắt đầu từ đâu?' },
  { id: 'tools', label: 'Chọn trợ lý AI phù hợp.' },
  { id: 'resources', label: 'Tìm tài nguyên học tập.' },
];

export const staticGuidance: Record<GuidanceActionId, GuidanceReply> = {
  start: {
    title: 'Bắt đầu từ bài 01',
    paragraphs: ['Đọc cách dùng EduAI-Hub và ba trợ lý AI. Sau đó chọn một hoạt động thử, tự làm trước rồi kiểm tra điều mình hiểu.', 'Bạn cũng có thể chọn một trong bốn chặng ở Cẩm nang AI.'],
    links: [{ label: 'Mở bài 01', to: `/guides/${guideLessons[0].slug}` }, { label: 'Khám phá bốn chặng', to: '/guides' }],
  },
  tools: {
    title: 'Chọn theo việc bạn đang cần',
    paragraphs: learningTools.map(tool => `${tool.title}: ${tool.situation}`),
    links: learningTools.map(tool => ({ label: tool.title, to: tool.href })),
  },
  resources: {
    title: 'Tìm học liệu theo lớp và môn',
    paragraphs: ['Mở trang Tài nguyên học tập, chọn lớp và môn để xem danh mục sách và nguồn tham khảo đang có.', 'Chỉ dùng liên kết tài liệu thật; đối chiếu thông tin quan trọng với tài liệu gốc.'],
    links: [{ label: 'Mở danh mục học tập', to: '/textbooks#danh-muc-hoc-tap' }, { label: 'Xem tài nguyên học tập', to: '/textbooks#tai-nguyen-hoc-tap' }],
  },
};
