import StartLearningAction from '../components/StartLearningAction';

export default function About() {
  return <article className="page-container section-space"><div className="max-w-3xl">
    <h1 className="page-title">Học cùng AI, giữ quyền chủ động</h1>
    <p className="page-intro">EduAI-Hub là không gian giúp học sinh THPT rèn kỹ năng sử dụng AI trong việc tự học: đặt câu hỏi rõ ràng, chọn mức hỗ trợ phù hợp và kiểm chứng câu trả lời.</p>
    <section className="mt-10 border-t border-border pt-6"><h2 className="text-2xl font-bold">Bạn có thể học gì ở đây?</h2><p className="mt-3 leading-8 text-text-muted">Cẩm nang gồm 12 bài trong bốn chặng, đi từ hiểu AI đến thực hành và vận dụng. Ba trợ lý học tập hỗ trợ rèn tư duy viết prompt, gợi ý prompt theo ngữ cảnh và đánh giá prompt. Kho Prompt giúp bạn tham khảo cấu trúc rồi chỉnh cho nhiệm vụ của mình.</p></section>
    <section className="mt-10 border-t border-border pt-6"><h2 className="text-2xl font-bold">Nguyên tắc học cùng AI</h2><ul className="mt-3 list-disc space-y-3 pl-5 leading-7 text-text-muted"><li>Tự làm trước; dùng AI để gợi ý bước đang vướng.</li><li>Đối chiếu thông tin với sách, tài liệu gốc và hướng dẫn của giáo viên.</li><li>Không gửi mật khẩu hoặc dữ liệu cá nhân nhạy cảm vào cuộc trò chuyện.</li><li>Thử giải thích lại bằng lời của mình và tự làm một nhiệm vụ mới.</li></ul></section>
    <section className="mt-10 border-t border-border pt-6"><h2 className="text-2xl font-bold">Bắt đầu từ một câu hỏi thật</h2><p className="mt-3 mb-5 leading-8 text-text-muted">Đăng nhập bằng Google để mở không gian học tập. Bạn có thể bắt đầu với bài 01 của Cẩm nang AI, chọn một hoạt động thử rồi tự kiểm tra điều đã hiểu.</p><StartLearningAction /></section>
  </div></article>;
}
