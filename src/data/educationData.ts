export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const grades = [
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
];

export const bookSeries = [
  { value: 'chan_troi', label: 'Chân Trời Sáng Tạo' },
  { value: 'canh_dieu', label: 'Cánh Diều' },
  { value: 'ket_noi', label: 'Kết Nối Tri Thức' },
];

export const subjectNameToKey: Record<string, string> = {
  'Toán học': 'toan',
  'Vật lý': 'vat_li',
  'Hóa học': 'hoa_hoc',
  'Sinh học': 'sinh_hoc',
  'Ngữ văn': 'ngu_van',
  'Tiếng Anh': 'tieng_anh',
  'Lịch sử': 'lich_su',
  'Địa lý': 'dia_li',
  'Giáo dục công dân': 'gdcd',
  'Tin học': 'tin_hoc',
  'Công nghệ': 'cong_nghe',
  'Thể chất': 'the_chat',
};

export function getTextbookTableOfContents(grade: number, subject: string): string[] {
  const gradeKey = grade.toString();
  const subjectKey = subjectNameToKey[subject];
  if (!subjectKey || !lessons[gradeKey]?.[subjectKey]) {
    return ['Chương 1: Giới thiệu môn học', 'Chương 2: Kiến thức cơ bản', 'Chương 3: Ứng dụng thực tiễn'];
  }
  return lessons[gradeKey][subjectKey].map((lesson, index) => `Chương ${index + 1}: ${lesson}`);
}

export const subjects = [
  { value: 'toan', label: 'Toán học' },
  { value: 'vat_li', label: 'Vật lý' },
  { value: 'hoa_hoc', label: 'Hóa học' },
  { value: 'sinh_hoc', label: 'Sinh học' },
  { value: 'ngu_van', label: 'Ngữ văn' },
  { value: 'tieng_anh', label: 'Tiếng Anh' },
  { value: 'lich_su', label: 'Lịch sử' },
  { value: 'dia_li', label: 'Địa lý' },
  { value: 'gdcd', label: 'Giáo dục công dân' },
  { value: 'tin_hoc', label: 'Tin học' },
  { value: 'cong_nghe', label: 'Công nghệ' },
  { value: 'the_chat', label: 'Thể chất' },
];

export const lessons: Record<string, Record<string, string[]>> = {
  '10': {
    toan: ['Đại số: Số thực', 'Đại số: Lượng giác', 'Hình học: Vecto', 'Hình học: Tứ giác', 'Giải tích: Giới hạn'],
    vat_li: ['Động học', 'Tĩnh học', 'Động lực học', 'Điện học'],
    hoa_hoc: ['Nguyên tử', 'Bảng tuần hoàn', 'Liên kết hóa học', 'Phản ứng hóa học'],
    sinh_hoc: ['Thành phần hóa học tế bào', 'Cấu trúc tế bào', 'Sự phân bào', 'Sức khỏe'],
    ngu_van: ['Tây Tiến', 'Việt Bắc', 'Đồng chí', 'Bếp lửa', 'Làng'],
    tieng_anh: ['Family Life', 'Humans and the Environment', 'Music and Arts', 'Education'],
    lich_su: ['Nước Văn Lang - Âu Lạc', 'Nhà nước phong kiến Việt Nam', 'Thời kỳ Pháp thuộc'],
    dia_li: ['Vị trí địa lý', 'Lịch sử khai thác lãnh thổ', 'Tự nhiên Việt Nam'],
    gdcd: ['Con người và thế giới', 'Thế giới quan', 'Tự do'],
    tin_hoc: ['Giới thiệu tin học', 'Hệ điều hành', 'Soạn thảo văn bản'],
    cong_nghe: ['Công nghệ thông tin', 'Công nghệ điện'],
    the_chat: ['Bóng đá', 'Cầu lông', 'Điền kinh'],
  },
  '11': {
    toan: ['Đại số: Dãy số', 'Đại số: Nguyên hàm', 'Hình học: Đường thẳng', 'Giải tích: Tích phân'],
    vat_li: ['Động lực học chất điểm', 'Tĩnh điện', 'Dòng điện không đổi'],
    hoa_hoc: ['Este - Lipit', 'Cacbohydrat', 'Amin - Axit amin'],
    sinh_hoc: ['Di truyền học', 'Biến dị', 'Ứng dụng di truyền học'],
    ngu_van: ['Chữ người tử tù', 'Hai đứa trẻ', 'Vợ chồng A Phủ', 'Rừng xà nu'],
    tieng_anh: ['Long Life', 'Generation Gap', 'Urbanization'],
    lich_su: ['Phong kiến Việt Nam thế kỷ XI-XV', 'Thời kỳ chiến quốc'],
    dia_li: ['Địa lý kinh tế nông nghiệp', 'Công nghiệp', 'Dịch vụ'],
    gdcd: ['Quyền con người', 'Quyền dân chủ', 'Công dân'],
    tin_hoc: ['Lập trình cơ bản', 'Cơ sở dữ liệu'],
    cong_nghe: ['Công nghệ kim loại', 'Công nghệ dệt'],
    the_chat: ['Bơi lội', 'Bóng chuyền', 'Võ thuật'],
  },
  '12': {
    toan: ['Đại số: Hệ bất phương trình', 'Hình học: Mặt cầu', 'Giải tích: Tích phân'],
    vat_li: ['Khúc xạ ánh sáng', 'Dao động điện từ', 'Lượng tử ánh sáng'],
    hoa_hoc: ['Đại cương hóa học hữu cơ', 'Hiđrocacbon', 'Dẫn xuất halogen'],
    sinh_hoc: ['Sinh học phân tử', 'Di truyền học người', 'Tiến hóa'],
    ngu_van: ['Tỳ bà hành', 'Chí khí anh hùng', 'Vội vàng', 'Tự do'],
    tieng_anh: ['Lifestyles', 'Art and Architecture', 'International Organizations'],
    lich_su: ['Chiến tranh thế giới', 'Cách mạng tháng Tám', 'Chiến dịch Điện Biên Phủ'],
    dia_li: ['Vấn đề môi trường', 'Phát triển bền vững', 'Vấn đề toàn cầu'],
    gdcd: ['Dân chủ', 'Pháp luật', 'Công bằng'],
    tin_hoc: ['Thiết kế web', 'An ninh mạng'],
    cong_nghe: ['Công nghệ chế biến', 'Công nghệ in'],
    the_chat: ['Bóng rổ', 'Bóng bàn', 'Thể dục nhịp điệu'],
  },
};

export const purposes = [
  { value: 'bai_tap', label: 'Làm bài tập' },
  { value: 'gioi_thieu', label: 'Giới thiệu kiến thức' },
  { value: 'tong_ket', label: 'Tổng kết bài học' },
  { value: 'kiem_tra', label: 'Ôn tập kiểm tra' },
  { value: 'du_an', label: 'Làm dự án' },
  { value: 'giai_thich', label: 'Giải thích khái niệm' },
];

export interface Textbook {
  subject: string;
  series: string;
  grade: number;
  cover: string;
  pdfUrl: string;
}

const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const textbookSeed = [
  // Lớp 10
  { subject: 'Toán học', series: 'Cánh Diều', grade: 10, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Toán học', series: 'Chân Trời Sáng Tạo', grade: 10, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Toán học', series: 'Kết Nối Tri Thức', grade: 10, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Cánh Diều', grade: 10, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Chân Trời Sáng Tạo', grade: 10, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Kết Nối Tri Thức', grade: 10, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Cánh Diều', grade: 10, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Chân Trời Sáng Tạo', grade: 10, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Kết Nối Tri Thức', grade: 10, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Cánh Diều', grade: 10, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Chân Trời Sáng Tạo', grade: 10, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Kết Nối Tri Thức', grade: 10, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Cánh Diều', grade: 10, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Chân Trời Sáng Tạo', grade: 10, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Kết Nối Tri Thức', grade: 10, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },

  // Lớp 11
  { subject: 'Toán học', series: 'Cánh Diều', grade: 11, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Toán học', series: 'Chân Trời Sáng Tạo', grade: 11, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Toán học', series: 'Kết Nối Tri Thức', grade: 11, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Cánh Diều', grade: 11, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Chân Trời Sáng Tạo', grade: 11, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Kết Nối Tri Thức', grade: 11, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Cánh Diều', grade: 11, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Chân Trời Sáng Tạo', grade: 11, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Kết Nối Tri Thức', grade: 11, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Cánh Diều', grade: 11, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Chân Trời Sáng Tạo', grade: 11, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Kết Nối Tri Thức', grade: 11, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Cánh Diều', grade: 11, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Chân Trời Sáng Tạo', grade: 11, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Kết Nối Tri Thức', grade: 11, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },

  // Lớp 12
  { subject: 'Toán học', series: 'Cánh Diều', grade: 12, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Toán học', series: 'Chân Trời Sáng Tạo', grade: 12, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Toán học', series: 'Kết Nối Tri Thức', grade: 12, cover: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Cánh Diều', grade: 12, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Chân Trời Sáng Tạo', grade: 12, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Vật lý', series: 'Kết Nối Tri Thức', grade: 12, cover: 'https://images.pexels.com/photos/8566472/pexels-photo-8566472.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Cánh Diều', grade: 12, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Chân Trời Sáng Tạo', grade: 12, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Hóa học', series: 'Kết Nối Tri Thức', grade: 12, cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Cánh Diều', grade: 12, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Chân Trời Sáng Tạo', grade: 12, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Sinh học', series: 'Kết Nối Tri Thức', grade: 12, cover: 'https://images.pexels.com/photos/5210335/pexels-photo-5210335.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Cánh Diều', grade: 12, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Chân Trời Sáng Tạo', grade: 12, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { subject: 'Ngữ văn', series: 'Kết Nối Tri Thức', grade: 12, cover: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

export const textbooks: Textbook[] = textbookSeed.map((book) => ({
  ...book,
  pdfUrl: samplePdfUrl,
}));

export const guides = [
  {
    id: 1,
    title: 'Cách sử dụng AI để ôn thi hiệu quả',
    excerpt: 'Hướng dẫn tận dụng AI Chatbot để ôn tập và ghi nhớ kiến thức lâu dài...',
    image: 'https://images.pexels.com/photos/5905711/pexels-photo-5905711.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Ôn thi',
    readTime: '5 phút',
  },
  {
    id: 2,
    title: 'Tạo câu hỏi trắc nghiệm bằng AI trong 30 giây',
    excerpt: 'Mẹo nhanh để tạo bộ câu hỏi trắc nghiệm chất lượng từ AI...',
    image: 'https://images.pexels.com/photos/6256032/pexels-photo-6256032.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Mẹo vặt',
    readTime: '3 phút',
  },
  {
    id: 3,
    title: 'Hiểu biết về AI và giới hạn của nó trong giáo dục',
    excerpt: 'Những điều cần biết về khả năng và giới hạn của AI khi học tập...',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Kiến thức',
    readTime: '7 phút',
  },
  {
    id: 4,
    title: 'Cách viết prompt chất lượng cho bài tập',
    excerpt: 'Nguyên tắc vàng để viết prompt giúp AI hiểu đúng yêu cầu của bạn...',
    image: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Kỹ năng',
    readTime: '6 phút',
  },
  {
    id: 5,
    title: 'Sử dụng AI để tóm tắt bài học nhanh',
    excerpt: 'Bí quyết tóm tắt nội dung sách giáo khoa chỉ trong vài phút...',
    image: 'https://images.pexels.com/photos/159823/books-writing-pages-reading-reading-books-159823.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Mẹo vặt',
    readTime: '4 phút',
  },
  {
    id: 6,
    title: 'AI hỗ trợ làm bài tập nhóm',
    excerpt: 'Cách tận dụng AI để phân công công việc và quản lý dự án nhóm...',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Kỹ năng',
    readTime: '5 phút',
  },
];

export interface GuideArticleSection {
  type: 'h2' | 'p' | 'ul';
  content: string | string[];
}

export interface GuideArticle {
  id: number;
  sections: GuideArticleSection[];
}

export const guideArticles: Record<number, GuideArticle> = {
  1: {
    id: 1,
    sections: [
      { type: 'p', content: 'Trí tuệ nhân tạo (AI) đang trở thành công cụ hỗ trợ học tập phổ biến trong giáo dục phổ thông. Bài viết này hướng dẫn học sinh THPT sử dụng AI Chatbot để ôn thi hiệu quả, ghi nhớ lâu dài và tránh phụ thuộc vào đáp án có sẵn.' },
      { type: 'h2', content: 'Tại sao nên dùng AI khi ôn thi?' },
      { type: 'p', content: 'AI có thể giải thích lại kiến thức theo nhiều cách, tạo câu hỏi luyện tập theo từng chủ đề và giúp bạn lập kế hoạch ôn tập cá nhân hóa. Điểm mạnh lớn nhất là tốc độ phản hồi và khả năng lặp lại nội dung theo nhu cầu.' },
      { type: 'h2', content: 'Quy trình ôn thi 4 bước với AI' },
      { type: 'ul', content: [
        'Bước 1 — Xác định chủ đề: Chọn môn, khối lớp và bài học cụ thể (ví dụ: Lớp 12 — Giải tích: Tích phân).',
        'Bước 2 — Yêu cầu giải thích: Viết prompt kiểu "Giải thích khái niệm tích phân bằng ví dụ đời sống, không đưa đáp án bài tập".',
        'Bước 3 — Tự kiểm tra: Nhờ AI tạo 5 câu hỏi trắc nghiệm, tự làm rồi đối chiếu lời giải chi tiết.',
        'Bước 4 — Tổng kết: Yêu cầu AI tóm tắt lỗi sai thường gặp và gợi ý cách ghi nhớ.',
      ]},
      { type: 'h2', content: 'Mẫu prompt ôn thi hiệu quả' },
      { type: 'p', content: '"Tôi là học sinh lớp 12, đang ôn Chương Khúc xạ ánh sáng (Vật lý). Hãy liệt kê 3 công thức quan trọng, giải thích từng công thức bằng 1 ví dụ, sau đó cho tôi 3 bài tập tự luyện mức trung bình — chỉ đưa đáp án sau khi tôi yêu cầu."' },
      { type: 'h2', content: 'Lưu ý quan trọng' },
      { type: 'ul', content: [
        'Luôn đối chiếu với sách giáo khoa và ý kiến giáo viên.',
        'Không copy nguyên bài làm; hãy viết lại bằng lời của bạn.',
        'Ôn theo lịch Pomodoro 25–5 phút để não bộ ghi nhớ tốt hơn.',
      ]},
    ],
  },
  2: {
    id: 2,
    sections: [
      { type: 'p', content: 'Tạo bộ câu hỏi trắc nghiệm chất lượng từng mất hàng giờ nếu làm thủ công. Với AI, bạn có thể có bộ 10 câu hỏi đúng chuẩn chương trình chỉ trong 30 giây — miễn là biết cách viết prompt.' },
      { type: 'h2', content: 'Công thức prompt 30 giây' },
      { type: 'p', content: 'Sử dụng cấu trúc: [Vai trò] + [Môn/Chương] + [Số câu] + [Độ khó] + [Định dạng đầu ra].' },
      { type: 'h2', content: 'Ví dụ prompt hoàn chỉnh' },
      { type: 'p', content: '"Bạn là giáo viên Hóa học lớp 11. Tạo 10 câu trắc nghiệm về Este — Lipit, mỗi câu 4 đáp án A–D, ghi rõ đáp án đúng và giải thích ngắn 2 dòng. Trình bày dạng bảng Markdown."' },
      { type: 'h2', content: 'Checklist chất lượng câu hỏi' },
      { type: 'ul', content: [
        'Câu hỏi bám sát mục tiêu bài học trong SGK.',
        'Đáp án nhiễu (distractor) hợp lý, không quá dễ loại trừ.',
        'Có ít nhất 2 câu mức vận dụng, không chỉ nhớ máy móc.',
        'Kiểm tra lại công thức/số liệu trước khi in hoặc chia sẻ.',
      ]},
      { type: 'h2', content: 'Mẹo nâng cao' },
      { type: 'p', content: 'Yêu cầu AI xuất file theo dạng "Câu 1... / Đáp án: ... / Giải thích: ..." để dễ import vào Google Forms hoặc Kahoot.' },
    ],
  },
  3: {
    id: 3,
    sections: [
      { type: 'p', content: 'AI là công cụ mạnh nhưng không phải "thầy giáo thay thế". Hiểu rõ khả năng và giới hạn giúp học sinh dùng AI có trách nhiệm, phù hợp quy chế nhà trường và thi cử.' },
      { type: 'h2', content: 'AI làm tốt những gì?' },
      { type: 'ul', content: [
        'Giải thích khái niệm theo nhiều góc độ và ngôn ngữ đơn giản.',
        'Tạo bài tập, flashcard, mindmap nhanh.',
        'Hỗ trợ dịch thuật, tóm tắt văn bản dài.',
        'Gợi ý phương pháp học phù hợp phong cách cá nhân.',
      ]},
      { type: 'h2', content: 'Giới hạn cần nhớ' },
      { type: 'ul', content: [
        'Có thể sai về số liệu, công thức hoặc sự kiện lịch sử — cần kiểm chứng.',
        'Không thay thế thí nghiệm, thực hành hay kỹ năng viết tay.',
        'Không nên nộp nguyên văn bài do AI viết trong các kỳ thi có quy định chống gian lận.',
        'Thiếu bối cảnh lớp học Việt Nam nếu prompt quá chung chung.',
      ]},
      { type: 'h2', content: 'Nguyên tắc sử dụng có đạo đức' },
      { type: 'p', content: 'Hãy coi AI như "gia sư phụ đạo": bạn vẫn phải tự suy nghĩ, tự trình bày và chịu trách nhiệm về kiến thức của mình.' },
    ],
  },
  4: {
    id: 4,
    sections: [
      { type: 'p', content: 'Prompt (câu lệnh) là "ngôn ngữ giao tiếp" với AI. Prompt càng rõ ràng, câu trả lời càng sát yêu cầu bài tập và chương trình học.' },
      { type: 'h2', content: 'Cấu trúc prompt 5 thành phần' },
      { type: 'ul', content: [
        'Vai trò: "Bạn là giáo viên Toán lớp 10..."',
        'Bối cảnh: môn học, bài, mục tiêu (làm bài tập / tổng kết / ôn thi).',
        'Yêu cầu cụ thể: số bước, định dạng, độ dài.',
        'Ràng buộc: "Không đưa đáp án trực tiếp", "Dùng thuật ngữ SGK Việt Nam".',
        'Ví dụ mong muốn (nếu cần).',
      ]},
      { type: 'h2', content: 'So sánh prompt yếu và mạnh' },
      { type: 'p', content: 'Yếu: "Giải bài 5 trang 42". — Mạnh: "Hướng dẫn tôi giải bài 5 trang 42 (Đại số lớp 10 — phương trình bậc hai) theo 3 bước, mỗi bước giải thích lý do, không viết đáp án cuối cho đến khi tôi thử xong."' },
      { type: 'h2', content: 'Thực hành ngay trên EduAI-Hub' },
      { type: 'p', content: 'Vào mục "Tạo Prompt" để chọn môn, khối lớp và mục đích — hệ thống sẽ gợi ý prompt chuẩn theo chương trình GDPT 2018.' },
    ],
  },
  5: {
    id: 5,
    sections: [
      { type: 'p', content: 'Tóm tắt bài học giúp não bộ củng cố kiến thức và tiết kiệm thời gian ôn tập. AI có thể hỗ trợ tóm tắt theo khung SGK nếu bạn cung cấp đủ ngữ cảnh.' },
      { type: 'h2', content: '3 phương pháp tóm tắt với AI' },
      { type: 'ul', content: [
        'Tóm tắt 1 trang: Yêu cầu AI rút gọn cả chương thành bullet points (tối đa 15 ý).',
        'Sơ đồ tư duy: "Vẽ mindmap dạng text cho chương Điện học lớp 10".',
        'Bảng so sánh: Phù hợp môn Lịch sử, Địa lý — so sánh sự kiện, nhân vật, thời gian.',
      ]},
      { type: 'h2', content: 'Prompt mẫu tóm tắt SGK' },
      { type: 'p', content: '"Tóm tắt Chương 2 — Liên kết hóa học (Hóa 10, bộ Cánh Diều) theo 4 phần: khái niệm chính, công thức, ví dụ minh họa, lỗi sai thường gặp. Mỗi phần tối đa 5 gạch đầu dòng."' },
      { type: 'h2', content: 'Sau khi tóm tắt' },
      { type: 'p', content: 'Đọc lại sách, gạch chân phần AI có thể bỏ sót, và tự viết 3 câu hỏi kiểm tra cho chính mình.' },
    ],
  },
  6: {
    id: 6,
    sections: [
      { type: 'p', content: 'Làm việc nhóm đòi hỏi phân công, theo dõi tiến độ và thống nhất nội dung. AI hỗ trợ lập kế hoạch, chia vai và soạn slide — nhưng thành viên vẫn phải họp và thống nhất trực tiếp.' },
      { type: 'h2', content: 'Workflow nhóm 5 bước' },
      { type: 'ul', content: [
        'Định nghĩa đề tài và rubric chấm điểm (nhờ AI gợi ý tiêu chí).',
        'Phân vai: thu thập tài liệu, viết nội dung, thiết kế slide, kiểm chứng.',
        'Soạn dàn ý chi tiết trước khi viết từng phần.',
        'Review chéo: mỗi người đọc phần của người khác.',
        'Tổng hợp và luyện thuyết trình.',
      ]},
      { type: 'h2', content: 'Prompt phân công nhóm' },
      { type: 'p', content: '"Nhóm 4 người làm dự án Sinh học về Di truyền. Đề xuất phân công 4 vai, timeline 2 tuần, và checklist nộp bài. Trình bày dạng bảng."' },
      { type: 'h2', content: 'Tránh tranh cãi' },
      { type: 'p', content: 'Thống nhất quy tắc: AI chỉ hỗ trợ soạn thảo nháp; mọi quyết định cuối cùng do nhóm bỏ phiếu hoặc theo rubric giáo viên.' },
    ],
  },
};

export const motivationalQuotes = [
  '"Học tập không phải là chuẩn bị cho cuộc sống, học tập chính là cuộc sống." - John Dewey',
  '"Giáo dục là vũ khí mạnh nhất để thay đổi thế giới." - Nelson Mandela',
  '"Kiến thức là ánh sáng, sự thiếu hiểu biết là bóng tối." - Học giả',
  '"Đầu tư vào tri thức mang lại lợi nhuận cao nhất." - Benjamin Franklin',
  '"Thất bại là mẹ thành công." - Tục ngữ Việt Nam',
];

export interface ReferencePrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  purpose?: string;
  subject?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  usage_note?: string;
  why_effective?: string;
  tags?: string[];
}

export const referencePrompts: ReferencePrompt[] = [
  {
    id: 'ref-1',
    purpose: 'Tóm tắt và ghi nhớ ý chính',
    subject: 'Ngữ văn',
    difficulty: 'basic',
    usage_note: 'Dùng khi bạn cần rút gọn một văn bản dài thành ý chính, từ khóa và câu hỏi tự kiểm tra trước khi ôn tập hoặc viết bài.',
    why_effective: 'Prompt này hiệu quả vì nó yêu cầu AI tóm tắt có cấu trúc, không chỉ rút ngắn văn bản. Học sinh nhận được ý chính, từ khóa và phần cần ghi nhớ.',
    tags: ['tóm tắt', 'đọc hiểu', 'tự kiểm tra'],
    title: 'Prompt tóm tắt văn bản',
    description: 'Tóm tắt bài đọc dài thành các ý chính, dễ ghi nhớ và ôn tập.',
    category: 'Ngữ văn',
    content: `Bạn là trợ lý học tập. Hãy đọc văn bản sau và tóm tắt theo cấu trúc:
1. Chủ đề chính (1-2 câu)
2. Các ý phụ quan trọng (gạch đầu dòng, tối đa 5 ý)
3. Từ khóa cần nhớ
4. Một câu hỏi gợi ý để tự kiểm tra

Yêu cầu: Ngắn gọn, dùng tiếng Việt, phù hợp học sinh THPT.

Văn bản:
[Dán nội dung văn bản vào đây]`,
  },
  {
    id: 'ref-2',
    purpose: 'Giải thích khái niệm',
    subject: 'Toán học',
    difficulty: 'intermediate',
    usage_note: 'Dùng khi bạn gặp một khái niệm Toán khó hiểu và cần AI giải thích chậm rãi bằng ví dụ, công thức và bài luyện tập.',
    why_effective: 'Prompt này hiệu quả vì nó yêu cầu AI đóng vai gia sư kiên nhẫn, giải thích bằng ví dụ và giúp học sinh hiểu bản chất thay vì chỉ nhớ công thức.',
    tags: ['toán học', 'khái niệm', 'ví dụ'],
    title: 'Prompt giải thích khái niệm Toán học',
    description: 'Hiểu sâu một khái niệm toán qua ví dụ, hình ảnh và bài tập minh họa.',
    category: 'Toán học',
    content: `Bạn là gia sư Toán học kiên nhẫn. Hãy giải thích khái niệm "[Tên khái niệm]" cho học sinh lớp [X] theo các bước:
1. Định nghĩa bằng ngôn ngữ đơn giản
2. Ví dụ thực tế dễ hình dung
3. Công thức (nếu có) kèm giải thích từng ký hiệu
4. Một bài tập cơ bản có lời giải chi tiết
5. Một bài tập nâng cao để tự luyện (chỉ đưa đề, không giải)

Lưu ý: Không nhảy bước, tránh thuật ngữ khó nếu chưa giải thích.`,
  },
  {
    id: 'ref-3',
    purpose: 'Luyện nói và phản hồi lỗi',
    subject: 'Tiếng Anh',
    difficulty: 'intermediate',
    usage_note: 'Dùng khi bạn muốn luyện hội thoại theo chủ đề, học cụm từ tự nhiên và nhận phản hồi sau khi tự trả lời.',
    why_effective: 'Prompt này hiệu quả vì nó tạo tình huống giao tiếp, phản hồi lỗi sai và giúp người học luyện theo trình độ cụ thể.',
    tags: ['tiếng Anh', 'hội thoại', 'phản hồi'],
    title: 'Prompt luyện nói tiếng Anh',
    description: 'Tạo kịch bản hội thoại và phản hồi theo trình độ của bạn.',
    category: 'Tiếng Anh',
    content: `Bạn là giáo viên tiếng Anh. Tôi là học sinh trình độ [A2/B1/B2], chủ đề: [Chủ đề].

Hãy:
1. Tạo hội thoại 8-10 lượt thoại (English) với từ vựng phù hợp trình độ
2. Dịch từng câu sang tiếng Việt
3. Liệt kê 5 cụm từ hữu ích kèm cách dùng
4. Đặt 3 câu hỏi để tôi tự luyện nói

Sau khi tôi trả lời, hãy sửa lỗi ngữ pháp và gợi ý cách nói tự nhiên hơn.`,
  },
  {
    id: 'ref-4',
    purpose: 'Ôn thi trắc nghiệm',
    subject: 'Ôn tập',
    difficulty: 'advanced',
    usage_note: 'Dùng khi bạn đã học xong một chương và muốn tự kiểm tra bằng câu hỏi trắc nghiệm có giải thích đáp án.',
    why_effective: 'Prompt này hiệu quả vì nó biến nội dung học thành câu hỏi kiểm tra, giúp học sinh tự đánh giá thay vì chỉ đọc lại bài.',
    tags: ['ôn thi', 'trắc nghiệm', 'tự đánh giá'],
    title: 'Prompt ôn thi trắc nghiệm',
    description: 'Sinh câu hỏi trắc nghiệm và giải thích đáp án theo chương SGK.',
    category: 'Ôn tập',
    content: `Bạn là trợ lý ôn thi. Dựa trên nội dung chương "[Tên chương]" môn [Môn học], hãy tạo 10 câu hỏi trắc nghiệm (4 đáp án A-D).

Với mỗi câu:
- Ghi rõ đáp án đúng
- Giải thích ngắn tại sao đáp án đó đúng
- Chỉ ra lỗi sai phổ biến ở các đáp án nhiễu

Cuối cùng, tổng kết 3 điểm kiến thức trọng tâm cần nhớ từ chương này.`,
  },
];
