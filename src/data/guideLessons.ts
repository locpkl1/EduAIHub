import {
  BookOpen,
  Brain,
  ClipboardCheck,
  GraduationCap,
  LockKeyhole,
  MessageSquareText,
  NotebookPen,
  Route,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export type GuideAccent = 'blue' | 'green' | 'orange' | 'ink';
export type GuideCalloutTone = 'principle' | 'warning' | 'try';
export type GuideStageNumber = 1 | 2 | 3 | 4;

export type GuideContentBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'subheading'; content: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'quote'; content: string }
  | { type: 'prompt'; title: string; content: string; explanation?: string }
  | {
      type: 'comparison';
      beforeLabel?: string;
      before: string;
      afterLabel?: string;
      after: string;
      explanation?: string;
    }
  | { type: 'callout'; tone: GuideCalloutTone; title: string; content: string };

export interface GuideLessonSection {
  heading: string;
  body?: string[];
  bullets?: string[];
  blocks?: GuideContentBlock[];
}

export interface GuideLesson {
  number: number;
  stage: GuideStageNumber;
  slug: string;
  legacySlugs?: string[];
  title: string;
  tag: string;
  readTime: string;
  cardDescription: string;
  goal: string;
  intro: string;
  objectives: string[];
  icon: LucideIcon;
  accent: GuideAccent;
  sections: GuideLessonSection[];
  takeaways: string[];
  selfCheck: string[];
  transition?: string;
}

export interface GuideStage {
  number: GuideStageNumber;
  title: string;
  description: string;
}

export const guideStages: GuideStage[] = [
  {
    number: 1,
    title: 'Hiểu AI và biết cách giao tiếp với AI',
    description: 'Làm quen EduAI-Hub, chọn công cụ theo nhiệm vụ và biến nhu cầu học thành yêu cầu rõ ràng.',
  },
  {
    number: 2,
    title: 'Học với AI nhưng không để AI học thay',
    description: 'Biến AI thành người hướng dẫn, tập kiểm chứng và điều chỉnh cách dùng theo từng môn học.',
  },
  {
    number: 3,
    title: 'Biến AI thành một hệ thống tự học',
    description: 'Học từ tài liệu, luyện nhớ, làm dự án và thiết lập một cách hỗ trợ phù hợp với chính bạn.',
  },
  {
    number: 4,
    title: 'Trở thành người học tự chủ trong thời đại AI',
    description: 'Giữ an toàn, trung thực và biết lúc nào nên đóng AI lại để tự suy nghĩ.',
  },
];

export const guideLessons: GuideLesson[] = [
  {
    number: 1,
    stage: 1,
    slug: 'huong-dan-su-dung-eduai-hub-va-ba-tro-ly-ai',
    legacySlugs: ['chao-mung-den-voi-eduai-hub', 'ba-tro-ly-ai-trong-eduai-hub'],
    title: 'Hướng dẫn sử dụng EduAI-Hub và ba trợ lý AI',
    tag: 'Bắt đầu',
    readTime: '9 phút',
    cardDescription: 'Hiểu cách EduAI-Hub hoạt động và chọn đúng trợ lý cho từng giai đoạn từ suy nghĩ, tạo prompt đến tự đánh giá prompt.',
    goal: 'Biết EduAI-Hub giúp bạn rèn kỹ năng học cùng AI ra sao và bắt đầu một phiên học đúng chỗ.',
    intro:
      'Nếu bạn mới vào EduAI-Hub, câu hỏi đầu tiên có thể là: “Ở đây mình phải làm gì?”. Câu trả lời ngắn gọn là nền tảng này không cố học thay bạn. Nó giúp bạn sử dụng những AI phổ biến theo cách rõ mục tiêu, có kiểm chứng và giữ lại phần suy nghĩ quan trọng cho chính mình.',
    objectives: [
      'Phân biệt EduAI-Hub với một chatbot giải bài.',
      'Nhận ra các khu vực thật sự có trên nền tảng và vai trò của từng khu vực.',
      'Chọn đúng một trong ba trợ lý AI theo tình huống.',
      'Thực hiện workflow suy nghĩ, tạo prompt, đánh giá và tự làm lại.',
    ],
    icon: GraduationCap,
    accent: 'blue',
    sections: [
      {
        heading: 'EduAI-Hub không phải nơi lấy đáp án thật nhanh',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Một chatbot mạnh đến đâu vẫn không tự biết bạn học lớp mấy, đã hiểu phần nào, đang mắc ở bước nào và muốn được hỗ trợ theo cách gì. Nếu bạn chỉ gửi một đề bài, AI thường đoán những thông tin còn thiếu rồi tạo ra câu trả lời. Đoán đúng thì tiện; đoán sai thì câu trả lời có thể dài nhưng không giúp đúng chỗ.',
          },
          {
            type: 'paragraph',
            content:
              'EduAI-Hub tập trung vào khoảng trống trước khi bạn bấm gửi: xác định nhu cầu, cung cấp bối cảnh, chọn mức hỗ trợ và nghĩ cách kiểm tra. Đây là những kỹ năng có thể mang sang ChatGPT, Gemini, NotebookLM hoặc bất kỳ công cụ nào xuất hiện sau này.',
          },
          { type: 'quote', content: 'AI có thể hỗ trợ việc học, nhưng bạn vẫn phải là người tư duy, kiểm tra và hiểu bài.' },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Bắt đầu bằng nhu cầu, không bắt đầu bằng prompt',
            content: 'Trước câu “Mình nên viết gì cho AI?”, hãy hỏi “Mình đang muốn hiểu hoặc làm được điều gì?”.',
          },
        ],
      },
      {
        heading: 'Bốn năng lực bạn sẽ luyện trên nền tảng',
        blocks: [
          { type: 'subheading', content: '1. Biết mình đang cần gì' },
          {
            type: 'paragraph',
            content:
              '“Mình không hiểu Toán” quá rộng để hành động. “Mình hiểu công thức đạo hàm nhưng chưa hình dung vì sao đạo hàm liên quan đến độ dốc” là một nhu cầu có thể xử lý. Việc gọi đúng vấn đề giúp cả bạn lẫn AI tránh đi vòng.',
          },
          { type: 'subheading', content: '2. Biết cung cấp bối cảnh vừa đủ' },
          {
            type: 'comparison',
            before: 'Giải thích giới hạn.',
            after: 'Mình học lớp 11, mới bắt đầu giới hạn hàm số và thường nhầm ở bước biến đổi biểu thức khi gặp dạng vô định.',
            explanation: 'Bối cảnh tốt không cần kể mọi thứ về bạn. Nó chỉ cần làm rõ mức hiện tại, nội dung và điểm đang mắc.',
          },
          { type: 'subheading', content: '3. Biết yêu cầu đúng kiểu hỗ trợ' },
          {
            type: 'paragraph',
            content:
              'Khi cần học, câu “Đừng giải luôn; hãy hỏi mình từng bước” thường có ích hơn “Cho mình lời giải chi tiết”. Bạn có thể xin một ví dụ đơn giản, một gợi ý nhỏ, câu hỏi Socratic, phản hồi về lỗi đầu tiên hoặc một bài tương tự để tự thử.',
          },
          { type: 'subheading', content: '4. Biết kiểm tra câu trả lời' },
          {
            type: 'paragraph',
            content:
              'AI có thể viết rất trôi chảy nhưng vẫn sai dữ kiện, bỏ điều kiện hoặc hiểu nhầm câu hỏi. Bạn là người quyết định thông tin nào được dùng. Thói quen đối chiếu với sách, nguồn gốc và cách làm của mình quan trọng hơn vẻ tự tin của câu trả lời.',
          },
        ],
      },
      {
        heading: 'Các khu vực chính của EduAI-Hub',
        blocks: [
          {
            type: 'paragraph',
            content: 'Mỗi khu vực giải quyết một phần khác nhau của quá trình học. Bạn không cần mở tất cả trong một buổi; hãy chọn đúng nơi cho việc đang làm.',
          },
          {
            type: 'list',
            items: [
              'Hướng Dẫn: mini-course 12 bài bạn đang đọc, đi từ hiểu AI đến tự học ít phụ thuộc AI hơn.',
              'Công Cụ AI: ba trợ lý giúp học tư duy prompt, gợi ý prompt theo bối cảnh và đánh giá prompt bạn tự viết.',
              'Bài Học: các bài viết và kinh nghiệm độc lập cho tình huống cụ thể.',
              'Kho Prompt: nơi tham khảo, lưu và dùng lại prompt hữu ích. Mục tiêu là hiểu cấu trúc rồi chỉnh sửa, không phải chỉ copy.',
              'Bản đồ chương trình: giúp tìm ngữ cảnh lớp, môn, mảng kiến thức và chủ đề trước khi tạo prompt học tập.',
              'Dashboard và Hồ sơ: nơi xem hoạt động đã lưu; hồ sơ có thể chứa bối cảnh học tập bạn chủ động cung cấp.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Đừng phát minh nhu cầu để dùng hết tính năng',
            content: 'Nếu hôm nay bạn chỉ cần kiểm tra một prompt đã viết, hãy đi thẳng đến trợ lý đánh giá. Công cụ phục vụ nhiệm vụ, không phải ngược lại.',
          },
        ],
      },
      {
        heading: 'Workflow cốt lõi: nghĩ trước, viết sau, rồi đánh giá',
        blocks: [
          { type: 'quote', content: 'Học tư duy prompt → Tạo prompt → Đánh giá và cải thiện prompt' },
          {
            type: 'list',
            ordered: true,
            items: [
              'Xác định mục tiêu, bối cảnh, phần đã thử và kiểu hỗ trợ bạn muốn nhận.',
              'Biến những thông tin đó thành một yêu cầu ngắn, rõ và đủ dùng.',
              'Đọc lại prompt: chỗ nào mơ hồ, thiếu dữ liệu, thừa yêu cầu hoặc vô tình bảo AI làm thay?',
              'Thử prompt với AI, đặt câu hỏi tiếp theo và kiểm chứng phần quan trọng.',
              'Đóng câu trả lời, tự làm một nhiệm vụ tương tự để xem mình đã học được gì.',
            ],
          },
          {
            type: 'paragraph',
            content:
              'Quá trình này không cần mất nhiều phút. Khi đã quen, bạn có thể thực hiện bằng vài câu tự hỏi trong đầu. Mục tiêu dài hạn của EduAI-Hub chính là để bạn ngày càng ít cần nền tảng nhắc lại các bước đó.',
          },
        ],
      },
      {
        heading: 'Ba trợ lý AI: chọn đúng lối vào',
        blocks: [
          { type: 'subheading', content: 'Học tư duy prompt' },
          {
            type: 'paragraph',
            content:
              'Chọn khi bạn biết mình muốn AI giúp nhưng chưa biết bắt đầu từ đâu. Trợ lý này giúp bạn làm rõ mục tiêu, tìm bối cảnh còn thiếu và nghĩ xem mức hỗ trợ nào giữ được vai trò chủ động của bạn.',
          },
          { type: 'subheading', content: 'Gợi ý prompt học tập' },
          {
            type: 'paragraph',
            content:
              'Chọn khi mục tiêu đã rõ và bạn muốn biến lớp, môn, mảng kiến thức, chủ đề, mức hiện tại cùng cách học mong muốn thành một prompt có cấu trúc. Bạn vẫn cần đọc và sửa bản gợi ý trước khi dùng.',
          },
          { type: 'subheading', content: 'Đánh giá prompt của bạn' },
          {
            type: 'paragraph',
            content:
              'Chọn khi bạn muốn tự viết trước. Trợ lý phân tích điểm mạnh, chỗ thiếu và cách sửa, nhờ đó bạn hiểu vì sao phiên bản mới rõ hơn. Đây là lối luyện quan trọng nhất nếu mục tiêu là tự lập.',
          },
          {
            type: 'comparison',
            beforeLabel: 'Nếu bạn đang nghĩ',
            before: '“Mình không biết phải hỏi thế nào.”',
            afterLabel: 'Hãy bắt đầu ở',
            after: 'Học tư duy prompt → Gợi ý prompt học tập → tự viết và đưa sang Đánh giá prompt của bạn.',
          },
        ],
      },
      {
        heading: 'Tình huống: từ một câu mơ hồ đến phiên học thật',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Một bạn lớp 11 mở chatbot và viết: “Dạy mình giới hạn hàm số”. AI có thể trả lại cả một bài giảng dài, nhưng chưa biết bạn đã hiểu khái niệm giới hạn hay đang mắc ở phép biến đổi, cũng không biết bạn muốn xem lời giải hay tự làm từng bước.',
          },
          {
            type: 'prompt',
            title: 'Prompt sau khi làm rõ nhu cầu',
            content:
              'Mình là học sinh lớp 11 và mới học giới hạn hàm số. Mình hiểu ý tưởng giới hạn cơ bản nhưng thường mắc ở bước biến đổi biểu thức khi gặp dạng vô định. Hãy đưa một ví dụ đơn giản trước. Đừng giải toàn bộ ngay; hãy hỏi mình nên làm bước nào tiếp theo và chỉ gợi ý khi mình bị mắc.',
            explanation:
              '“Lớp 11” và “mới học” tạo bối cảnh; “mắc ở bước biến đổi” xác định vấn đề; “ví dụ đơn giản” là nhiệm vụ; “đừng giải toàn bộ” là ràng buộc giữ phần suy nghĩ cho bạn.',
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Thử ngay trong hai phút',
            content:
              'Chọn một nội dung bạn đang học rồi trả lời: Mình muốn hiểu điều gì? Mình đã biết gì? Mình đang mắc ở đâu? Mình muốn AI giúp bằng cách nào? Chỉ sau đó mới mở một trợ lý.',
          },
        ],
      },
    ],
    takeaways: [
      'EduAI-Hub dạy cách học cùng AI, không thay thế các AI phổ biến và không giải bài thay bạn.',
      'Prompt tốt bắt đầu từ việc hiểu nhu cầu của bản thân.',
      'Ba trợ lý tương ứng với ba lúc: chưa rõ cách nghĩ, cần tạo prompt và muốn tự đánh giá.',
      'Một phiên học chỉ hoàn thành khi bạn đã kiểm chứng và tự làm lại.',
    ],
    selfCheck: [
      'Nếu đã tự viết prompt nhưng thấy nó mơ hồ, bạn nên chọn trợ lý nào? Vì sao?',
      'Bốn câu hỏi nào nên được trả lời trước khi mở AI?',
      'Bạn sẽ làm gì sau khi AI trả lời để biết mình thật sự hiểu?',
    ],
    transition: 'Ở bài tiếp theo, mình sẽ tạm rời EduAI-Hub để hiểu loại công cụ mà mình đang học cách sử dụng: AI.',
  },
  {
    number: 2,
    stage: 1,
    slug: 'ai-la-gi-chon-cong-cu-ai-phu-hop',
    legacySlugs: ['ai-la-gi', 'chatgpt-gemini-claude-khac-nhau-the-nao'],
    title: 'AI là gì? Chọn công cụ AI phù hợp cho việc học',
    tag: 'Nền tảng',
    readTime: '11 phút',
    cardDescription: 'Hiểu AI tạo sinh ở mức cần thiết và biết khi nào nên sử dụng chatbot, chế độ học hay công cụ làm việc với tài liệu.',
    goal: 'Chọn công cụ theo nhiệm vụ học tập thay vì chạy theo tên nổi tiếng hoặc một bảng xếp hạng.',
    intro:
      'ChatGPT, Gemini, NotebookLM và nhiều công cụ khác đều được gọi là AI, nhưng chúng không hoàn toàn giống nhau. Nếu bạn có một PDF 100 trang cần học, một cuộc chat trống chưa chắc là điểm bắt đầu tốt nhất. Bài này giúp bạn hỏi đúng câu: nhiệm vụ của mình cần AI làm gì?',
    objectives: [
      'Hiểu AI tạo sinh và AI ngôn ngữ ở mức đủ dùng.',
      'Nhận ra vì sao câu trả lời trôi chảy chưa chắc chính xác.',
      'Phân biệt chatbot đa dụng, chế độ học có hướng dẫn và công cụ bám theo nguồn.',
      'Chọn loại công cụ phù hợp cho bốn tình huống học tập phổ biến.',
    ],
    icon: Brain,
    accent: 'green',
    sections: [
      {
        heading: 'AI tạo sinh làm gì khi bạn gửi một yêu cầu?',
        blocks: [
          {
            type: 'paragraph',
            content:
              'AI tạo sinh có thể tạo văn bản, hình ảnh, âm thanh, mã nguồn, câu hỏi, bản tóm tắt và nhiều loại đầu ra khác. Trong EduAI-Hub, mình chủ yếu nói về AI ngôn ngữ: hệ thống nhận phần bạn nhập vào rồi tạo phản hồi phù hợp với mẫu và ngữ cảnh nó có.',
          },
          {
            type: 'paragraph',
            content:
              'Bạn không cần học sâu về mô hình hay kiến trúc kỹ thuật để dùng AI tốt. Điều cần nhớ là AI không nhìn thấy hoàn cảnh ngoài những gì bạn cung cấp, có thể suy diễn khi thiếu dữ liệu và có thể tạo một câu nghe hợp lý dù dữ kiện sai.',
          },
          { type: 'quote', content: 'Trôi chảy không đồng nghĩa với chính xác. Câu trả lời tự nhiên vẫn cần được đọc bằng tư duy phản biện.' },
        ],
      },
      {
        heading: 'AI có thể hỗ trợ việc học ở những khâu nào?',
        blocks: [
          {
            type: 'list',
            items: [
              'Giải thích: diễn đạt lại một khái niệm, tạo ví dụ, so sánh hai ý hoặc đổi mức độ khó.',
              'Luyện tập: hỏi từng câu, tạo bài tương tự, đóng vai người phỏng vấn và kiểm tra phần bạn chưa chắc.',
              'Phản hồi: tìm lỗi trong lời giải, phản biện lập luận, góp ý bài viết, sửa ngữ pháp hoặc hỗ trợ debug.',
              'Tổ chức kiến thức: tạo outline, timeline, bảng so sánh hoặc bản đồ khái niệm để bạn tiếp tục chỉnh.',
              'Học từ tài liệu: hỏi đáp theo bộ nguồn, tìm ý chính, kết nối các phần và tạo câu hỏi ôn tập.',
              'Lập kế hoạch: chia mục tiêu thành buổi học, xác định phần yếu và sắp xếp thứ tự ôn.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Khả năng tạo đầu ra không phải bằng chứng về sự hiểu biết',
            content: 'AI có thể tạo lời giải, trích dẫn hoặc kế hoạch rất đẹp. Bạn vẫn cần kiểm tra dữ kiện, nguồn và xem đầu ra có thật sự phù hợp với mục tiêu học hay không.',
          },
        ],
      },
      {
        heading: 'Ba kiểu công cụ thường gặp',
        blocks: [
          { type: 'subheading', content: 'Chatbot đa dụng' },
          {
            type: 'paragraph',
            content:
              'Những chatbot như ChatGPT hoặc Gemini phù hợp với hỏi đáp, giải thích, luyện hội thoại, phản biện, viết, code và học từng bước. Chúng linh hoạt vì bạn có thể mô tả hầu hết nhiệm vụ bằng hội thoại. Đổi lại, chất lượng phụ thuộc nhiều vào bối cảnh bạn đưa vào và cách bạn kiểm chứng.',
          },
          { type: 'subheading', content: 'Chế độ học có hướng dẫn' },
          {
            type: 'paragraph',
            content:
              'Một số chatbot có lối học được thiết kế để đặt câu hỏi, chia vấn đề thành bước và kiểm tra mức hiểu thay vì đưa toàn bộ đáp án. Bạn cũng có thể tạo hành vi tương tự bằng prompt Socratic: yêu cầu AI hỏi từng câu, chờ bạn trả lời và tăng mức hỗ trợ khi cần.',
          },
          { type: 'subheading', content: 'Công cụ làm việc dựa trên nguồn' },
          {
            type: 'paragraph',
            content:
              'Với chatbot trống, bạn thường bắt đầu bằng câu hỏi. Với công cụ như NotebookLM, bạn có thể bắt đầu bằng bộ nguồn đã chọn: PDF, ghi chú, tài liệu, website hoặc loại nguồn được hỗ trợ. Sau đó bạn hỏi, tạo hướng dẫn học hay luyện tập dựa trên bộ nguồn đó.',
          },
          {
            type: 'paragraph',
            content:
              'Bám theo nguồn giúp bạn biết phạm vi mà AI đang sử dụng và dễ lần về nội dung gốc hơn. Nó không làm kết quả đúng 100%. Nguồn kém, nguồn mâu thuẫn hoặc câu hỏi mơ hồ vẫn có thể tạo ra phản hồi cần sửa.',
          },
        ],
      },
      {
        heading: 'Công cụ hiện nay: thông tin nên xem như ảnh chụp theo thời điểm',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Tên tính năng và phạm vi truy cập có thể thay đổi theo tài khoản, thiết bị và thời điểm. Bạn có thể gặp Study Mode trong ChatGPT hoặc Guided Learning trong Gemini như những ví dụ về trải nghiệm học có hướng dẫn. NotebookLM là ví dụ rõ cho workflow bắt đầu từ nguồn tài liệu.',
          },
          {
            type: 'list',
            items: [
              'ChatGPT: chatbot đa dụng; có thể dùng để giải thích, luyện tập, phản biện, viết và code. Chế độ học hướng tới đối thoại từng bước thay vì chỉ lấy đáp án.',
              'Gemini: chatbot đa dụng có thể làm việc với văn bản và nhiều dạng nội dung; Guided Learning dùng câu hỏi cùng hướng dẫn theo bước để khuyến khích tham gia.',
              'NotebookLM: cho phép thêm nguồn, trò chuyện dựa trên nguồn và tạo các công cụ học như study guide, flashcard hoặc quiz; nội dung AI tạo vẫn có thể sai.',
            ],
          },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Kiến thức bền hơn tên nút',
            content: 'Dù tính năng đổi tên, nguyên tắc vẫn vậy: chọn công cụ theo nguồn dữ liệu, kiểu tương tác và đầu ra bạn cần.',
          },
        ],
      },
      {
        heading: 'Chọn theo nhiệm vụ, không chọn theo danh tiếng',
        blocks: [
          {
            type: 'comparison',
            beforeLabel: 'Câu hỏi dễ làm bạn chạy vòng',
            before: 'AI nào mạnh nhất để học?',
            afterLabel: 'Câu hỏi có thể hành động',
            after: 'Mình cần AI giải thích, hỏi từng bước, đọc bộ tài liệu hay kiểm tra thông tin mới?',
          },
          {
            type: 'list',
            items: [
              'Muốn hiểu một khái niệm theo nhiều cách: bắt đầu với chatbot đa dụng.',
              'Muốn AI liên tục hỏi lại và điều chỉnh độ khó: dùng chế độ học có hướng dẫn hoặc prompt Socratic.',
              'Có nhiều PDF và muốn câu trả lời bám vào chúng: cân nhắc công cụ làm việc theo nguồn.',
              'Muốn kiểm tra thông tin thời sự: ưu tiên công cụ có thể đưa nguồn, rồi tự mở và đọc nguồn gốc.',
              'Muốn luyện nói: chọn công cụ hỗ trợ hội thoại phù hợp, nhưng vẫn đặt mục tiêu và tiêu chí phản hồi rõ.',
            ],
          },
        ],
      },
      {
        heading: 'Tình huống thực hành: bạn sẽ chọn gì?',
        blocks: [
          {
            type: 'callout',
            tone: 'try',
            title: 'Thử phân loại bốn nhiệm vụ',
            content: '1. Học cấu trúc một chương SGK. 2. Luyện nói tiếng Anh và chỉ sửa hai lỗi mỗi lượt. 3. Debug đoạn code bạn đã viết. 4. So sánh ý chính trong năm PDF. Với mỗi nhiệm vụ, hãy chọn loại công cụ trước khi chọn tên sản phẩm.',
          },
          {
            type: 'paragraph',
            content:
              'Không chỉ có một đáp án. Chương SGK có thể học bằng chatbot nếu bạn đưa từng phần, hoặc bằng công cụ theo nguồn nếu có bản tài liệu. Điều đáng đánh giá là lý do chọn: nguồn ở đâu, cần tương tác kiểu gì, phần nào phải kiểm chứng và sau đó bạn sẽ tự làm gì.',
          },
          {
            type: 'prompt',
            title: 'Mẫu yêu cầu chọn workflow',
            content:
              'Mình có nhiệm vụ sau: [mô tả]. Nguồn mình đang có: [nguồn]. Mục tiêu cuối buổi: [mục tiêu]. Hãy giúp mình xác định nên dùng chatbot đa dụng, chế độ học có hướng dẫn hay công cụ bám theo nguồn. Nêu lý do, rủi ro cần kiểm chứng và một cách tự kiểm tra sau khi dùng AI.',
          },
        ],
      },
    ],
    takeaways: [
      'AI tạo sinh rất mạnh ở việc tạo và biến đổi nội dung, nhưng không phải nguồn chân lý.',
      'Chatbot, chế độ học có hướng dẫn và công cụ theo nguồn tạo ra những workflow khác nhau.',
      'Đừng hỏi AI nào mạnh nhất; hãy hỏi nhiệm vụ này cần AI làm gì.',
      'Công cụ tốt không thay thế phương pháp học tốt và bước tự kiểm tra.',
    ],
    selfCheck: [
      'Vì sao một câu trả lời trôi chảy vẫn có thể sai?',
      'Khi có năm PDF cần học, công cụ bám theo nguồn có lợi thế gì và vẫn còn rủi ro nào?',
      'Hãy chọn một nhiệm vụ hôm nay và nêu ba tiêu chí để chọn công cụ.',
    ],
    transition: 'Đã chọn đúng loại công cụ, bước tiếp theo là giao tiếp để nó hiểu đúng việc bạn cần. Bài 03 sẽ đi vào prompt.',
  },
  {
    number: 3,
    stage: 1,
    slug: 'prompt-la-gi-cach-giao-tiep-hieu-qua-voi-ai',
    legacySlugs: ['prompt-la-gi', 'cong-thuc-prompt-4-phan'],
    title: 'Prompt là gì? Cách giao tiếp hiệu quả với AI',
    tag: 'Prompt',
    readTime: '12 phút',
    cardDescription: 'Học cách biến một yêu cầu mơ hồ thành prompt rõ mục tiêu, đủ bối cảnh và phù hợp với việc tự học.',
    goal: 'Viết prompt rõ bằng năm thành phần cần thiết, biết chia nhỏ nhiệm vụ và dùng follow-up để điều chỉnh.',
    intro:
      '“Dạy mình đạo hàm” và “Mình học lớp 11, nhớ công thức nhưng chưa hiểu ý nghĩa hình học của đạo hàm” đều là prompt. Câu thứ hai thường tạo trải nghiệm học tốt hơn không phải vì dài hơn, mà vì AI bớt phải đoán và biết phần suy nghĩ nào cần giữ lại cho bạn.',
    objectives: [
      'Giải thích prompt bằng ngôn ngữ đơn giản.',
      'Dùng khung Mục tiêu, Bối cảnh, Nhiệm vụ, Ràng buộc và Định dạng.',
      'Nhận ra khi nào nên chia một yêu cầu lớn thành nhiều lượt.',
      'Viết follow-up để điều chỉnh câu trả lời thay vì bắt đầu lại từ đầu.',
    ],
    icon: MessageSquareText,
    accent: 'orange',
    sections: [
      {
        heading: 'Prompt là phần bạn đưa vào cuộc trò chuyện',
        blocks: [
          {
            type: 'paragraph',
            content:
              'Prompt có thể là câu hỏi, chỉ dẫn, dữ liệu, ví dụ, hình ảnh, quy tắc hoặc một đoạn bạn muốn AI nhận xét. Nói gọn, đó là thông tin và yêu cầu giúp AI biết bạn muốn làm gì trong lượt hiện tại.',
          },
          {
            type: 'paragraph',
            content:
              'Prompting về bản chất là giao tiếp rõ ràng. Bạn không cần thuộc những câu lệnh bí mật. Một người hiểu vấn đề mình đang giải quyết thường viết prompt tốt hơn người nhớ nhiều framework nhưng không xác định được mục tiêu.',
          },
          { type: 'quote', content: 'Prompt engineering không phải cuộc thi xem ai viết câu lệnh dài hơn.' },
          {
            type: 'comparison',
            before: 'Dạy mình đạo hàm.',
            after: 'Mình học lớp 11, đã biết các công thức đạo hàm cơ bản nhưng chưa hiểu ý nghĩa hình học. Hãy giải thích bằng trực giác trước, dùng một ví dụ đơn giản, rồi hỏi mình ba câu để kiểm tra. Đừng đưa đáp án trước khi mình thử.',
            explanation: 'Câu thứ hai làm rõ mức hiện tại, chỗ chưa hiểu, thứ tự hỗ trợ và ranh giới. Độ dài chỉ là hệ quả của việc cung cấp đúng thông tin.',
          },
        ],
      },
      {
        heading: 'Khung năm thành phần của EduAI-Hub',
        blocks: [
          { type: 'subheading', content: '1. Mục tiêu' },
          { type: 'paragraph', content: 'Bạn muốn hiểu, luyện, sửa, so sánh hay tạo kế hoạch? “Hoàn thành bài” thường quá chung; “tự giải thích được ý nghĩa hình học của đạo hàm” cho biết đích rõ hơn.' },
          { type: 'subheading', content: '2. Bối cảnh' },
          { type: 'paragraph', content: 'AI cần biết lớp, môn, phần đã học, dữ liệu đang có và chỗ bạn mắc. Chỉ đưa thông tin liên quan. Bối cảnh tốt giúp câu trả lời vừa sức nhưng không biến prompt thành bản tự truyện.' },
          { type: 'subheading', content: '3. Nhiệm vụ' },
          { type: 'paragraph', content: 'Nói rõ AI phải làm gì ở lượt này: đặt câu hỏi chẩn đoán, giải thích một khái niệm, tìm lỗi đầu tiên, tạo bài tương tự hay phản biện outline. Một lượt nên có trọng tâm.' },
          { type: 'subheading', content: '4. Ràng buộc' },
          { type: 'paragraph', content: 'Ràng buộc giữ AI khỏi làm phần bạn cần tự làm: không đưa đáp án ngay, chỉ gợi ý một bước, bám theo tài liệu, nói rõ khi không đủ nguồn hoặc chờ bạn trả lời trước khi tiếp tục.' },
          { type: 'subheading', content: '5. Định dạng' },
          { type: 'paragraph', content: 'Bạn có thể yêu cầu một ví dụ, bảng so sánh, năm câu quiz hay phản hồi theo tiêu chí. Chỉ chỉ định định dạng khi nó giúp học dễ hơn. Đừng thêm bảng hay bullet chỉ để câu trả lời trông chuyên nghiệp.' },
        ],
      },
      {
        heading: 'Giải phẫu một prompt học tập',
        blocks: [
          {
            type: 'prompt',
            title: 'Prompt về ý nghĩa đạo hàm',
            content: 'Mình là học sinh lớp 11 đang học đạo hàm. Mình nhớ các công thức cơ bản nhưng chưa hiểu vì sao đạo hàm liên quan đến độ dốc của tiếp tuyến. Hãy giải thích bằng một hình dung trực quan, sau đó đưa một ví dụ đơn giản. Cuối cùng hãy hỏi mình ba câu từ dễ đến khó. Đừng đưa đáp án cho đến khi mình thử trả lời.',
            explanation: 'Mục tiêu là hiểu ý nghĩa; bối cảnh là lớp 11 và đã nhớ công thức; nhiệm vụ là giải thích, cho ví dụ và hỏi; ràng buộc là chưa đưa đáp án; định dạng là ba câu từ dễ đến khó.',
          },
          { type: 'paragraph', content: 'Không phải prompt nào cũng cần đủ năm phần bằng năm câu riêng. Khi bối cảnh đã có trong cuộc trò chuyện, bạn chỉ cần bổ sung nhiệm vụ mới. Khi câu hỏi rất đơn giản, một câu ngắn có thể đủ. Khung này là danh sách kiểm tra, không phải khuôn bắt buộc.' },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Đúng thông tin quan trọng hơn nhiều thông tin',
            content: 'Nếu xóa một chi tiết mà AI vẫn hiểu đúng nhiệm vụ, chi tiết đó có thể không cần. Prompt rõ thường gọn hơn sau khi biên tập.',
          },
        ],
      },
      {
        heading: 'Follow-up là một nửa của kỹ năng giao tiếp',
        blocks: [
          { type: 'paragraph', content: 'Prompt đầu tiên hiếm khi tạo đúng trải nghiệm từ đầu đến cuối. Cuộc trò chuyện tốt giống một buổi học: bạn phản hồi phần chưa hiểu, yêu cầu đổi ví dụ, giảm hoặc tăng độ khó, dừng AI ở chỗ nó đi quá xa.' },
          {
            type: 'list',
            items: [
              'Mình vẫn chưa hiểu đoạn này. Hãy giải thích theo một hình dung khác.',
              'Ví dụ trên hơi khó. Cho mình một trường hợp đơn giản hơn nhưng giữ nguyên ý chính.',
              'Đừng giải tiếp. Chỉ cho mình biết bước vừa rồi sai ở đâu.',
              'Mình đã trả lời được phần cơ bản. Hãy tăng độ khó một chút.',
              'Hãy hỏi lại để kiểm tra xem mình hiểu thật hay chỉ đang lặp câu của bạn.',
            ],
          },
          { type: 'paragraph', content: 'Follow-up tốt cho AI dữ liệu về cách bạn đang học. Nó cũng giúp bạn quan sát chính mình: phần nào quá nhanh, kiểu ví dụ nào dễ hiểu và lúc nào bạn cần dừng để tự thử.' },
        ],
      },
      {
        heading: 'Cho ví dụ và chia nhỏ nhiệm vụ',
        blocks: [
          { type: 'paragraph', content: 'Nếu muốn AI tạo câu hỏi giống định dạng giáo viên, hãy đưa một hoặc hai mẫu rồi chỉ rõ đặc điểm cần giữ. Đừng đưa tài liệu riêng tư hoặc đề thi chưa được phép chia sẻ. Mẫu giúp AI hiểu hình thức; bạn vẫn phải kiểm tra nội dung.' },
          {
            type: 'comparison',
            before: 'Dạy mình toàn bộ chương Dao động cơ.',
            after: 'Trước tiên hãy hỏi năm câu ngắn để xác định phần mình đang yếu trong Dao động cơ. Dựa trên câu trả lời, chọn một khái niệm nền để học trước. Chưa chuyển sang bài tổng hợp cho đến khi mình tự giải thích lại được.',
            explanation: 'Một nhiệm vụ lớn dễ tạo bài giảng dài. Chia thành chẩn đoán, học khái niệm, luyện cơ bản và luyện tổng hợp giúp bạn nhận phản hồi theo từng bước.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Kiểm tra kiến thức hiện tại bằng vài câu ngắn.',
              'Chọn một lỗ hổng có ảnh hưởng lớn nhất.',
              'Học khái niệm bằng giải thích và ví dụ.',
              'Tự làm một bài cơ bản, chỉ xin gợi ý khi mắc.',
              'Cuối cùng mới thử bài tổng hợp và nhìn lại lỗi.',
            ],
          },
        ],
      },
      {
        heading: 'Thử nâng cấp một prompt mơ hồ',
        blocks: [
          {
            type: 'callout',
            tone: 'try',
            title: 'Bài tập ba phút',
            content: 'Bắt đầu với câu “Giúp mình học tiếng Anh”. Viết lại bằng năm phần: mục tiêu cụ thể, trình độ và tình huống, việc AI cần làm trong lượt này, điều AI không nên làm, cùng cách phản hồi bạn muốn nhận.',
          },
          {
            type: 'prompt',
            title: 'Một phiên bản tham khảo',
            content: 'Mục tiêu của mình là nói tự nhiên hơn khi giới thiệu dự án ở mức B1. Hãy đóng vai bạn cùng lớp và hỏi từng câu về dự án trong năm phút. Sau mỗi câu trả lời, chỉ sửa tối đa hai lỗi ảnh hưởng nhiều nhất đến việc hiểu. Đừng viết sẵn toàn bộ câu trả lời; hãy cho mình cơ hội tự nói lại.',
            explanation: 'Bạn có thể đổi trình độ, tình huống, thời lượng và mức sửa lỗi. Điều đáng giữ là mục tiêu rõ và phản hồi không làm gián đoạn việc luyện nói.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Đừng biến framework thành nghi thức',
            content: 'Nếu một prompt ngắn đã đủ rõ, hãy dùng nó. Mục tiêu là giao tiếp tốt và học tốt, không phải chứng minh bạn biết viết prompt dài.',
          },
        ],
      },
    ],
    takeaways: [
      'Prompt là thông tin và yêu cầu bạn đưa cho AI; prompt tốt không nhất thiết dài.',
      'Năm thành phần là mục tiêu, bối cảnh, nhiệm vụ, ràng buộc và định dạng.',
      'Ràng buộc có thể ngăn AI làm thay phần bạn cần tự luyện.',
      'Follow-up và việc chia nhỏ nhiệm vụ quan trọng không kém prompt đầu tiên.',
    ],
    selfCheck: [
      'Hãy giải thích vì sao prompt dài hơn chưa chắc tốt hơn.',
      'Trong prompt học tiếng Anh ở trên, đâu là mục tiêu và đâu là ràng buộc?',
      'Viết một follow-up bạn có thể dùng khi ví dụ của AI quá khó.',
    ],
    transition: 'Biết giao tiếp rõ mới là bước đầu. Bài 04 sẽ dùng kỹ năng đó để biến AI từ máy trả lời thành người hướng dẫn quá trình học.',
  },
  {
    number: 4,
    stage: 2,
    slug: 'tu-duy-hoc-tap-cung-ai',
    legacySlugs: ['dung-ai-de-hoc-khong-chep-bai'],
    title: 'Tư duy học tập cùng AI: Biến AI thành người hướng dẫn',
    tag: 'Phương pháp',
    readTime: '12 phút',
    cardDescription: 'Sử dụng Socratic questioning, gợi ý từng bước, Feynman và Active Recall để AI giúp bạn suy nghĩ thay vì học thay bạn.',
    goal: 'Thiết kế cuộc trò chuyện buộc bạn tham gia, mắc lỗi, nhận gợi ý và tự làm lại.',
    intro:
      'AI có thể giải một bài tập trong vài giây. Nhưng mục tiêu của việc học không phải chỉ nhìn thấy lời giải; đó là xây khả năng tự tìm ra lời giải. Khác biệt nằm ở cách cuộc trò chuyện được tổ chức: AI trả lời rồi kết thúc, hay AI giúp bạn thử, sửa và hiểu?',
    objectives: [
      'Phân biệt mô hình máy trả lời và bạn học đồng hành.',
      'Dùng câu hỏi Socratic và giàn giáo để điều chỉnh mức hỗ trợ.',
      'Thực hành Feynman, Active Recall và học từ lỗi với AI.',
      'Thiết lập quy tắc “hướng dẫn mình, đừng giải thay mình”.',
    ],
    icon: NotebookPen,
    accent: 'blue',
    sections: [
      {
        heading: 'Hai cuộc trò chuyện, hai kết quả khác nhau',
        blocks: [
          {
            type: 'comparison',
            beforeLabel: 'AI như máy trả lời',
            before: 'Bạn hỏi → AI trả lời hoàn chỉnh → bạn đọc → kết thúc.',
            afterLabel: 'AI như người hướng dẫn',
            after: 'Bạn thử → AI hỏi → bạn suy nghĩ → AI gợi ý → bạn sửa → AI kiểm tra → bạn tự làm lại.',
            explanation: 'Mô hình thứ hai chậm hơn vài phút nhưng tạo dấu vết suy nghĩ. Chính các lần dự đoán, sai và sửa mới giúp kiến thức trở thành năng lực.',
          },
          {
            type: 'paragraph',
            content: 'Trước khi hỏi, hãy để lại một dấu vết: “Mình nghĩ bước đầu là…”, “Mình đã thử…” hoặc “Mình mắc từ đoạn…”. Bạn không cần đúng. Phần thử ban đầu giúp AI phản hồi vào cách bạn đang nghĩ thay vì tạo một lời giải xa lạ.',
          },
          {
            type: 'paragraph',
            content: 'Khi AI nhìn thấy cách bạn làm, nó có thể xác định kiến thức nền bị thiếu hoặc bước rẽ sai. Còn nếu chỉ nhìn đề, nó thường tối ưu cho việc hoàn thành bài. Bạn có quyền đổi mục tiêu của cuộc trò chuyện từ “ra đáp án” sang “luyện khả năng tự giải”.',
          },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Teach me, don’t solve for me',
            content: 'Khi mục tiêu là học, hãy yêu cầu AI hướng dẫn quá trình trước khi tạo sản phẩm cuối cùng.',
          },
        ],
      },
      {
        heading: 'Socratic: để câu hỏi dẫn đường',
        blocks: [
          {
            type: 'paragraph',
            content: 'Trong cách hỏi Socratic, AI không vội kết luận. Nó đặt câu hỏi để bạn làm rõ giả định, nhớ lại kiến thức nền, thử một hướng và tự phát hiện mâu thuẫn. Cách này phù hợp với Toán, Vật lý, lập luận và những khái niệm bạn tưởng đã hiểu nhưng khó giải thích.',
          },
          {
            type: 'prompt',
            title: 'Yêu cầu đối thoại Socratic',
            content: 'Đừng giải bài này ngay. Hãy đóng vai gia sư và đặt từng câu hỏi để mình tự tìm hướng giải. Mỗi lượt chỉ hỏi một câu. Nếu mình sai, hãy hỏi để mình nhận ra điểm chưa hợp lý trước khi đưa gợi ý.',
          },
          {
            type: 'paragraph',
            content: 'Câu hỏi tốt thường bắt đầu từ dữ kiện hoặc điều bạn đã nói, không phải một chuỗi câu chung chung như “Bạn hiểu chưa?”. Bạn có thể yêu cầu AI kiểm tra bằng ví dụ, phản ví dụ hoặc câu “nếu thay đổi điều kiện này thì sao?”.',
          },
          {
            type: 'paragraph',
            content: 'Đối thoại Socratic cũng có thể đi sai hướng nếu AI hiểu nhầm đề. Hãy đối chiếu điều kiện, yêu cầu giải thích khi một câu hỏi có vẻ không liên quan và dừng cuộc trò chuyện nếu nó kéo bạn xa mục tiêu.',
          },
        ],
      },
      {
        heading: 'Scaffolding: tăng hỗ trợ từng nấc',
        blocks: [
          {
            type: 'paragraph',
            content: 'Giàn giáo hỗ trợ người xây nhưng không phải căn nhà. Gợi ý của AI cũng vậy: nó chỉ nên đủ để bạn thực hiện bước kế tiếp. Nếu AI đưa quá nhiều, bạn có thể thấy lời giải mà chưa từng tự ra quyết định.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Đặt một câu hỏi để bạn nhớ lại kiến thức liên quan.',
              'Đưa gợi ý nhỏ về hướng, chưa nêu công thức.',
              'Thu hẹp gợi ý bằng cách chỉ ra dữ kiện quan trọng.',
              'Nhắc công thức hoặc nguyên tắc cần dùng.',
              'Giải thích riêng bước đang mắc.',
              'Chỉ xem lời giải đầy đủ sau khi các mức trước không đủ, rồi tự làm lại không nhìn.',
            ],
          },
          {
            type: 'prompt',
            title: 'Thiết lập thang gợi ý',
            content: 'Khi mình mắc, hãy hỗ trợ theo từng nấc: câu hỏi → gợi ý nhỏ → dữ kiện quan trọng → công thức → giải thích bước. Mỗi lần chỉ tăng một nấc và chờ mình thử trước khi tiếp tục.',
          },
          {
            type: 'paragraph',
            content: 'Bạn có thể tự xin mức phù hợp. Nếu chỉ cần nhắc công thức, đừng xem lời giải. Nếu đã thử lâu nhưng vẫn không biết vì sao một bước đúng, hãy xin giải thích riêng bước đó rồi đóng câu trả lời và làm lại từ đầu.',
          },
        ],
      },
      {
        heading: 'Feynman: giải thích để lộ phần chưa hiểu',
        blocks: [
          {
            type: 'paragraph',
            content: 'Đọc một lời giải tạo cảm giác quen. Tự giải thích buộc bạn nối các ý bằng ngôn ngữ của mình. Chỗ bạn phải dùng từ mơ hồ như “nó tự nhiên vậy” thường là nơi kiến thức chưa chắc.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Học một khái niệm từ sách hoặc bài giảng.',
              'Đóng nguồn và giải thích bằng lời của bạn.',
              'Gửi phần giải thích cho AI, kèm nguồn nếu có.',
              'Yêu cầu AI chỉ đúng chỗ thiếu hoặc chưa chính xác, không viết lại toàn bộ.',
              'Sửa rồi giải thích lần nữa bằng cách ngắn và rõ hơn.',
            ],
          },
          {
            type: 'prompt',
            title: 'AI làm người nghe khó tính',
            content: 'Mình sẽ giải thích khái niệm này bằng lời của mình. Đừng viết lại thay mình. Hãy chỉ ra phần nào chưa chính xác, phần nào còn mơ hồ và đặt câu hỏi để mình tự sửa. Nếu nguồn mình gửi không đủ để kết luận, hãy nói rõ.',
          },
          {
            type: 'paragraph',
            content: 'Sau khi sửa, hãy thử giải thích cho một người chưa học bài. Nếu bạn phải quay lại dùng nguyên câu của AI, hãy dừng và chuyển nó thành cách nói của mình. Mục tiêu không phải bản giải thích bóng bẩy mà là chuỗi ý bạn hiểu và bảo vệ được.',
          },
        ],
      },
      {
        heading: 'Active Recall và học từ lỗi',
        blocks: [
          {
            type: 'paragraph',
            content: 'Active Recall là cố lấy thông tin từ trí nhớ ra thay vì tiếp tục nhìn vào nó. AI rất hợp vai người hỏi: có thể hỏi từng câu, thay đổi cách hỏi và chờ bạn trả lời. Điều quan trọng là không để AI hiện đáp án quá sớm.',
          },
          {
            type: 'comparison',
            before: 'Tóm tắt chương này cho mình đọc.',
            after: 'Hãy kiểm tra mình 10 câu về chương này, từng câu một. Chỉ giải thích sau khi mình trả lời và ghi lại khái niệm nào mình thường nhầm.',
          },
          {
            type: 'paragraph',
            content: 'Khi sai, đừng yêu cầu xóa toàn bộ cách làm và thay bằng lời giải của AI. Lỗi đầu tiên thường kéo theo các lỗi sau. Tìm đúng điểm rẽ sai giúp bạn hiểu nguyên nhân: thiếu kiến thức nền, đọc nhầm đề, chọn công thức sai hay tính toán vội.',
          },
          {
            type: 'prompt',
            title: 'Học từ lỗi đầu tiên',
            content: 'Đây là lời giải của mình. Hãy xác định bước đầu tiên mình làm sai. Đừng sửa toàn bộ bài. Hãy hỏi mình vì sao bước đó chưa hợp lý, rồi chỉ cho một gợi ý để mình tự sửa các bước sau.',
          },
        ],
      },
      {
        heading: 'Thiết kế một phiên học không bị AI chiếm tay lái',
        blocks: [
          {
            type: 'list',
            ordered: true,
            items: [
              'Tự thử trong một khoảng ngắn và ghi lại cách nghĩ.',
              'Nêu đúng điểm mắc thay vì giao cả bài.',
              'Yêu cầu mức hỗ trợ thấp nhất có thể giúp bạn đi tiếp.',
              'Sau khi hiểu, đóng câu trả lời và làm một bài tương tự.',
              'Kết thúc bằng việc tự giải thích điều vừa học và ghi lại lỗi cần ôn.',
            ],
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Thử ngay với một bài đang bí',
            content: 'Viết cách bạn đang nghĩ, khoanh đúng chỗ bị mắc và yêu cầu duy nhất một gợi ý. Nếu gợi ý chưa đủ, mới tăng một nấc. Sau cùng, tự làm lại từ đầu mà không nhìn cuộc trò chuyện.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Cảm giác hiểu chưa phải bằng chứng',
            content: 'Nếu bạn chỉ gật đầu khi đọc lời giải, hãy làm “AI off check”: đóng AI và giải thích hoặc thực hiện một nhiệm vụ tương tự.',
          },
        ],
      },
    ],
    takeaways: [
      'Hãy tự thử và để lại dấu vết suy nghĩ trước khi hỏi AI.',
      'Socratic và giàn giáo giúp AI hỗ trợ đúng mức thay vì giải thay.',
      'Feynman, Active Recall và phân tích lỗi buộc bạn tạo lại kiến thức bằng chính mình.',
      'Sau mỗi cuộc trò chuyện phải có một việc bạn tự làm khi AI đã đóng.',
    ],
    selfCheck: [
      'Giàn giáo khác lời giải hoàn chỉnh ở điểm nào?',
      'Khi một lời giải sai ở nhiều bước, vì sao nên tìm lỗi đầu tiên?',
      'Hãy viết một quy tắc bạn muốn AI tuân theo trong buổi học tới.',
    ],
    transition: 'Khi AI đã trở thành người hướng dẫn, bạn vẫn cần một kỹ năng phòng vệ: không tin chỉ vì câu trả lời nghe thuyết phục. Đó là bài 05.',
  },
  {
    number: 5,
    stage: 2,
    slug: 'dung-tin-ai-chi-vi-thuyet-phuc',
    legacySlugs: ['kiem-chung-thong-tin-ai'],
    title: 'Đừng tin AI chỉ vì nó trả lời rất thuyết phục',
    tag: 'Kiểm chứng',
    readTime: '11 phút',
    cardDescription: 'Nhận diện lỗi và hallucination, phân biệt dữ kiện với suy luận và xây dựng thói quen kiểm chứng trước khi sử dụng thông tin.',
    goal: 'Dùng quy trình STOP – TRACE – CHECK để xác định phần nào có thể dùng, phần nào phải lần về nguồn và kiểm tra.',
    intro:
      'Một trong những điều nguy hiểm nhất ở AI không phải lúc nó nói “Mình không biết”, mà là lúc nó nói sai bằng một giọng rất tự tin. Câu văn mượt, bảng biểu gọn và trích dẫn trông học thuật có thể khiến bạn hạ cảnh giác. Bài này xây một thói quen ngắn để giữ lại quyền quyết định.',
    objectives: [
      'Nhận diện các dạng lỗi AI thường tạo ra.',
      'Phân biệt fact, inference, opinion và prediction.',
      'Áp dụng STOP – TRACE – CHECK cho câu trả lời học tập.',
      'Kiểm chứng khác nhau với môn tính toán và môn dùng dữ kiện, lập luận.',
    ],
    icon: SearchCheck,
    accent: 'orange',
    sections: [
      {
        heading: 'Vì sao câu trả lời sai vẫn nghe hợp lý?',
        blocks: [
          {
            type: 'paragraph',
            content: 'AI tạo phản hồi phù hợp với yêu cầu và ngữ cảnh, nên nó thường ưu tiên một câu trả lời hoàn chỉnh. Khi dữ liệu không đủ hoặc câu hỏi mơ hồ, hệ thống có thể lấp chỗ trống bằng điều nghe hợp lý. Khả năng viết tự tin không biến phần lấp chỗ trống thành sự thật.',
          },
          { type: 'quote', content: 'AI là công cụ hỗ trợ tạo và xử lý thông tin, không phải cơ quan xác nhận sự thật.' },
          {
            type: 'paragraph',
            content: 'Hallucination thường được dùng để chỉ đầu ra bịa đặt hoặc không bám vào thực tế. Nhưng lỗi không chỉ là bịa nguồn. AI còn có thể dùng dữ kiện đúng để đi tới kết luận sai, bỏ điều kiện của bài hoặc trả lời một câu hỏi hơi khác điều bạn thật sự muốn.',
          },
          {
            type: 'paragraph',
            content: 'Một nguyên nhân khác là bạn đã đưa bối cảnh thiếu hoặc sai. Kiểm chứng không chỉ nhằm “bắt lỗi AI”; nó còn giúp bạn xem lại đề, nguồn và cách đặt câu hỏi của chính mình.',
          },
        ],
      },
      {
        heading: 'Sáu dạng lỗi đáng để bật cảnh giác',
        blocks: [
          {
            type: 'list',
            items: [
              'Dữ kiện sai: nhầm ngày tháng, con số, tên người, khái niệm hoặc sự kiện.',
              'Nguồn không tồn tại: tạo tên sách, bài báo, tác giả hoặc đường dẫn trông có vẻ thật.',
              'Lập luận sai: từng câu nghe hợp lý nhưng bước chuyển giữa chúng không được chứng minh.',
              'Tính toán sai: nhầm dấu, điều kiện, đơn vị hoặc một bước nhỏ làm sai toàn bộ kết quả.',
              'Thông tin lỗi thời: chức năng sản phẩm, luật, quy định, giá và sự kiện có thể đã thay đổi.',
              'Hiểu sai yêu cầu: giải đúng một bài khác vì prompt thiếu bối cảnh hoặc AI bỏ sót chi tiết.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Những tín hiệu cần kiểm tra kỹ hơn',
            content: 'Số liệu cực cụ thể, câu trích dẫn, tên nghiên cứu, nguồn học thuật, thông tin thời sự, pháp luật hoặc y tế đều cần lần về nguồn gốc. Đừng hỏi lại cùng AI “Bạn chắc không?” rồi xem đó là kiểm chứng.',
          },
          {
            type: 'paragraph',
            content: 'Khi hậu quả nếu sai lớn hơn, mức kiểm tra cũng phải cao hơn. Một gợi ý đổi cách diễn đạt có rủi ro thấp hơn số liệu dùng trong bài dự thi hoặc lời khuyên liên quan sức khỏe.',
          },
        ],
      },
      {
        heading: 'Phân loại trước khi kiểm tra',
        blocks: [
          { type: 'subheading', content: 'Fact – dữ kiện có thể đối chiếu' },
          { type: 'paragraph', content: 'Ví dụ: một sự kiện xảy ra vào năm nào, công thức có điều kiện gì, số liệu lấy từ báo cáo nào. Fact cần nguồn hoặc phép kiểm tra phù hợp.' },
          { type: 'subheading', content: 'Inference – suy luận từ dữ kiện' },
          { type: 'paragraph', content: 'Ví dụ: từ hai số liệu, AI kết luận một nguyên nhân. Dữ kiện có thể đúng nhưng kết luận vẫn cần xem các bước nối và giả định.' },
          { type: 'subheading', content: 'Opinion – đánh giá theo tiêu chí' },
          { type: 'paragraph', content: 'Ví dụ: một mở bài “hấp dẫn” hay một phương án “tốt hơn”. Hãy hỏi tiêu chí nào được dùng và có góc nhìn khác hay không.' },
          { type: 'subheading', content: 'Prediction – dự đoán về điều chưa xảy ra' },
          { type: 'paragraph', content: 'Dự đoán không nên được viết như sự thật. Bạn cần biết dữ liệu nền, mức bất định và các kịch bản có thể làm kết quả thay đổi.' },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Không phải phần nào cũng kiểm chứng giống nhau',
            content: 'Fact cần nguồn; inference cần kiểm tra logic; opinion cần tiêu chí; prediction cần giả định và mức bất định.',
          },
        ],
      },
      {
        heading: 'STOP – TRACE – CHECK',
        blocks: [
          { type: 'subheading', content: 'STOP – dừng trước khi copy' },
          { type: 'paragraph', content: 'Đọc cả câu trả lời và đánh dấu phần ảnh hưởng trực tiếp tới bài làm. Nếu câu trả lời quá dài, tách thành các khẳng định nhỏ thay vì chấp nhận cả khối.' },
          { type: 'subheading', content: 'TRACE – lần về nguồn và loại phát biểu' },
          { type: 'paragraph', content: 'Hỏi thông tin đến từ đâu, đây là dữ kiện hay suy luận, có thể mở tài liệu gốc hay không. AI có thể gợi ý nguồn, nhưng chính trang gốc mới là thứ bạn cần đọc.' },
          { type: 'subheading', content: 'CHECK – đối chiếu độc lập' },
          { type: 'paragraph', content: 'So với SGK, tài liệu giáo viên, nguồn chính thức, dữ liệu gốc hoặc nhiều nguồn đáng tin. Nếu thông tin quan trọng mà không tìm thấy bằng chứng, hãy để nó ở trạng thái chưa xác nhận thay vì lấp bằng niềm tin.' },
          {
            type: 'prompt',
            title: 'Dùng AI để hỗ trợ kiểm tra, không thay kiểm tra',
            content: 'Tách câu trả lời trên thành các phát biểu có thể kiểm chứng. Với mỗi phát biểu, ghi rõ đó là dữ kiện, suy luận, ý kiến hay dự đoán; nêu loại nguồn gốc mình nên tìm. Không tự tạo trích dẫn và nói rõ phần nào bạn không thể xác nhận.',
          },
        ],
      },
      {
        heading: 'Kiểm chứng theo loại môn học',
        blocks: [
          { type: 'subheading', content: 'Toán, Lý, Hóa' },
          { type: 'paragraph', content: 'Thay kết quả trở lại đề, kiểm tra điều kiện, đơn vị, dấu và trường hợp biên. Nếu có thể, giải bằng cách khác hoặc dùng công cụ tính phù hợp. Đọc lại từng bước quan trọng thay vì chỉ so đáp số cuối.' },
          { type: 'subheading', content: 'Văn, Sử, Địa và các bài nghiên cứu' },
          { type: 'paragraph', content: 'Tách dữ kiện, trích dẫn và phần phân tích. Dữ kiện cần nguồn; trích dẫn cần tìm đúng văn bản; phân tích cần xem luận điểm có dựa trên bằng chứng và có bỏ góc nhìn quan trọng không.' },
          { type: 'subheading', content: 'Tin học' },
          { type: 'paragraph', content: 'Chạy code với dữ liệu kiểm thử, đọc thông báo lỗi, xem tài liệu chính thức và thử trường hợp biên. Code chạy được một lần chưa chứng minh nó đúng với mọi đầu vào hoặc an toàn để dùng.' },
          {
            type: 'comparison',
            before: 'AI nói đáp án là 12 và khẳng định đã kiểm tra. Mình dùng luôn.',
            after: 'Mình thay 12 vào điều kiện, kiểm tra đơn vị và giải lại bằng một hướng khác. Khi hai cách khớp, mình mới dùng kết quả.',
          },
        ],
      },
      {
        heading: 'Bài tập: chọn mức kiểm chứng',
        blocks: [
          {
            type: 'callout',
            tone: 'try',
            title: 'Năm tình huống ngắn',
            content: 'Hãy xếp mức cần kiểm chứng cho: một cách diễn đạt khác của câu bạn viết; ngày xảy ra một sự kiện; lời giải phương trình ba bước; tên một nghiên cứu kèm số liệu; dự đoán xu hướng nghề nghiệp. Ghi cách bạn sẽ kiểm tra từng tình huống.',
          },
          {
            type: 'paragraph',
            content: 'Không phải nội dung nào cũng cần quy trình nặng như nhau. Hãy tăng mức kiểm tra theo hậu quả nếu sai, độ cụ thể của khẳng định và khả năng lần về nguồn. Đó là cách dùng thời gian hợp lý mà vẫn giữ độ tin cậy.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Không tìm thấy nguồn cũng là một kết quả',
            content: 'Khi chưa xác nhận được, hãy ghi “chưa kiểm chứng” hoặc bỏ thông tin. Bịa một nguồn để lấp chỗ trống làm bài trông hoàn chỉnh nhưng phá độ tin cậy của toàn bộ sản phẩm.',
          },
        ],
      },
    ],
    takeaways: [
      'Giọng văn tự tin và hình thức đẹp không chứng minh nội dung đúng.',
      'Hãy phân biệt dữ kiện, suy luận, ý kiến và dự đoán trước khi kiểm tra.',
      'STOP – TRACE – CHECK giúp dừng, lần về nguồn và đối chiếu độc lập.',
      'Cách kiểm chứng phải phù hợp với môn học và hậu quả nếu thông tin sai.',
    ],
    selfCheck: [
      'Vì sao hỏi lại cùng một AI “Bạn chắc không?” chưa phải kiểm chứng?',
      'Hãy biến một câu trả lời dài thành ba khẳng định nhỏ có thể kiểm tra.',
      'Nếu AI nêu tên một nghiên cứu bạn không tìm thấy, bạn sẽ làm gì?',
    ],
    transition: 'Sau khi biết kiểm chứng, mình có thể đi vào những tình huống sát môn học hơn. Bài 06 là một loạt case study từ Toán đến Tin học.',
  },
  {
    number: 6,
    stage: 2,
    slug: 'case-study-su-dung-ai-trong-tung-mon',
    title: 'Case Study: Sử dụng AI hiệu quả trong từng môn học',
    tag: 'Thực hành',
    readTime: '15 phút',
    cardDescription: 'Từ Toán, Văn, Anh đến Lý, Hóa và Tin học: xem AI nên hỗ trợ khác nhau như thế nào tùy theo cách tư duy của từng môn.',
    goal: 'Điều chỉnh vai trò, bối cảnh, mức gợi ý và cách kiểm chứng theo kiểu tư duy của từng môn học.',
    intro:
      'Không có một prompt dùng tốt cho mọi môn. Toán cần theo dõi bước suy luận; Văn cần giữ tiếng nói và lập luận của bạn; Tiếng Anh cần nhịp hội thoại; Lịch sử cần nguồn và quan hệ nguyên nhân. Các case dưới đây cho thấy cách đổi vai trò của AI theo nhiệm vụ.',
    objectives: [
      'Chọn cách hỗ trợ phù hợp cho các môn tính toán, ngôn ngữ, xã hội và Tin học.',
      'Nhận ra điểm AI dễ làm thay trong từng môn.',
      'Viết prompt yêu cầu gợi ý, phản biện và kiểm tra lỗi đúng chỗ.',
      'Xây một checklist kiểm chứng theo môn.',
    ],
    icon: Sparkles,
    accent: 'green',
    sections: [
      {
        heading: 'Toán: kiểm tra cách nghĩ, không chỉ đáp số',
        blocks: [
          { type: 'paragraph', content: 'Với Toán, giá trị lớn nhất của AI thường nằm ở việc quan sát từng bước: bạn chọn biến đổi nào, điều kiện có được giữ không và lỗi đầu tiên xuất hiện ở đâu. Nếu chỉ xin đáp số, bạn bỏ qua dữ liệu quan trọng nhất về cách mình đang tư duy.' },
          {
            type: 'comparison',
            before: 'Giải bài này.',
            after: 'Đây là lời giải mình làm tới bước 3. Mình nghi phép biến đổi ở bước này sai. Hãy kiểm tra đúng bước này trước, chỉ cho một gợi ý và chưa giải phần còn lại.',
          },
          {
            type: 'prompt',
            title: 'Tạo bài tương tự để tự làm',
            content: 'Dựa trên dạng bài mình vừa gửi, hãy tạo một bài tương tự nhưng đổi số và giữ mức khó. Không đưa lời giải. Sau khi mình nộp cách làm, hãy kiểm tra điều kiện, bước biến đổi và lỗi đầu tiên.',
          },
          { type: 'paragraph', content: 'Khi kiểm chứng, thay kết quả vào bài, xem miền xác định và thử phương pháp khác nếu có. Một lời giải dài không tự động tốt hơn; hãy ưu tiên chuỗi bước bạn có thể tự giải thích.' },
        ],
      },
      {
        heading: 'Vật lý và Hóa học: hiểu mô hình trước khi thế số',
        blocks: [
          { type: 'subheading', content: 'Vật lý: bắt đầu từ hiện tượng' },
          { type: 'paragraph', content: 'Nếu nhảy thẳng vào công thức, bạn dễ chọn phương trình có ký hiệu giống đề nhưng không đúng mô hình. Hãy yêu cầu AI giúp xác định vật thể đang xét, hiện tượng, đại lượng đã biết, đại lượng cần tìm, hướng dương và giả định trước.' },
          {
            type: 'prompt',
            title: 'Phân tích bài Vật lý trước khi tính',
            content: 'Trước khi tính toán, hãy hỏi mình để xác định hiện tượng vật lý, vật thể đang xét, các lực hoặc quá trình liên quan, đại lượng đã biết và đại lượng cần tìm. Chưa đưa công thức cho đến khi mình mô tả được mô hình.',
          },
          { type: 'subheading', content: 'Hóa học: theo dõi chất, tỉ lệ và điều kiện' },
          { type: 'paragraph', content: 'AI có thể hỗ trợ cân bằng, tính mol, nhận diện dạng, chuỗi phản ứng và kiểm tra đơn vị. Bạn cần tự kiểm tra chất tham gia, điều kiện phản ứng, bảo toàn và tỉ lệ. Với cơ chế vượt chương trình, hãy yêu cầu mức giải thích phù hợp thay vì nhận một đoạn học thuật khó dùng.' },
          {
            type: 'prompt',
            title: 'Kiểm tra lời giải Hóa theo bước',
            content: 'Đây là cách mình đổi dữ kiện sang số mol và lập tỉ lệ. Hãy tìm bước đầu tiên chưa đúng, kiểm tra đơn vị và điều kiện phản ứng. Chỉ nêu một câu hỏi gợi ý để mình tự sửa trước.',
          },
        ],
      },
      {
        heading: 'Ngữ văn: dùng AI làm người phản biện, không làm người viết hộ',
        blocks: [
          { type: 'paragraph', content: 'Một bài Văn có năng lực của bạn khi luận điểm, lựa chọn dẫn chứng và giọng diễn đạt phản ánh điều bạn thật sự nghĩ. Nếu AI viết trọn bài, bạn có một sản phẩm nhưng mất cơ hội luyện đọc, lập luận và viết.' },
          {
            type: 'comparison',
            before: 'Viết bài nghị luận 800 chữ về chủ đề này.',
            after: 'Đây là luận điểm và outline của mình. Hãy đóng vai người phản biện, chỉ ra ba điểm còn yếu hoặc thiếu bằng chứng. Không viết lại đoạn văn; hãy đặt câu hỏi để mình tự phát triển.',
          },
          {
            type: 'list',
            items: [
              'Brainstorm nhiều hướng rồi tự chọn theo trải nghiệm và yêu cầu đề.',
              'Kiểm tra outline có lặp ý, nhảy logic hoặc thiếu phản đề.',
              'Đóng vai người đọc để chỉ chỗ khó hiểu, chưa đủ dẫn chứng.',
              'Gợi ý cách rút một câu dài, nhưng để bạn quyết định giọng cuối cùng.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Dẫn chứng do AI nêu phải được tìm lại',
            content: 'Đừng dùng câu trích dẫn, chi tiết tác phẩm hoặc nhận định phê bình nếu bạn chưa xác nhận trong văn bản và nguồn đáng tin.',
          },
        ],
      },
      {
        heading: 'Tiếng Anh: giữ nhịp giao tiếp và phản hồi vừa đủ',
        blocks: [
          { type: 'paragraph', content: 'AI có thể làm speaking partner, người phỏng vấn, giám khảo thử, vocabulary coach hoặc grammar coach. Sai lầm thường gặp là yêu cầu sửa mọi lỗi sau mỗi câu, khiến cuộc hội thoại bị ngắt và bạn chuyển sang đọc phần sửa thay vì tiếp tục nói.' },
          {
            type: 'prompt',
            title: 'Luyện hội thoại ở mức B1',
            content: 'Hãy trò chuyện với mình ở mức B1 về chủ đề trường học. Mỗi lượt chỉ hỏi một câu. Sau câu trả lời của mình, chỉ sửa tối đa hai lỗi ảnh hưởng nhiều nhất đến việc hiểu và cho mình cơ hội nói lại. Cuối buổi mới tổng hợp ba lỗi lặp lại.',
          },
          { type: 'paragraph', content: 'Với viết tiếng Anh, hãy đưa bản nháp của bạn rồi yêu cầu phân loại lỗi thay vì viết lại toàn bộ. Chọn một hoặc hai nhóm để sửa mỗi lượt: thì, liên kết ý, collocation hoặc độ rõ. Sau đó tự viết lại và so sánh.' },
          {
            type: 'callout',
            tone: 'try',
            title: 'Một thay đổi nhỏ',
            content: 'Trong lần luyện tới, hãy giới hạn AI chỉ sửa hai lỗi. Quan sát xem bạn có nói được lâu và tự nhiên hơn không.',
          },
        ],
      },
      {
        heading: 'Lịch sử, Địa lý và Sinh học: quan hệ quan trọng hơn danh sách',
        blocks: [
          { type: 'subheading', content: 'Lịch sử' },
          { type: 'paragraph', content: 'Timeline hữu ích nhưng chưa đủ. Hãy nối bối cảnh, nguyên nhân, sự kiện, hệ quả và cách đánh giá. AI có thể hỏi bạn điền mắt xích còn thiếu hoặc so sánh hai giai đoạn. Ngày tháng, tên văn kiện và số liệu phải được kiểm tra từ nguồn.' },
          { type: 'subheading', content: 'Địa lý' },
          { type: 'paragraph', content: 'Dùng AI để luyện đọc bảng số liệu, giải thích quan hệ giữa điều kiện tự nhiên và kinh tế, so sánh khu vực hoặc phản biện một kết luận. Khi dữ liệu theo năm, cần kiểm tra thời điểm và nguồn trước khi phân tích.' },
          { type: 'subheading', content: 'Sinh học' },
          { type: 'paragraph', content: 'Tập trung vào cơ chế và chuỗi quá trình: yếu tố nào kích hoạt, bước nào tạo kết quả, nếu thay đổi một yếu tố thì chuyện gì xảy ra. AI có thể tạo flashcard hoặc sơ đồ nháp, nhưng bạn nên sửa card quá dài và đối chiếu thuật ngữ với tài liệu học.' },
          {
            type: 'prompt',
            title: 'Luyện quan hệ nguyên nhân',
            content: 'Hãy đưa từng mắt xích trong quá trình này dưới dạng câu hỏi “vì sao” hoặc “nếu thay đổi thì sao”. Chờ mình trả lời rồi mới phản hồi. Cuối cùng yêu cầu mình tự kể lại toàn bộ chuỗi mà không nhìn tài liệu.',
          },
        ],
      },
      {
        heading: 'Tin học: debug cách nghĩ, không thay toàn bộ chương trình',
        blocks: [
          { type: 'paragraph', content: 'Khi code lỗi, gửi đoạn tối thiểu liên quan, thông báo lỗi, đầu vào mong đợi, đầu ra thực tế và điều bạn đã thử. Nếu chỉ đưa ảnh hoặc cả dự án mà không mô tả, AI phải đoán quá nhiều.' },
          {
            type: 'prompt',
            title: 'Debug từng bước',
            content: 'Đây là đoạn code mình viết, thông báo lỗi và đầu ra mong đợi. Không viết lại chương trình từ đầu. Hãy giúp mình tạo ba giả thuyết nguyên nhân, chọn cách kiểm tra giả thuyết đầu tiên và chờ kết quả trước khi tiếp tục.',
          },
          { type: 'paragraph', content: 'Sau khi sửa, hãy giải thích nguyên nhân bằng lời của bạn và thêm một test lẽ ra đã bắt được lỗi. Kiểm tra tài liệu chính thức nếu AI gợi ý API, cú pháp hoặc phiên bản thư viện có thể đã thay đổi.' },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Prompt phải đổi theo kiểu tư duy của môn',
            content: 'Toán theo bước; Vật lý theo mô hình; Văn theo lập luận; ngoại ngữ theo tương tác; môn xã hội theo nguồn và quan hệ; code theo giả thuyết và kiểm thử.',
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Tự tạo checklist cho một môn',
            content: 'Chọn môn bạn học nhiều nhất. Viết ba việc AI nên làm, hai việc AI không nên làm thay và ba điểm bạn luôn phải kiểm chứng.',
          },
        ],
      },
    ],
    takeaways: [
      'Không có một prompt tốt cho mọi môn học.',
      'Cách dùng AI phải bám vào kiểu tư duy, dữ liệu và tiêu chí đúng của môn.',
      'Prompt hữu ích thường bắt đầu từ phần bạn đã thử và điểm mắc cụ thể.',
      'Mỗi môn cần một cách kiểm chứng và một ranh giới chống làm thay riêng.',
    ],
    selfCheck: [
      'Vì sao prompt Toán và prompt Văn không nên có cùng mục tiêu đầu ra?',
      'Khi luyện nói tiếng Anh, giới hạn số lỗi sửa mỗi lượt giúp gì?',
      'Hãy viết một prompt debug có đủ lỗi, đầu ra mong đợi và điều bạn đã thử.',
    ],
    transition: 'Các case trên thường bắt đầu từ một bài hoặc đoạn nội dung nhỏ. Bài 07 sẽ mở rộng sang cả sách, PDF và bộ tài liệu.',
  },
  {
    number: 7,
    stage: 3,
    slug: 'hoc-tu-sach-pdf-va-tai-lieu-voi-ai',
    title: 'Học từ sách, PDF và tài liệu với AI',
    tag: 'Tài liệu',
    readTime: '11 phút',
    cardDescription: 'Biến tài liệu thành một quá trình học chủ động: khám phá cấu trúc, đặt câu hỏi, kiểm tra trí nhớ và phát hiện phần chưa hiểu.',
    goal: 'Dùng workflow Nguồn → Khám phá → Hiểu → Truy hồi → Áp dụng thay vì chỉ xin bản tóm tắt.',
    intro:
      'Một PDF 80 trang không tự nhiên trở nên dễ học chỉ vì AI có thể tóm tắt nó trong 30 giây. Bản tóm tắt tạo cảm giác “mình đã xem qua”, nhưng cảm giác quen mắt không chứng minh bạn nhớ hoặc áp dụng được. Muốn học từ tài liệu, hãy biến AI thành người dẫn qua từng vòng hoạt động.',
    objectives: [
      'Chọn và sắp xếp bộ nguồn trước khi hỏi AI.',
      'Lập bản đồ tài liệu thay vì tóm tắt ngay.',
      'Kết hợp giải thích, tự nhớ, tìm lỗ hổng và áp dụng.',
      'Dùng công cụ bám theo nguồn mà vẫn kiểm chứng nội dung AI tạo.',
    ],
    icon: BookOpen,
    accent: 'blue',
    sections: [
      {
        heading: 'Workflow năm bước cho một bộ tài liệu',
        blocks: [
          { type: 'quote', content: 'Nguồn → Khám phá → Hiểu → Truy hồi → Áp dụng' },
          {
            type: 'paragraph',
            content: 'Mỗi bước trả lời một câu hỏi khác nhau. Nguồn có đáng dùng không? Tài liệu được tổ chức ra sao? Khái niệm có nghĩa gì? Bạn tự nhớ được bao nhiêu? Bạn dùng được kiến thức vào bài nào? Nếu bỏ qua ba câu cuối, bạn mới xử lý tài liệu chứ chưa chắc đã học.',
          },
          {
            type: 'paragraph',
            content: 'Workflow này dùng được cho một chương SGK, slide giáo viên, ghi chú cá nhân hoặc nhiều PDF. Quy mô thay đổi nhưng thứ tự vẫn hữu ích: biết phạm vi trước, học một phần vừa sức, đóng nguồn để tự nhớ rồi mới áp dụng.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Tóm tắt không phải điểm kết thúc',
            content: 'Một bản tóm tắt tốt có thể giúp định hướng. Sau đó bạn vẫn cần tự truy hồi, giải thích và áp dụng để tạo trí nhớ.',
          },
        ],
      },
      {
        heading: 'Bước 1: chọn nguồn tốt và giảm sự lộn xộn',
        blocks: [
          {
            type: 'paragraph',
            content: 'Bắt đầu với SGK, slide, tài liệu giáo viên, ghi chú cá nhân và tài liệu tham khảo rõ nguồn. Đừng ném 50 file lộn xộn rồi mong AI tự biết file nào chính, file nào cũ hoặc hai nguồn đang mâu thuẫn.',
          },
          {
            type: 'list',
            items: [
              'Đặt tên file để nhận ra môn, chương và phiên bản.',
              'Loại bản trùng hoặc tài liệu bạn không có quyền sử dụng.',
              'Ghi chú nguồn nào là tài liệu chính và nguồn nào chỉ tham khảo.',
              'Nếu hai nguồn khác nhau, giữ sự khác biệt để kiểm tra thay vì trộn chúng.',
              'Chỉ đưa phần liên quan nếu tài liệu có dữ liệu cá nhân hoặc nội dung không cần cho nhiệm vụ.',
            ],
          },
          {
            type: 'paragraph',
            content: 'Chất lượng nguồn quyết định giới hạn của câu trả lời. Một công cụ bám rất sát tài liệu cũ vẫn cho kiến thức cũ. Trước khi học, hãy biết nguồn do ai tạo, cho chương trình nào và có còn phù hợp với mục tiêu hiện tại không.',
          },
        ],
      },
      {
        heading: 'Bước 2: lập bản đồ trước khi đi vào chi tiết',
        blocks: [
          {
            type: 'paragraph',
            content: 'Bản đồ tài liệu giúp bạn thấy các phần, khái niệm nền, mối quan hệ và thứ tự hợp lý. Nó khác bản tóm tắt: bản đồ không cố nén mọi nội dung, mà giúp bạn quyết định học phần nào trước và câu hỏi nào đáng đặt.',
          },
          {
            type: 'prompt',
            title: 'Lập bản đồ tài liệu',
            content: 'Chưa tóm tắt chi tiết. Dựa trên các nguồn mình chọn, hãy cho biết tài liệu gồm những phần nào, mối quan hệ giữa chúng, năm khái niệm nền cần hiểu trước và phần nào có vẻ trùng hoặc mâu thuẫn. Luôn chỉ rõ nguồn cho từng nhận xét.',
          },
          {
            type: 'paragraph',
            content: 'Sau khi nhận bản đồ, hãy mở mục lục và đoạn gốc để kiểm tra. Bạn có thể sửa thứ tự nếu AI coi một ví dụ phụ là khái niệm chính hoặc bỏ sót phần giáo viên nhấn mạnh. Bản đồ là kế hoạch đọc, không phải chân lý về tài liệu.',
          },
        ],
      },
      {
        heading: 'Bước 3: học từng phần và giữ đường về nguồn',
        blocks: [
          {
            type: 'paragraph',
            content: 'Chọn một phần vừa sức thay vì hỏi toàn bộ chương. Yêu cầu AI giải thích dựa trên nguồn, chỉ rõ đoạn liên quan và nói khi nguồn không đủ. Sau đó quay lại đọc đoạn gốc; AI là lớp hỗ trợ diễn giải, không thay thế văn bản học.',
          },
          {
            type: 'prompt',
            title: 'Học một phần theo nguồn',
            content: 'Hãy giải thích khái niệm [tên] chỉ dựa trên các nguồn mình đã chọn. Trước tiên nêu ý chính bằng ngôn ngữ lớp 11, sau đó chỉ ra đoạn nguồn liên quan và một ví dụ. Nếu nguồn không đủ hoặc có mâu thuẫn, hãy nói rõ thay vì tự điền.',
          },
          {
            type: 'paragraph',
            content: 'Nếu lời giải thích quá trơn tru, hãy yêu cầu một phản ví dụ, điều kiện áp dụng hoặc câu hỏi “nếu thay đổi yếu tố này thì sao?”. Những câu đó giúp bạn thấy ranh giới của khái niệm, không chỉ thuộc một định nghĩa.',
          },
          {
            type: 'comparison',
            before: 'Tóm tắt toàn bộ 80 trang cho mình.',
            after: 'Lập bản đồ 80 trang, chọn một phần nền, giải thích theo nguồn rồi yêu cầu mình tự kể lại trước khi sang phần tiếp.',
          },
        ],
      },
      {
        heading: 'Bước 4: đóng tài liệu và lấy kiến thức từ trí nhớ',
        blocks: [
          {
            type: 'paragraph',
            content: 'Sau khi đọc một phần, tạm đóng nguồn. Hãy kể lại ý chính, vẽ sơ đồ từ trí nhớ hoặc trả lời câu hỏi. Nếu cứ nhìn bản tóm tắt, bạn đang nhận diện thông tin chứ chưa luyện khả năng tự gọi lại nó.',
          },
          {
            type: 'prompt',
            title: 'Kiểm tra truy hồi từng câu',
            content: 'Hãy kiểm tra mình về phần vừa học bằng từng câu một. Bắt đầu bằng ý nền, sau đó hỏi quan hệ giữa các ý và một tình huống áp dụng. Chờ mình trả lời, ghi lại chỗ lẫn và chỉ mở lại đoạn nguồn cần thiết sau mỗi lỗi.',
          },
          {
            type: 'paragraph',
            content: 'Đừng để AI chấm câu trả lời chỉ theo độ giống với câu nó vừa viết. Yêu cầu nó so với nguồn, chấp nhận cách diễn đạt khác nếu đúng ý và chỉ rõ phần thiếu. Sau đó chính bạn cũng mở nguồn để xác nhận phản hồi.',
          },
        ],
      },
      {
        heading: 'Bước 5: tìm lỗ hổng rồi áp dụng',
        blocks: [
          {
            type: 'paragraph',
            content: 'Sau vòng câu hỏi, nhóm kết quả thành phần nhớ tốt, phần hay lẫn và phần chưa hiểu. Từ đó chọn hành động: đọc lại một đoạn, xin cách giải thích khác, làm flashcard một ý hoặc giải bài áp dụng.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Tự giải thích khái niệm mà không nhìn nguồn.',
              'So sánh với nguồn và đánh dấu phần thiếu.',
              'Làm một câu hỏi áp dụng hoặc tạo ví dụ của riêng bạn.',
              'Nhờ AI phản biện ví dụ, chưa sửa thay ngay.',
              'Ghi lại một lỗ hổng để ôn ở buổi sau.',
            ],
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Thử với 10 trang, không cần 80 trang',
            content: 'Chọn một phần ngắn của tài liệu. Lập bản đồ, học một khái niệm, đóng nguồn, trả lời ba câu và làm một ví dụ. Quan sát phần nào của workflow tạo nhiều nỗ lực nhất; đó thường là phần đang giúp bạn học.',
          },
        ],
      },
      {
        heading: 'Công cụ hiện nay: NotebookLM như một ví dụ bám theo nguồn',
        blocks: [
          {
            type: 'paragraph',
            content: 'NotebookLM cho phép tạo notebook, thêm các nguồn được hỗ trợ rồi trò chuyện và tạo dạng nội dung học từ chúng. Bạn có thể gặp study guide, flashcard, quiz, mind map hoặc overview tùy giao diện và thời điểm. Điểm giáo dục quan trọng là bạn chọn phạm vi nguồn và có thể lần lại trích dẫn.',
          },
          {
            type: 'paragraph',
            content: 'Đừng hiểu “bám theo nguồn” thành “không thể sai”. AI vẫn có thể diễn giải thiếu, ghép hai ý chưa hợp lý hoặc tạo công cụ học có lỗi. Bản thân nguồn cũng có thể cũ hoặc không đáng tin. Hãy mở trích dẫn, đọc ngữ cảnh và sửa flashcard hay quiz trước khi ôn.',
          },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Chuỗi tốt hơn một lệnh tóm tắt',
            content: 'Lập bản đồ → học một phần → tự giải thích → quiz → xem lỗi → quay lại đúng đoạn nguồn. Công cụ chỉ giúp chuỗi này thuận tiện hơn.',
          },
        ],
      },
    ],
    takeaways: [
      'Tóm tắt giúp định hướng nhưng không thay thế truy hồi và áp dụng.',
      'Bộ nguồn cần được chọn, sắp xếp và phân vai trước khi đưa cho AI.',
      'Mỗi câu trả lời quan trọng phải có đường quay lại tài liệu gốc.',
      'Công cụ bám theo nguồn vẫn cần kiểm chứng cả đầu ra lẫn chất lượng nguồn.',
    ],
    selfCheck: [
      'Vì sao đọc bản tóm tắt nhiều lần có thể tạo ảo giác đã học?',
      'Hãy nêu năm bước của workflow học từ tài liệu.',
      'Nếu hai PDF mâu thuẫn, bạn nên yêu cầu AI làm gì thay vì tự trộn?',
    ],
    transition: 'Khi đã biết biến tài liệu thành câu hỏi, bước tiếp theo là luyện trí nhớ và ôn thi dựa trên lỗi thật. Đó là bài 08.',
  },
  {
    number: 8,
    stage: 3,
    slug: 'dung-ai-luyen-tap-ghi-nho-on-thi',
    legacySlugs: ['khong-phu-thuoc-ai'],
    title: 'Dùng AI để luyện tập, ghi nhớ và ôn thi',
    tag: 'Ôn tập',
    readTime: '12 phút',
    cardDescription: 'Tạo quiz, luyện Active Recall, phân tích lỗi sai và xây dựng quá trình ôn tập dựa trên những phần bạn thực sự chưa vững.',
    goal: 'Dùng AI làm người hỏi, điều chỉnh độ khó và tổ chức lỗi để việc ôn bám vào bằng chứng thay vì cảm giác.',
    intro:
      'Đọc lại năm lần có thể khiến một kiến thức trở nên quen mắt. Nhưng quen mắt không đồng nghĩa với nhớ được. Đến lúc làm bài, bạn cần lấy kiến thức từ trí nhớ, chọn cách dùng và nhận ra lỗi. AI phù hợp để tạo vòng luyện đó nếu bạn không để nó hiện đáp án quá sớm.',
    objectives: [
      'Thiết kế quiz hỏi từng câu và chờ phản hồi.',
      'Điều chỉnh độ khó dựa trên câu trả lời thực tế.',
      'Tạo error log để tìm lỗi lặp và kiến thức nền thiếu.',
      'Lập kế hoạch ôn từ mục tiêu, thời gian và dữ liệu lỗi.',
    ],
    icon: ClipboardCheck,
    accent: 'orange',
    sections: [
      {
        heading: 'Active Recall: tập lấy kiến thức ra',
        blocks: [
          { type: 'paragraph', content: 'Khi đọc lại, câu trả lời luôn ở trước mắt. Khi tự trả lời, bạn phải tìm và dựng lại nó. Nỗ lực này giúp bạn biết phần nào đã có trong trí nhớ và phần nào chỉ quen vì vừa nhìn thấy.' },
          {
            type: 'comparison',
            before: 'Tóm tắt chương này thành các ý cần nhớ.',
            after: 'Hãy kiểm tra mình 10 câu về chương này, từng câu một. Chờ mình trả lời rồi mới đánh giá và giải thích.',
          },
          {
            type: 'prompt',
            title: 'Một phiên quiz có phản hồi',
            content: 'Dựa trên nội dung mình cung cấp, hãy hỏi 10 câu từ nhớ khái niệm đến áp dụng. Mỗi lượt chỉ hỏi một câu và chưa hiện đáp án. Sau câu trả lời, đánh giá đúng, thiếu hay nhầm; yêu cầu mình sửa trước khi bạn giải thích.',
          },
          {
            type: 'paragraph',
            content: 'Khi trả lời sai, hãy cố sửa trước khi xem giải thích. Lần cố gắng thứ hai cho biết bạn có thể tự nhận ra lỗi hay chỉ cần một tín hiệu nhỏ. Đây là dữ liệu tốt để chọn mức hỗ trợ sau đó.',
          },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Đừng chỉ hỏi “Mình cần nhớ gì?”',
            content: 'Hãy yêu cầu AI kiểm tra “Mình thực sự nhớ được gì?”.',
          },
        ],
      },
      {
        heading: 'Điều chỉnh độ khó theo câu trả lời',
        blocks: [
          { type: 'paragraph', content: 'Một bộ câu quá dễ tạo điểm số đẹp nhưng ít giá trị. Quá khó khiến bạn đoán và nản. AI có thể điều chỉnh theo dữ liệu trong buổi: nếu bạn trả lời chắc, tăng mức áp dụng; nếu sai vì thiếu kiến thức nền, quay lại prerequisite thay vì tiếp tục ném câu khó.' },
          {
            type: 'prompt',
            title: 'Adaptive difficulty',
            content: 'Điều chỉnh độ khó dựa trên câu trả lời của mình. Nếu mình đúng hai câu liên tiếp và giải thích được lý do, tăng một mức. Nếu mình sai vì thiếu kiến thức nền, hãy hỏi phần nền trước. Ghi lại lý do điều chỉnh, không chỉ báo đúng hoặc sai.',
          },
          { type: 'paragraph', content: 'Bạn vẫn cần kiểm tra chất lượng câu hỏi. Một câu mơ hồ hoặc có đáp án sai sẽ làm dữ liệu luyện tập lệch. Với nội dung quan trọng, hãy bám theo nguồn đáng tin và yêu cầu chỉ ra phần nguồn dùng để tạo câu.' },
          {
            type: 'paragraph',
            content: 'Đừng để AI tăng độ khó chỉ bằng cách làm câu dài hơn. Độ khó có thể tăng bằng việc yêu cầu giải thích lý do, kết nối hai khái niệm, áp dụng vào tình huống mới hoặc phân biệt hai trường hợp dễ nhầm.',
          },
        ],
      },
      {
        heading: 'Error log: biến lỗi sai thành kế hoạch',
        blocks: [
          { type: 'paragraph', content: 'Điểm số cho biết bạn đúng bao nhiêu câu; error log cho biết vì sao sai và lần sau làm gì khác. Sau mỗi buổi, chỉ cần ghi bốn phần: lỗi, nguyên nhân, cách sửa và ngày ôn lại. Một lỗi có thể thuộc kiến thức, chiến lược, đọc đề hoặc tính toán.' },
          {
            type: 'list',
            items: [
              'Lỗi: dùng công thức cấp số cộng cho cấp số nhân.',
              'Nguyên nhân: nhận diện dạng theo từ khóa, chưa kiểm tra quan hệ giữa hai số hạng.',
              'Cách sửa: trước khi chọn công thức, viết tỉ số và hiệu của hai số hạng liên tiếp.',
              'Ôn lại: làm ba câu trộn hai dạng sau hai ngày, không xem ghi chú.',
            ],
          },
          {
            type: 'prompt',
            title: 'Phân tích lỗi sau buổi quiz',
            content: 'Dựa trên câu trả lời của mình, hãy nhóm lỗi thành: thiếu kiến thức nền, hiểu sai khái niệm, chọn chiến lược chưa phù hợp, đọc nhầm đề và lỗi tính toán. Với mỗi nhóm, nêu một việc mình nên tự luyện và một dấu hiệu để nhận ra lỗi sớm hơn.',
          },
          {
            type: 'paragraph',
            content: 'Không lưu mọi lỗi như nhau. Nếu một lỗi xuất hiện lặp lại hoặc ảnh hưởng nhiều dạng bài, hãy ưu tiên. Một lỗi bấm máy ngẫu nhiên có thể chỉ cần kiểm tra lại; một hiểu sai khái niệm cần quay về nguồn và luyện từ nền.',
          },
        ],
      },
      {
        heading: 'Flashcard: một thẻ, một ý rõ',
        blocks: [
          { type: 'paragraph', content: 'AI có thể tạo flashcard rất nhanh, nhưng thường đưa quá nhiều thông tin lên một thẻ. Nếu câu trả lời dài cả đoạn, bạn khó biết mình quên đúng ý nào. Mỗi thẻ nên kiểm tra một quan hệ, định nghĩa, điều kiện hoặc bước phân biệt.' },
          {
            type: 'comparison',
            before: 'Mặt trước: Trình bày toàn bộ quang hợp.\nMặt sau: một đoạn 180 từ.',
            after: 'Mặt trước: Pha sáng tạo ra hai sản phẩm nào được dùng ở chu trình Calvin?\nMặt sau: ATP và NADPH.',
          },
          { type: 'paragraph', content: 'Hãy xem bộ thẻ AI tạo là bản nháp. Loại thẻ trùng, sửa thuật ngữ, chia thẻ quá dài và kiểm tra đáp án với nguồn. Thẻ tốt giúp nhớ; nó không thay thế bài tập cần lập luận nhiều bước.' },
          {
            type: 'callout',
            tone: 'try',
            title: 'Sửa một bộ thẻ',
            content: 'Chọn năm flashcard AI tạo. Tách thẻ hỏi nhiều ý, xóa thông tin thừa và viết lại câu hỏi để bạn biết chính xác mình đang cố nhớ điều gì.',
          },
        ],
      },
      {
        heading: 'Mock test: mô phỏng trước, phân tích sau',
        blocks: [
          { type: 'paragraph', content: 'Một mock test có ích khi bạn làm trong điều kiện gần với bài thật: giới hạn thời gian, không nhận gợi ý giữa chừng và chỉ xem phản hồi sau khi hoàn thành. Nếu AI giúp từng câu trong lúc làm, bạn đang học có hướng dẫn chứ chưa mô phỏng kiểm tra.' },
          {
            type: 'prompt',
            title: 'Thi thử có ranh giới',
            content: 'Tạo một bài luyện 30 phút dựa trên phạm vi và dạng câu mình cung cấp. Trong lúc mình làm, không gợi ý và không báo đáp án. Sau khi mình nộp toàn bộ, hãy chấm theo tiêu chí, nhóm lỗi và chọn ba phần nên ôn tiếp. Đánh dấu câu nào bạn không đủ nguồn để chấm chắc.',
          },
          { type: 'paragraph', content: 'Đề AI tạo không thay thế đề chính thức hoặc tài liệu giáo viên. Nó phù hợp để tăng số lượt luyện và phát hiện lỗ hổng, nhưng bạn phải kiểm tra phạm vi, đáp án và độ khó trước khi xem kết quả như thước đo.' },
        ],
      },
      {
        heading: 'Kế hoạch ôn phải bắt đầu từ dữ liệu của bạn',
        blocks: [
          {
            type: 'comparison',
            before: 'Cho mình kế hoạch ôn thi 30 ngày.',
            after: 'Mình còn 30 ngày, học được 60 phút mỗi ngày, mục tiêu là bài kiểm tra Toán 11. Đây là các chương, lịch học và error log ba buổi gần nhất. Hãy ưu tiên phần yếu có ảnh hưởng lớn, xen kẽ ôn lại và để ba buổi dự phòng.',
          },
          { type: 'paragraph', content: 'Kế hoạch tốt cần phạm vi, mục tiêu, thời gian, lịch cố định, điểm yếu và bằng chứng từ bài làm. Hãy giữ lịch đủ linh hoạt: nếu dữ liệu tuần đầu cho thấy một lỗ hổng nền, kế hoạch phải được điều chỉnh.' },
          {
            type: 'list',
            items: [
              'Buổi học nội dung mới hoặc vá lỗ hổng.',
              'Buổi truy hồi không nhìn tài liệu.',
              'Buổi luyện trộn nhiều dạng để nhận diện.',
              'Buổi mock test không gợi ý.',
              'Buổi dự phòng và xem lại error log.',
            ],
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Tạo một vòng ôn 20 phút',
            content: 'Chọn một chủ đề. Làm năm câu không nhìn tài liệu, ghi error log cho lỗi, nhờ AI tạo hai câu nhắm đúng nguyên nhân và đặt ngày ôn lại. Kết thúc bằng một câu bạn tự giải thích thành tiếng.',
          },
        ],
      },
    ],
    takeaways: [
      'Active Recall đo điều bạn tự lấy được từ trí nhớ, không đo cảm giác quen.',
      'Độ khó nên thay đổi theo câu trả lời và kiến thức nền thật sự.',
      'Error log biến lỗi thành hành động ôn cụ thể.',
      'Flashcard, quiz và mock test do AI tạo đều cần kiểm tra với nguồn đáng tin.',
    ],
    selfCheck: [
      'Một flashcard tốt khác một đoạn tóm tắt ở điểm nào?',
      'Nếu bạn sai vì thiếu kiến thức nền, hệ thống quiz nên phản ứng ra sao?',
      'Hãy ghi một lỗi gần đây theo bốn phần của error log.',
    ],
    transition: 'Ôn thi tập trung vào truy hồi và lỗi. Bài 09 chuyển sang sản phẩm dài hơn: bài viết, thuyết trình và dự án.',
  },
  {
    number: 9,
    stage: 3,
    slug: 'dung-ai-viet-bai-thuyet-trinh-du-an',
    title: 'Dùng AI để viết bài, thuyết trình và thực hiện dự án',
    tag: 'Dự án',
    readTime: '12 phút',
    cardDescription: 'Dùng AI cho brainstorm, phản biện, review và luyện Q&A mà vẫn giữ tư duy và sản phẩm cuối cùng là của chính bạn.',
    goal: 'Đặt AI vào từng khâu phù hợp của quy trình sáng tạo mà không giao quyền tác giả và quyết định cuối cùng.',
    intro:
      'AI có thể viết một bài trong vài chục giây. Nhưng nếu sản phẩm cuối cùng không chứa suy nghĩ của bạn, bạn đã tiết kiệm thời gian bằng cách bỏ qua chính phần tạo ra năng lực. Cách dùng có ích hơn là để AI đổi vai theo từng giai đoạn: gợi mở, tìm lỗ hổng, phản biện và mô phỏng người nghe.',
    objectives: [
      'Phân chia quy trình từ ý tưởng đến phiên bản cuối.',
      'Dùng AI để brainstorm và nghiên cứu mà vẫn tự chọn hướng.',
      'Nhận phản hồi cho outline, draft và thuyết trình mà không bị viết hộ.',
      'Giữ dấu vết đóng góp và kiểm chứng nguồn trong dự án.',
    ],
    icon: Zap,
    accent: 'green',
    sections: [
      {
        heading: 'Một quy trình, nhiều vai trò cho AI',
        blocks: [
          { type: 'quote', content: 'Ý tưởng → Nghiên cứu → Outline → Draft → Feedback → Revision → Final' },
          { type: 'paragraph', content: 'AI không nên làm cùng một việc ở mọi bước. Lúc brainstorm, nó có thể đặt câu hỏi mở. Lúc outline, nó làm editor kiểm tra cấu trúc. Lúc draft, bạn nên tự viết phần cốt lõi. Lúc feedback, AI mô phỏng người đọc. Bản final vẫn do bạn quyết định và chịu trách nhiệm.' },
          { type: 'paragraph', content: 'Trước mỗi bước, hãy xác định đầu ra tạm thời và quyết định nào phải do bạn giữ. Khi một bản nháp được tạo quá nhanh, bạn dễ nhận luôn cấu trúc và giọng của AI mà không còn biết vì sao sản phẩm đi theo hướng đó.' },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Giữ quyền quyết định ở mỗi cột mốc',
            content: 'Bạn chọn vấn đề, nguồn, luận điểm, dẫn chứng, thay đổi nào được chấp nhận và phiên bản nào được nộp.',
          },
        ],
      },
      {
        heading: 'Brainstorm: mở rộng trước khi thu hẹp',
        blocks: [
          { type: 'paragraph', content: 'Brainstorm tốt không phải để AI chọn ý tưởng “hay nhất” thay bạn. Hãy đưa ba hướng ban đầu, tiêu chí của đề và điều bạn quan tâm. Yêu cầu AI đặt câu hỏi, tìm góc nhìn bị bỏ sót hoặc kết hợp hai hướng. Sau đó bạn tự chọn dựa trên tính khả thi và điều mình muốn nói.' },
          {
            type: 'prompt',
            title: 'Mở rộng ba hướng hiện có',
            content: 'Mình đang cân nhắc ba hướng sau cho dự án: [ba hướng]. Đừng chọn thay mình. Hãy đặt câu hỏi để làm rõ giá trị, nguồn cần có, rủi ro và phạm vi của từng hướng. Cuối cùng giúp mình tạo tiêu chí để tự quyết định.',
          },
          {
            type: 'comparison',
            before: 'Cho mình một ý tưởng độc đáo để chắc chắn được điểm cao.',
            after: 'Đây là điều mình quan tâm và yêu cầu đề. Hãy giúp mình mở rộng hướng, kiểm tra tính khả thi và tự chọn theo tiêu chí.',
          },
          { type: 'paragraph', content: 'Một ý tưởng nghe mới chưa chắc làm được trong thời gian và nguồn lực hiện có. Hãy kiểm tra người dùng, dữ liệu, thiết bị, kỹ năng nhóm và rủi ro. Sự phù hợp với vấn đề quan trọng hơn nhãn “độc đáo”.' },
        ],
      },
      {
        heading: 'Research: AI giúp tìm đường, nguồn gốc mới là bằng chứng',
        blocks: [
          { type: 'paragraph', content: 'AI hữu ích để tạo từ khóa, câu hỏi nghiên cứu, nhóm khái niệm và danh sách điều cần xác minh. Nó cũng có thể tóm tắt tài liệu bạn cung cấp. Đừng dùng danh sách nguồn do AI nêu như thư mục tham khảo nếu chưa mở và kiểm tra từng nguồn.' },
          {
            type: 'list',
            ordered: true,
            items: [
              'Viết câu hỏi nghiên cứu bằng lời của bạn.',
              'Nhờ AI gợi ý từ khóa và góc nhìn cần tìm.',
              'Tìm nguồn gốc từ cơ quan, tác giả hoặc tài liệu đáng tin.',
              'Đọc nguồn, ghi ý và lưu đường dẫn hoặc thông tin trích dẫn.',
              'Dùng AI để so sánh ghi chú, nhưng tự kiểm tra mọi khẳng định được đưa vào sản phẩm.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Không để AI che mất nguồn gốc',
            content: 'Nếu không thể chỉ ra thông tin đến từ đâu, đừng dùng nó như một dữ kiện chắc chắn trong bài.',
          },
        ],
      },
      {
        heading: 'Outline và draft: để AI làm editor',
        blocks: [
          { type: 'paragraph', content: 'Outline là nơi bạn sắp luận điểm, bằng chứng và thứ tự. Hãy tự tạo phiên bản đầu rồi nhờ AI tìm phần lặp, khoảng trống logic hoặc đoạn quá nặng. Khi AI đề xuất thay đổi, hỏi lý do và chỉ nhận phần phù hợp với ý định của bạn.' },
          {
            type: 'prompt',
            title: 'Review outline, không viết bài',
            content: 'Đây là outline và yêu cầu đề của mình. Hãy kiểm tra mạch logic, phần thiếu bằng chứng, ý lặp và chỗ chuyển đoạn đột ngột. Không viết bài hoàn chỉnh. Với mỗi góp ý, hãy nêu câu hỏi mình cần trả lời để tự sửa.',
          },
          { type: 'paragraph', content: 'Ở bước draft, hãy tự viết những đoạn chứa phân tích và tiếng nói của bạn. Sau đó có thể nhờ AI đánh dấu câu mơ hồ, luận điểm chưa được chứng minh hoặc chỗ vượt quá giới hạn từ. Đừng dùng nút “viết lại toàn bộ” rồi coi văn bản đó là của mình.' },
          {
            type: 'prompt',
            title: 'Phản hồi có giới hạn cho bản nháp',
            content: 'Đọc bản nháp như một người đọc chưa biết đề tài. Chỉ ra ba chỗ khó hiểu nhất, hai khẳng định cần nguồn và một đoạn có thể rút gọn. Không viết câu thay mình; hãy mô tả vấn đề để mình tự sửa trước.',
          },
        ],
      },
      {
        heading: 'Thuyết trình: luyện flow và Q&A',
        blocks: [
          { type: 'paragraph', content: 'Slide đẹp chưa đảm bảo người nghe theo kịp. AI có thể kiểm tra flow, ước lượng phần nào quá dài, tìm thuật ngữ chưa giải thích và đóng vai người nghe đặt câu hỏi. Bạn không cần để AI viết toàn bộ lời nói rồi học thuộc; điều đó dễ làm phần trình bày cứng và lộ khi bị hỏi lệch kịch bản.' },
          {
            type: 'prompt',
            title: 'Mock Q&A cho thuyết trình',
            content: 'Hãy đóng vai giám khảo dựa trên outline và nguồn mình gửi. Đặt 10 câu có khả năng khiến mình lúng túng nhất, từng câu một. Sau câu trả lời, phản biện giả định hoặc bằng chứng, nhưng cho mình cơ hội sửa trước khi gợi ý.',
          },
          {
            type: 'list',
            items: [
              'Giải thích dự án trong 30 giây mà không dùng thuật ngữ khó.',
              'Nêu lý do chọn phương án và điều đã loại bỏ.',
              'Chỉ ra nguồn quan trọng nhất và giới hạn của nó.',
              'Trả lời một câu hỏi ngoài thứ tự slide.',
            ],
          },
          { type: 'paragraph', content: 'Hãy luyện thành tiếng và bấm thời gian. Phản hồi của AI về flow chỉ là giả thuyết cho tới khi bạn thử với người thật. Nếu có thể, nhờ bạn cùng lớp nghe và nói lại điều họ hiểu để kiểm tra độ rõ.' },
        ],
      },
      {
        heading: 'Dự án nhóm: AI là planner, reviewer và debugger',
        blocks: [
          { type: 'paragraph', content: 'Trong dự án, AI có thể giúp chia đầu việc, tìm phụ thuộc, tạo checklist, review rủi ro hoặc debug một phần kỹ thuật. Nhóm vẫn phải phân công ai chịu trách nhiệm, thống nhất cách dùng AI và lưu dấu vết quyết định.' },
          {
            type: 'list',
            items: [
              'Planner: đề xuất các mốc để nhóm xem và sửa theo lịch thật.',
              'Research assistant: gợi ý câu hỏi và từ khóa, không thay việc đọc nguồn.',
              'Reviewer: kiểm tra sản phẩm theo rubric trước khi nộp.',
              'Debugger: tạo giả thuyết và test, không viết lại toàn bộ phần của một thành viên.',
              'Practice partner: mô phỏng người dùng hoặc giám khảo để nhóm luyện phản hồi.',
            ],
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Tạo nhật ký đóng góp ngắn',
            content: 'Với một sản phẩm đang làm, ghi ba cột: phần mình quyết định, phần AI hỗ trợ và cách mình kiểm tra/chỉnh sửa. Nhật ký giúp bạn trả lời trung thực khi được hỏi về quá trình.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Đừng để một thành viên dùng AI thay cả nhóm',
            content: 'Nhóm cần hiểu và thống nhất mọi phần quan trọng. Một sản phẩm không còn là công việc nhóm nếu chỉ một người biết prompt và không ai giải thích được kết quả.',
          },
        ],
      },
    ],
    takeaways: [
      'AI nên đổi vai theo từng bước của quy trình sáng tạo.',
      'Bạn giữ quyền chọn vấn đề, nguồn, luận điểm và phiên bản cuối.',
      'AI hữu ích nhất khi đặt câu hỏi, phản biện và mô phỏng người đọc hoặc giám khảo.',
      'Mọi dữ kiện và nguồn trong sản phẩm vẫn cần được bạn xác nhận.',
    ],
    selfCheck: [
      'Ở bước nào bạn nên tự viết phần quan trọng nhất của bài?',
      'Nhật ký đóng góp giúp dự án minh bạch ra sao?',
      'Hãy đổi một yêu cầu “viết hộ” thành yêu cầu review hoặc phản biện.',
    ],
    transition: 'Khi AI đã tham gia nhiều bước, bối cảnh cá nhân giúp phản hồi phù hợp hơn. Bài 10 sẽ tạo một “gia sư AI” có quy tắc nhưng không thu thập quá nhiều dữ liệu.',
  },
  {
    number: 10,
    stage: 3,
    slug: 'xay-dung-gia-su-ai-ca-nhan',
    legacySlugs: ['quy-trinh-hoc-30-phut-voi-ai'],
    title: 'Xây dựng “gia sư AI” phù hợp với chính bạn',
    tag: 'Cá nhân hóa',
    readTime: '10 phút',
    cardDescription: 'Cung cấp đúng bối cảnh, mục tiêu và quy tắc học tập để AI hỗ trợ phù hợp hơn mà không cần chia sẻ thông tin không cần thiết.',
    goal: 'Tạo một hồ sơ học tập tối thiểu và learning contract để AI điều chỉnh phản hồi an toàn, vừa sức.',
    intro:
      'Cùng một lời giải có thể quá dễ với người này và quá khó với người khác. Vì vậy, một trong những thông tin AI cần nhất không chỉ là bài tập mà còn là bối cảnh của người đang học. Cá nhân hóa tốt không có nghĩa kể cả cuộc đời; nó là chọn đúng dữ liệu liên quan và đặt quy tắc hỗ trợ.',
    objectives: [
      'Xác định thông tin học tập nào thật sự liên quan.',
      'Phân biệt cá nhân hóa với chia sẻ dữ liệu quá mức.',
      'Viết learning profile ngắn và learning contract rõ.',
      'Hiểu các trường hồ sơ thật sự có trong EduAI-Hub và giới hạn của chúng.',
    ],
    icon: Route,
    accent: 'blue',
    sections: [
      {
        heading: 'AI cần biết gì để hỗ trợ vừa sức?',
        blocks: [
          {
            type: 'list',
            items: [
              'Lớp hoặc mức kiến thức hiện tại.',
              'Môn và chủ đề đang học.',
              'Mục tiêu cụ thể của buổi học.',
              'Phần đã biết và cách bạn đã thử.',
              'Khó khăn thường gặp có liên quan.',
              'Kiểu phản hồi mong muốn: câu hỏi, gợi ý, ví dụ hay phản biện.',
            ],
          },
          {
            type: 'paragraph',
            content: 'Bạn không cần cung cấp tất cả trong mọi prompt. Nếu đang luyện một bài Toán, lớp, phần đã học, bước mắc và mức gợi ý thường đủ. Nếu đang lập kế hoạch ôn, thời gian, mục tiêu, lịch thi và error log lại quan trọng hơn.',
          },
          {
            type: 'prompt',
            title: 'Learning profile ngắn',
            content: 'Mình học lớp 11. Mình khá phần Đại số nhưng thường khó hình dung Hình học. Khi mình hỏi bài, hãy kiểm tra xem mình đã thử gì trước. Nếu sai, ưu tiên câu hỏi và gợi ý từ nhẹ đến rõ; chỉ giải thích bước sau khi mình đã thử.',
            explanation: 'Profile này chỉ chứa thông tin liên quan tới cách học. Bạn có thể thay đổi theo môn hoặc xóa bất kỳ phần nào không cần cho nhiệm vụ.',
          },
          {
            type: 'paragraph',
            content: 'Profile càng cụ thể với nhiệm vụ hiện tại càng dễ dùng. “Mình yếu Toán” là nhãn rộng và có thể khiến AI hạ độ khó không cần thiết. “Mình hiểu đại số nhưng khó hình dung quan hệ không gian” cho biết nơi cần đổi cách giải thích.',
          },
        ],
      },
      {
        heading: 'Cá nhân hóa không phải thu thập càng nhiều càng tốt',
        blocks: [
          {
            type: 'paragraph',
            content: 'Mỗi thông tin đưa vào một dịch vụ đều cần lý do. Hãy hỏi: AI có cần chi tiết này để hoàn thành nhiệm vụ không? Nếu bỏ đi mà chất lượng hỗ trợ không đổi, đừng cung cấp.',
          },
          {
            type: 'list',
            items: [
              'Không gửi mật khẩu, mã xác thực hoặc thông tin đăng nhập.',
              'Không gửi CCCD, địa chỉ cụ thể, số điện thoại hoặc dữ liệu tài chính.',
              'Không gửi hồ sơ sức khỏe nhạy cảm nếu nhiệm vụ học không cần.',
              'Không đưa thông tin riêng của bạn bè, giáo viên hoặc gia đình.',
              'Không tải tài liệu nội bộ, đề chưa công bố hoặc nội dung bạn không có quyền chia sẻ.',
            ],
          },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Nguyên tắc dữ liệu tối thiểu',
            content: 'Chỉ cung cấp lượng thông tin tối thiểu cần để hoàn thành nhiệm vụ học tập.',
          },
          {
            type: 'paragraph',
            content: 'Bạn cũng nên xem lại thông tin cũ trong một cuộc trò chuyện dài. Bối cảnh từng hữu ích cho môn Văn có thể không cần khi chuyển sang code. Ít dữ liệu đúng trọng tâm thường dễ kiểm soát hơn nhiều dữ liệu lẫn lộn.',
          },
        ],
      },
      {
        heading: 'Tạo learning contract với AI',
        blocks: [
          {
            type: 'paragraph',
            content: 'Profile nói bạn đang ở đâu; learning contract nói AI nên tương tác thế nào. Đây là bộ quy tắc giữ cuộc trò chuyện hướng vào học tập ngay cả khi bạn vội và muốn xin đáp án.',
          },
          {
            type: 'prompt',
            title: 'Learning contract năm điều',
            content: 'Khi mình hỏi bài, hãy tuân theo năm điều: 1) hỏi mình đã thử gì; 2) không cho đáp án ngay; 3) gợi ý từ nhẹ đến rõ; 4) sau khi hiểu, cho một bài tương tự; 5) kiểm tra xem mình có tự làm lại được không. Nếu yêu cầu của mình mâu thuẫn với mục tiêu học, hãy nhắc mình chọn mức hỗ trợ.',
          },
          {
            type: 'paragraph',
            content: 'Contract không cần cứng cho mọi tình huống. Khi ôn thi thử, bạn có thể yêu cầu không phản hồi cho tới cuối. Khi học khái niệm mới, bạn có thể cho phép ví dụ mẫu sớm hơn. Hãy cập nhật theo mục tiêu của phiên học.',
          },
          {
            type: 'comparison',
            before: 'Luôn giải thật chi tiết để mình dễ hiểu.',
            after: 'Bắt đầu bằng câu hỏi chẩn đoán; tăng hỗ trợ từng nấc; kết thúc bằng nhiệm vụ mình tự làm.',
            explanation: 'Một quy tắc tốt mô tả quá trình, không mặc định càng nhiều lời giải càng hữu ích.',
          },
        ],
      },
      {
        heading: 'Hiệu chỉnh qua vài lượt, không cần viết prompt khổng lồ',
        blocks: [
          {
            type: 'paragraph',
            content: 'Bạn có thể bắt đầu bằng profile ngắn, thử một câu và điều chỉnh. Nếu giải thích quá khó, yêu cầu hạ một mức. Nếu AI gợi ý quá sớm, nhắc nó chờ. Dữ liệu từ phản hồi thật hữu ích hơn một prompt dài chứa nhiều giả định về cách bạn học.',
          },
          {
            type: 'list',
            items: [
              '“Cách giải thích này quá nhanh; hãy quay lại kiến thức nền vừa thiếu.”',
              '“Đừng hỏi mình có hiểu không; hãy kiểm tra bằng một câu áp dụng.”',
              '“Ví dụ hình học giúp mình dễ hiểu hơn. Hãy dùng thêm một hình dung tương tự.”',
              '“Mỗi lượt chỉ sửa một lỗi để mình tự theo dõi.”',
            ],
          },
          {
            type: 'paragraph',
            content: 'Sau một vài lượt, hãy nhìn kết quả thay vì cảm giác. Bạn có tự trả lời tốt hơn, giải thích rõ hơn hay ít cần gợi ý hơn không? Nếu không, đổi cách tương tác. Cá nhân hóa là một giả thuyết cần được kiểm tra.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Đừng gắn nhãn mình quá sớm',
            content: '“Mình học bằng hình ảnh” không có nghĩa mọi nội dung phải biến thành hình. Hãy xem sở thích học là gợi ý, rồi kiểm tra xem cách nào giúp bạn tự làm tốt hơn.',
          },
        ],
      },
      {
        heading: 'Hồ sơ học tập trong EduAI-Hub',
        blocks: [
          {
            type: 'paragraph',
            content: 'Hồ sơ hiện tại của EduAI-Hub có các trường như lớp, trường, bối cảnh cá nhân bạn tự viết, điểm mạnh, điểm yếu, vấn đề thường gặp, mục tiêu học tập, phong cách học ưu tiên và mức kinh nghiệm AI. Đây là các trường có thật trong giao diện, không phải dữ liệu hệ thống tự suy đoán.',
          },
          {
            type: 'paragraph',
            content: 'Bạn nên chọn những gì đúng và hữu ích, đồng thời có thể cập nhật khi mục tiêu thay đổi. Một nhãn như “hay trì hoãn” không phải bản chất cố định; nó chỉ là bối cảnh để trợ lý gợi ý bước nhỏ hoặc nhắc cách bắt đầu phù hợp hơn.',
          },
          {
            type: 'paragraph',
            content: 'Thông tin trường học giúp hoàn thiện hồ sơ nhưng bạn không cần lặp lại tên trường trong prompt nếu nhiệm vụ không cần. Điểm mạnh và yếu cũng nên được dùng như gợi ý cho cách hỗ trợ, không phải để giới hạn mức bài bạn có thể thử.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Hồ sơ không đảm bảo mọi AI tự động biết bối cảnh',
            content: 'Tùy công cụ và phiên trò chuyện, bạn vẫn có thể cần cung cấp lại thông tin liên quan. Hãy kiểm tra phản hồi thay vì mặc định mọi trường đều được dùng ở mọi nơi.',
          },
        ],
      },
      {
        heading: 'Tạo phiên bản gia sư cho một môn',
        blocks: [
          {
            type: 'callout',
            tone: 'try',
            title: 'Bài tập năm phút',
            content: 'Chọn một môn. Viết ba dòng về mức hiện tại và điểm mắc, ba quy tắc AI nên tuân theo, một loại dữ liệu bạn sẽ không chia sẻ và một bài kiểm tra cuối buổi để biết cách cá nhân hóa có hiệu quả.',
          },
          {
            type: 'prompt',
            title: 'Mẫu hoàn chỉnh để chỉnh sửa',
            content: 'Mình học lớp [lớp], đang học [môn/chủ đề]. Mình đã biết [phần đã biết] và thường mắc ở [khó khăn]. Mục tiêu buổi này là [mục tiêu]. Trước khi giúp, hãy hỏi mình đã thử gì. Ưu tiên [kiểu hỗ trợ], không đưa đáp án ngay. Cuối buổi cho một nhiệm vụ tương tự để mình tự làm khi không nhìn cuộc trò chuyện.',
          },
          {
            type: 'paragraph',
            content: 'Sau buổi học, đừng chỉ hỏi “AI có hiểu mình không?”. Hãy hỏi “Cách hỗ trợ này có giúp mình tự làm tốt hơn không?”. Nếu không, sửa contract hoặc giảm bối cảnh về đúng phần cần thiết.',
          },
        ],
      },
    ],
    takeaways: [
      'Cá nhân hóa tốt dùng thông tin học tập liên quan, không dùng càng nhiều dữ liệu càng tốt.',
      'Learning profile mô tả bối cảnh; learning contract đặt quy tắc tương tác.',
      'Bạn có thể hiệu chỉnh bằng follow-up thay vì viết một prompt khổng lồ.',
      'Thước đo cá nhân hóa là khả năng tự làm tốt hơn, không phải cảm giác AI hiểu mình.',
    ],
    selfCheck: [
      'Thông tin nào trong hồ sơ của bạn thật sự cần cho một bài Toán?',
      'Learning profile và learning contract khác nhau thế nào?',
      'Hãy nêu một dữ liệu bạn không nên chia sẻ dù AI hỏi.',
    ],
    transition: 'Cá nhân hóa càng sâu, trách nhiệm với dữ liệu và ranh giới càng quan trọng. Bài 11 sẽ đi thẳng vào quyền riêng tư, trung thực và giới hạn.',
  },
  {
    number: 11,
    stage: 4,
    slug: 'su-dung-ai-co-trach-nhiem',
    legacySlugs: ['bao-mat-dao-duc-va-trach-nhiem-khi-dung-ai'],
    title: 'Sử dụng AI có trách nhiệm: quyền riêng tư, trung thực và giới hạn',
    tag: 'Trách nhiệm',
    readTime: '10 phút',
    cardDescription: 'Hiểu ranh giới giữa hỗ trợ và làm thay, bảo vệ dữ liệu cá nhân và chịu trách nhiệm với sản phẩm có AI tham gia.',
    goal: 'Đưa ra quyết định minh bạch về dữ liệu, bản quyền, quy định và phần việc AI được phép hỗ trợ.',
    intro:
      'Có những việc AI có thể làm, nhưng điều đó không đồng nghĩa bạn nên để AI làm. Công cụ không tự biết quy định của lớp, nội dung nào riêng tư hay phần nào giáo viên muốn bạn tự thực hiện. Trách nhiệm nằm ở cách bạn đặt ranh giới trước, trong và sau khi dùng.',
    objectives: [
      'Phân biệt hỗ trợ với làm thay trong bài tập và dự án.',
      'Áp dụng nguyên tắc dữ liệu tối thiểu để bảo vệ quyền riêng tư.',
      'Nhận biết trách nhiệm về nguồn, bản quyền, thiên lệch và quy định.',
      'Giải thích trung thực phần đóng góp của mình trong sản phẩm có AI hỗ trợ.',
    ],
    icon: ShieldCheck,
    accent: 'orange',
    sections: [
      {
        heading: 'Hỗ trợ hay làm thay?',
        blocks: [
          {
            type: 'comparison',
            beforeLabel: 'Làm thay',
            before: 'Viết toàn bộ bài kiểm tra cá nhân; tạo sản phẩm rồi nộp như tự làm; bịa nguồn; vượt qua nhiệm vụ giáo viên yêu cầu thực hiện độc lập.',
            afterLabel: 'Hỗ trợ',
            after: 'Giải thích, phản biện outline, tìm lỗi, tạo câu hỏi luyện, brainstorm, mô phỏng Q&A hoặc góp ý theo tiêu chí.',
            explanation: 'Cùng một hành động có thể được phép hoặc không tùy mục tiêu và quy định. Mấu chốt là AI có thay thế năng lực đang được đánh giá hay không.',
          },
          { type: 'quote', content: 'Nếu giáo viên hỏi “Phần nào do bạn làm và vì sao bạn chọn cách này?”, bạn có thể trả lời trung thực không?' },
          { type: 'paragraph', content: 'Nếu bạn không thể giải thích lập luận, nguồn hoặc quyết định trong sản phẩm, AI có thể đã làm quá phần. Hãy quay lại bản nháp, tự viết lại và làm rõ đóng góp trước khi nộp.' },
          {
            type: 'paragraph',
            content: 'Ranh giới còn phụ thuộc mục tiêu. Nhờ AI sửa hai lỗi trong bài luyện có thể là phản hồi; nhờ nó viết toàn bộ bài kiểm tra ngôn ngữ có thể thay đúng năng lực đang được chấm. Hãy nhìn vào điều nhiệm vụ muốn bạn chứng minh.',
          },
        ],
      },
      {
        heading: 'Quyền riêng tư: chỉ đưa dữ liệu tối thiểu',
        blocks: [
          { type: 'paragraph', content: 'Đừng gửi dữ liệu chỉ vì khung chat cho phép hoặc AI hỏi thêm. Thay tên thật bằng ký hiệu khi có thể, xóa chi tiết nhận diện, chỉ trích phần tài liệu cần phản hồi và xem chính sách của dịch vụ nếu dữ liệu nhạy cảm.' },
          {
            type: 'list',
            items: [
              'Không chia sẻ mật khẩu, mã xác thực, thông tin tài chính hoặc giấy tờ định danh.',
              'Không đăng thông tin riêng của người khác nếu chưa được phép.',
              'Không tải đề chưa công bố, dữ liệu trường học nội bộ hoặc tài liệu có giới hạn sử dụng.',
              'Kiểm tra ảnh chụp có lộ tên, email, mã học sinh hoặc khuôn mặt không cần thiết hay không.',
              'Xóa dữ liệu cũ khỏi prompt khi nó không còn liên quan tới lượt hỏi mới.',
            ],
          },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Một câu hỏi trước khi gửi',
            content: 'Thông tin này có thật sự cần để AI hoàn thành nhiệm vụ không?',
          },
          {
            type: 'paragraph',
            content: 'Nếu cần AI góp ý một bài có tên bạn bè hoặc dữ liệu khảo sát, hãy ẩn danh trước. Việc dữ liệu xuất hiện trong bài của bạn không tự động cho phép đưa nó vào dịch vụ khác.',
          },
        ],
      },
      {
        heading: 'Bản quyền và nguồn gốc',
        blocks: [
          { type: 'paragraph', content: '“Có trên Internet” không có nghĩa bạn được dùng tùy ý. Khi dùng văn bản, hình ảnh, dữ liệu hoặc ý tưởng cụ thể, hãy kiểm tra quyền sử dụng và ghi nguồn theo yêu cầu. AI không làm biến mất nghĩa vụ đó.' },
          { type: 'paragraph', content: 'Đừng nhờ AI diễn đạt lại để che nguồn gốc. Paraphrase vẫn dựa trên ý của nguồn và có thể cần trích dẫn. Với câu trích dẫn, hãy tìm lại văn bản gốc; AI có thể tạo một câu nghe đúng giọng nhưng chưa từng tồn tại.' },
          {
            type: 'prompt',
            title: 'Kiểm tra dấu vết nguồn',
            content: 'Đọc bản nháp của mình và đánh dấu các khẳng định, số liệu, câu trích hoặc ý cụ thể cần nguồn. Không tự tạo citation. Với mỗi chỗ, nêu loại nguồn gốc mình nên tìm và câu hỏi cần xác minh.',
          },
          {
            type: 'paragraph',
            content: 'Khi dùng hình ảnh hoặc âm thanh do AI tạo, hãy xem quy định của bài và điều kiện sử dụng công cụ. Với cuộc thi, yêu cầu khai báo có thể khác bài tập trên lớp. Nếu không chắc, hỏi ban tổ chức hoặc giáo viên.',
          },
        ],
      },
      {
        heading: 'Quy định về AI không giống nhau ở mọi nơi',
        blocks: [
          { type: 'paragraph', content: 'Mỗi môn, giáo viên, trường, kỳ thi hoặc cuộc thi có thể đặt quy định khác nhau. Một nơi cho phép dùng AI để brainstorm nhưng yêu cầu khai báo; nơi khác cấm trong bài đánh giá cá nhân. Đừng lấy thói quen ở một môn áp cho tất cả.' },
          {
            type: 'list',
            ordered: true,
            items: [
              'Đọc đề, rubric và quy định đi kèm.',
              'Nếu chưa rõ, hỏi giáo viên phần nào được phép và cách khai báo.',
              'Giữ lại prompt, bản nháp hoặc nhật ký thay đổi khi cần minh bạch quá trình.',
              'Không dùng AI trong tình huống bị cấm, dù công cụ có thể truy cập.',
            ],
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Không có một luật cứng cho mọi bài',
            content: 'Khi chưa chắc, hãy hỏi trước. Sự im lặng của đề không tự động đồng nghĩa mọi cách dùng đều được phép.',
          },
        ],
      },
      {
        heading: 'Thiên lệch và góc nhìn bị bỏ sót',
        blocks: [
          { type: 'paragraph', content: 'AI học từ dữ liệu do con người tạo nên phản hồi có thể lặp lại thiên lệch, thiếu bối cảnh địa phương hoặc coi một góc nhìn là mặc định. Câu trả lời gọn thường làm biến mất phần tranh luận và ngoại lệ.' },
          {
            type: 'list',
            items: [
              '“Câu trả lời đang dựa trên giả định nào?”',
              '“Góc nhìn của nhóm nào có thể đang bị bỏ qua?”',
              '“Có cách giải thích khác dựa trên cùng dữ kiện không?”',
              '“Ví dụ này có phù hợp với bối cảnh học sinh Việt Nam không?”',
            ],
          },
          { type: 'paragraph', content: 'Hỏi thêm góc nhìn không có nghĩa mọi ý đều đúng như nhau. Bạn vẫn cần bằng chứng, nguồn và tiêu chí để đánh giá. Mục tiêu là tránh chấp nhận phiên bản đầu tiên như toàn bộ bức tranh.' },
          {
            type: 'comparison',
            before: 'AI đưa ba lựa chọn nên đây chắc là bức tranh đầy đủ.',
            after: 'Mình hỏi giả định, nhóm bị bỏ sót và đối chiếu với nguồn ở bối cảnh liên quan.',
          },
        ],
      },
      {
        heading: 'Checklist trước khi nộp',
        blocks: [
          {
            type: 'list',
            items: [
              'Mình hiểu và giải thích được mọi phần quan trọng.',
              'Dữ kiện, nguồn và trích dẫn đã được kiểm tra từ bản gốc.',
              'Phần dùng AI phù hợp với quy định của nhiệm vụ.',
              'Dữ liệu cá nhân hoặc nội dung không được phép chia sẻ đã được loại bỏ.',
              'Sản phẩm phản ánh quyết định và cách diễn đạt của mình.',
              'Nếu cần, mình có thể mô tả trung thực AI đã hỗ trợ ở đâu.',
            ],
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Kiểm tra một sản phẩm gần đây',
            content: 'Chọn một bài có AI hỗ trợ. Đánh dấu phần bạn tự làm, phần AI góp ý, nguồn đã kiểm tra và dữ liệu đã chia sẻ. Nếu có một điểm khiến bạn khó giải thích trung thực, hãy sửa trước khi dùng tiếp.',
          },
          { type: 'quote', content: 'Bạn chịu trách nhiệm cho sản phẩm mình nộp, ngay cả khi AI đã hỗ trợ tạo ra một phần của nó.' },
        ],
      },
    ],
    takeaways: [
      'Khả năng AI làm được một việc không quyết định việc đó có nên làm hay không.',
      'Chỉ chia sẻ dữ liệu tối thiểu và tôn trọng quyền riêng tư của người khác.',
      'Nguồn, bản quyền và quy định vẫn áp dụng khi AI tham gia.',
      'Bạn phải hiểu, kiểm tra và chịu trách nhiệm với sản phẩm cuối cùng.',
    ],
    selfCheck: [
      'Hãy nêu một ví dụ AI hỗ trợ và một ví dụ AI làm thay trong cùng môn.',
      'Nếu đề không nói rõ có được dùng AI hay không, bạn nên làm gì?',
      'Bạn sẽ mô tả phần đóng góp của AI trong sản phẩm gần nhất ra sao?',
    ],
    transition: 'Bài cuối không giới thiệu công cụ mới. Mình sẽ gom toàn bộ lộ trình thành một workflow để bạn biết khi nào dùng AI và khi nào nên tự làm.',
  },
  {
    number: 12,
    stage: 4,
    slug: 'tu-nguoi-dung-ai-den-nguoi-hoc-tu-chu',
    legacySlugs: ['bien-ai-thanh-he-thong-tu-hoc-ca-nhan'],
    title: 'Từ người dùng AI đến người học tự chủ',
    tag: 'Tổng kết',
    readTime: '10 phút',
    cardDescription: 'Tổng hợp toàn bộ EduAI-Hub thành một workflow tự học để bạn biết khi nào dùng AI, khi nào kiểm chứng và khi nào nên tự làm.',
    goal: 'Rời mini-course với một workflow sáu bước có thể tự dùng mà không cần EduAI-Hub nhắc.',
    intro:
      'Ở bài đầu tiên, bạn học cách hỏi AI. Nhưng đó chưa bao giờ là mục tiêu cuối. Mục tiêu là hiểu mình đang học gì, biết khi nào cần hỗ trợ, yêu cầu đúng mức, kiểm chứng và đóng AI lại đúng lúc. Bài kết nối các kỹ năng đó thành một vòng học bạn có thể mang sang mọi môn.',
    objectives: [
      'Ghi nhớ workflow DEFINE – TRY – ASK – VERIFY – APPLY – REFLECT.',
      'Dùng AI OFF CHECK để phân biệt nhìn thấy lời giải với học được cách giải.',
      'Đánh giá một phiên học bằng năng lực sau cuộc trò chuyện.',
      'Tạo cam kết tự học nhỏ cho tuần tiếp theo.',
    ],
    icon: LockKeyhole,
    accent: 'green',
    sections: [
      {
        heading: 'Nhìn lại hành trình 12 bài',
        blocks: [
          { type: 'paragraph', content: 'Bạn bắt đầu từ việc hiểu EduAI-Hub và chọn công cụ theo nhiệm vụ. Sau đó bạn học cách giao tiếp rõ, yêu cầu AI hướng dẫn, kiểm chứng câu trả lời và điều chỉnh theo từng môn. Ở chặng ba, các kỹ năng trở thành workflow cho tài liệu, ôn tập, dự án và cá nhân hóa. Chặng cuối đặt ranh giới trách nhiệm.' },
          { type: 'paragraph', content: 'Điểm chung không phải một prompt hay một sản phẩm. Đó là vị trí của bạn trong quá trình: xác định vấn đề, thử, ra quyết định, kiểm tra và tự áp dụng. AI có thể thay đổi, nhưng các bước này vẫn hữu ích.' },
          {
            type: 'paragraph',
            content: 'Bạn không cần thực hiện mọi kỹ thuật trong mọi buổi. Một bài đơn giản có thể chỉ cần tự thử, xin gợi ý và làm lại. Một dự án cần thêm nguồn, nhật ký và quy định. Tự chủ nghĩa là chọn đúng mức hỗ trợ, không phải từ chối AI hoàn toàn.',
          },
          { type: 'quote', content: 'Mục tiêu không phải dùng AI nhiều hơn. Mục tiêu là học tốt hơn và ngày càng biết tự điều khiển mức hỗ trợ.' },
        ],
      },
      {
        heading: '1. DEFINE – Xác định',
        blocks: [
          { type: 'paragraph', content: 'Đừng mở AI ngay. Viết một câu: “Mình muốn hiểu hoặc làm được điều gì sau buổi này?”. Mục tiêu nên đủ nhỏ để kiểm tra, chẳng hạn tự giải thích một cơ chế, làm đúng một dạng bài hay sửa ba lỗi lặp trong bài viết.' },
          {
            type: 'list',
            items: [
              'Nhiệm vụ thật sự là gì?',
              'Tiêu chí nào cho thấy mình đã hoàn thành?',
              'Nguồn hoặc quy định nào cần tuân theo?',
              'Phần nào phải do mình tự thực hiện?',
            ],
          },
          {
            type: 'paragraph',
            content: 'Nếu mục tiêu là “ôn chương”, hãy làm nó đo được hơn: sau 30 phút tự trả lời được tám câu nền và giải thích hai lỗi lặp. Đích rõ giúp bạn biết khi nào dừng AI và chuyển sang tự làm.',
          },
          {
            type: 'callout',
            tone: 'principle',
            title: 'Không có mục tiêu, prompt chỉ làm sự mơ hồ dài hơn',
            content: 'Một câu xác định rõ có thể tiết kiệm cả cuộc trò chuyện lan man.',
          },
        ],
      },
      {
        heading: '2. TRY – Tự thử',
        blocks: [
          { type: 'paragraph', content: 'Viết điều bạn đã biết, thử bước đầu hoặc giải thích theo cách hiện tại. Tự thử không phải nghi thức để chứng minh chăm chỉ. Nó tạo dữ liệu về điểm xuất phát và giúp bạn hỏi đúng phần đang mắc.' },
          {
            type: 'prompt',
            title: 'Dấu vết suy nghĩ ngắn',
            content: 'Mục tiêu của mình là [mục tiêu]. Mình đã thử [cách làm]. Mình hiểu tới [điểm] nhưng bị mắc ở [điểm cụ thể]. Trước khi gợi ý, hãy hỏi một câu để kiểm tra xem nguyên nhân mình đoán có đúng không.',
          },
          { type: 'paragraph', content: 'Nếu chưa biết bắt đầu, hãy thử viết dữ kiện, thuật ngữ đã biết hoặc câu hỏi nhỏ nhất. “Mình chưa biết bắt đầu ở đâu vì chưa hiểu từ này” đã tốt hơn giao cả nhiệm vụ cho AI.' },
          {
            type: 'paragraph',
            content: 'Đặt một khoảng thời gian tự thử vừa đủ. Quá ngắn khiến bạn chưa nghĩ; quá dài có thể mắc kẹt không cần thiết. Sau vài buổi, bạn sẽ biết với loại bài nào mình cần ba phút và loại nào cần mười phút.',
          },
        ],
      },
      {
        heading: '3. ASK – Nhờ AI đúng chỗ',
        blocks: [
          { type: 'paragraph', content: 'Chỉ giao phần bạn cần hỗ trợ. Chọn vai trò phù hợp: người hỏi Socratic, người phản biện, người kiểm tra lỗi, bạn luyện nói hay người lập bản đồ tài liệu. Đặt ràng buộc để AI không chiếm phần đang được học.' },
          {
            type: 'list',
            items: [
              'Hãy hỏi mình từng bước.',
              'Đừng đưa đáp án ngay.',
              'Chỉ gợi ý một bước.',
              'Đây là cách mình làm; hãy tìm lỗi đầu tiên.',
              'Hãy phản biện giả định và nguồn của mình.',
              'Kiểm tra xem mình hiểu thật chưa.',
            ],
          },
          { type: 'paragraph', content: 'Nếu câu trả lời không hợp, dùng follow-up. Điều chỉnh mức khó, ví dụ, số lỗi sửa hoặc tốc độ. Giao tiếp tốt là quá trình hiệu chỉnh, không phải tìm một câu thần chú hoàn hảo.' },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Đừng giao cả nhiệm vụ khi chỉ mắc một đoạn',
            content: 'Một yêu cầu hẹp giữ nhiều quyết định cho bạn hơn và dễ kiểm chứng hơn một sản phẩm hoàn chỉnh.',
          },
        ],
      },
      {
        heading: '4. VERIFY – Kiểm chứng',
        blocks: [
          { type: 'paragraph', content: 'Dừng trước khi copy. Tách dữ kiện khỏi suy luận, lần về nguồn, kiểm tra điều kiện, đơn vị, logic và quy định. Mức kiểm chứng tăng theo hậu quả nếu sai và độ khó của việc xác nhận.' },
          {
            type: 'list',
            items: [
              'Với Toán và khoa học: thay kết quả, kiểm tra đơn vị và thử cách khác.',
              'Với dữ kiện và trích dẫn: mở nguồn gốc, đọc ngữ cảnh và xác nhận tác giả/thời điểm.',
              'Với lập luận: tìm giả định, bước nhảy logic và góc nhìn bị thiếu.',
              'Với code: chạy test, xem trường hợp biên và đọc tài liệu chính thức.',
            ],
          },
          {
            type: 'paragraph',
            content: 'Kiểm chứng cũng giúp kiểm tra bạn có hiểu hay không. Nếu không biết phải kiểm tra bước nào, hãy quay lại và phân tích cấu trúc câu trả lời. Đừng chỉ tìm một nguồn nói giống AI; hãy tìm bằng chứng độc lập.',
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Không chắc thì giữ trạng thái chưa xác nhận',
            content: 'Một khoảng trống trung thực tốt hơn một dữ kiện bịa để bài trông hoàn chỉnh.',
          },
        ],
      },
      {
        heading: '5. APPLY – Tự áp dụng',
        blocks: [
          { type: 'paragraph', content: 'Đây là bước dễ bị bỏ nhất. Đóng câu trả lời, rồi làm bài tương tự, giải thích cho một người khác, tạo ví dụ mới hoặc dùng khái niệm vào tình huống khác. Nếu chỉ làm được khi nhìn mẫu, bạn còn cần một vòng luyện.' },
          {
            type: 'callout',
            tone: 'try',
            title: 'AI OFF CHECK',
            content: 'Sau khi học với AI, đóng AI lại và tự làm một nhiệm vụ tương tự. Nếu không thể làm, cuộc trò chuyện vừa rồi có thể đã giúp bạn nhìn thấy lời giải nhưng chưa giúp bạn học được cách giải.',
          },
          {
            type: 'comparison',
            beforeLabel: 'Dấu hiệu dễ nhầm',
            before: 'Mình đọc và thấy mọi bước đều hợp lý.',
            afterLabel: 'Bằng chứng mạnh hơn',
            after: 'Mình tự làm lại, giải thích lý do và sửa được một biến thể không nhìn mẫu.',
          },
          {
            type: 'paragraph',
            content: 'Nếu AI OFF CHECK chưa đạt, đừng vội xem lại toàn bộ lời giải. Xác định đúng đoạn mất mạch, thử nhớ kiến thức nền và chỉ mở phần cần thiết. Mỗi lần thu hẹp như vậy làm bạn ít phụ thuộc hơn.',
          },
        ],
      },
      {
        heading: '6. REFLECT – Nhìn lại để lần sau ít phụ thuộc hơn',
        blocks: [
          { type: 'paragraph', content: 'Cuối buổi, dành hai phút nhìn lại. Không cần nhật ký dài. Một vài dòng về điều đã hiểu, lỗi lặp, cách AI hỗ trợ có ích và phần cần ôn sẽ giúp lần sau bạn xác định vấn đề nhanh hơn.' },
          {
            type: 'list',
            items: [
              'Mình học được điều gì có thể tự giải thích?',
              'Mình còn yếu ở bước hoặc khái niệm nào?',
              'Lỗi nào xuất hiện nhiều hơn một lần?',
              'Prompt hoặc mức gợi ý nào giúp mình tự nghĩ tốt hơn?',
              'Lần sau mình có thể tự làm phần nào mà không cần AI?',
            ],
          },
          {
            type: 'prompt',
            title: 'Tổng kết phiên học',
            content: 'Dựa trên cuộc trò chuyện, đừng tóm tắt bài. Hãy giúp mình tạo một phiếu nhìn lại gồm: mục tiêu ban đầu, điều mình tự làm được, lỗi lặp, phần cần kiểm chứng hoặc ôn lại và một nhiệm vụ AI OFF cho lần sau. Chỉ dùng bằng chứng từ câu trả lời của mình.',
          },
          {
            type: 'paragraph',
            content: 'Phản tư chỉ có giá trị khi thay đổi hành động. Nếu bạn nhận ra mình luôn xin gợi ý quá sớm, buổi sau hãy tăng thời gian tự thử. Nếu hay quên kiểm chứng, đặt checklist ngay cạnh nơi nộp bài.',
          },
        ],
      },
      {
        heading: 'Khi nào EduAI-Hub hoàn thành nhiệm vụ?',
        blocks: [
          { type: 'paragraph', content: 'AI có thể giải thích nhanh hơn, tạo ví dụ nhanh hơn và phản hồi gần như ngay lập tức. Nhưng vẫn có một phần không công cụ nào làm thay được: quá trình bạn tự suy nghĩ, mắc lỗi, sửa lỗi và biến kiến thức thành thứ mình thật sự hiểu.' },
          {
            type: 'quote',
            content: 'Thước đo của việc học cùng AI không phải là bạn nhận được câu trả lời nhanh đến đâu, mà là sau cuộc trò chuyện đó, bạn có thể tự làm được thêm bao nhiêu.',
          },
          {
            type: 'callout',
            tone: 'try',
            title: 'Cam kết nhỏ cho bảy ngày tới',
            content: 'Chọn một môn và dùng đủ sáu bước trong ba buổi. Sau mỗi buổi, ghi một việc bạn đã tự làm được khi đóng AI. Cuối tuần, xem bước nào còn cần EduAI-Hub nhắc nhiều nhất.',
          },
          { type: 'paragraph', content: 'Nếu đến một ngày bạn không còn cần EduAI-Hub nhắc phải cung cấp bối cảnh, không cần trợ lý chỉ cách viết prompt và tự biết kiểm chứng những gì AI nói, thì EduAI-Hub đã hoàn thành đúng nhiệm vụ của mình.' },
        ],
      },
    ],
    takeaways: [
      'Workflow tự học gồm DEFINE, TRY, ASK, VERIFY, APPLY và REFLECT.',
      'AI OFF CHECK là bằng chứng tốt hơn cảm giác hiểu khi đang nhìn lời giải.',
      'Một phiên học tốt làm tăng phần bạn tự làm được ở lần sau.',
      'Mục tiêu cuối cùng là biết dùng AI đúng lúc và ít phụ thuộc hơn.',
    ],
    selfCheck: [
      'Hãy kể sáu bước bằng lời của bạn mà không nhìn lại.',
      'Bước nào bạn thường bỏ qua nhất và hậu quả là gì?',
      'Viết một nhiệm vụ AI OFF bạn sẽ thực hiện trong buổi học tới.',
    ],
  },
];

function matchesLessonSlug(lesson: GuideLesson, slug?: string) {
  return lesson.slug === slug || Boolean(slug && lesson.legacySlugs?.includes(slug));
}

export function getGuideLesson(slug?: string) {
  return guideLessons.find((lesson) => matchesLessonSlug(lesson, slug));
}

export function getAdjacentGuideLessons(slug?: string) {
  const index = guideLessons.findIndex((lesson) => matchesLessonSlug(lesson, slug));
  return {
    previous: index > 0 ? guideLessons[index - 1] : undefined,
    next: index >= 0 && index < guideLessons.length - 1 ? guideLessons[index + 1] : undefined,
  };
}
