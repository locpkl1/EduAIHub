export const grades = [
  { value: '10', label: 'Lớp 10' },
  { value: '11', label: 'Lớp 11' },
  { value: '12', label: 'Lớp 12' },
];

export const DEFAULT_BOOK_SERIES = 'Kết nối tri thức với cuộc sống';

export function isTargetBookSeries(value: string | null | undefined) {
  return typeof value === 'string' && value.toLocaleLowerCase('vi').includes('kết nối tri thức');
}

export const bookSeries = [
  { value: 'ket_noi', label: DEFAULT_BOOK_SERIES },
];

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

// Legacy/sample curriculum kept only as a compatibility fallback. It is not a
// verified source for the controlled Toán 11 curriculum demo.
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

export interface Textbook {
  subject: string;
  series: string;
  grade: number;
  cover: string;
  pdfUrl: string | null;
}

export const textbooks: Textbook[] = [10, 11, 12].flatMap((grade) =>
  ['Toán học', 'Vật lý', 'Hóa học', 'Sinh học', 'Ngữ văn'].map((subject) => ({
    subject,
    series: DEFAULT_BOOK_SERIES,
    grade,
    cover: '',
    pdfUrl: null,
  }))
);

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
    usage_note: 'Dùng khi bạn gặp một khái niệm Toán khó hiểu và muốn được gợi mở từng bước trước khi xem lời giải.',
    why_effective: 'Prompt này yêu cầu AI hỏi lại, giải thích bằng ví dụ và dành phần suy luận chính cho học sinh thay vì đưa ngay lời giải hoàn chỉnh.',
    tags: ['toán học', 'khái niệm', 'ví dụ'],
    title: 'Prompt giải thích khái niệm Toán học',
    description: 'Tìm hiểu một khái niệm Toán qua câu hỏi gợi mở, ví dụ và phần tự luyện.',
    category: 'Toán học',
    content: `Bạn là gia sư Toán học kiên nhẫn. Hãy giải thích khái niệm "[Tên khái niệm]" cho học sinh lớp [X] theo các bước:
1. Hỏi tôi đã biết gì về khái niệm này
2. Giải thích bằng ngôn ngữ đơn giản và một ví dụ dễ hình dung
3. Nêu công thức (nếu có) và giải thích từng ký hiệu
4. Cho một bài cơ bản, dừng lại để tôi tự làm từng bước
5. Chỉ phản hồi hoặc gợi ý sau khi tôi trả lời

Lưu ý: Không đưa đáp án cuối ngay, không nhảy bước và tránh thuật ngữ khó nếu chưa giải thích.`,
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
    usage_note: 'Dùng khi bạn đã học xong một nội dung và muốn tự kiểm tra dựa trên chính tài liệu mình cung cấp.',
    why_effective: 'Prompt này hiệu quả vì nó biến nội dung học thành câu hỏi kiểm tra, giúp học sinh tự đánh giá thay vì chỉ đọc lại bài.',
    tags: ['ôn thi', 'trắc nghiệm', 'tự đánh giá'],
    title: 'Prompt ôn thi trắc nghiệm',
    description: 'Tạo câu hỏi trắc nghiệm và phản hồi dựa trên nội dung đã cung cấp.',
    category: 'Ôn tập',
    content: `Bạn là trợ lý ôn thi. Chỉ dựa trên phần nội dung tôi dán bên dưới, hãy tạo 10 câu hỏi trắc nghiệm (4 đáp án A-D) từ cơ bản đến vận dụng.

Hãy hỏi từng câu một và chờ tôi trả lời. Sau mỗi câu:
- Cho biết câu trả lời của tôi đúng hay cần xem lại
- Giải thích ngắn lý do
- Chỉ ra lỗi suy luận nếu có

Cuối cùng, tổng kết 3 điểm tôi cần ôn lại. Không bổ sung kiến thức ngoài nội dung đã cung cấp.

Nội dung ôn tập:
[Dán nội dung đã học vào đây]`,
  },
];
