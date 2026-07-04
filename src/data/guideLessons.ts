import {
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

export interface GuideLessonSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

export interface GuideLesson {
  number: number;
  slug: string;
  title: string;
  tag: string;
  readTime: string;
  cardDescription: string;
  goal: string;
  intro: string;
  icon: LucideIcon;
  accent: GuideAccent;
  sections: GuideLessonSection[];
  examplePrompt?: {
    label: string;
    content: string;
  };
  callout?: {
    title: string;
    body: string;
  };
  takeaways: string[];
}

export const guideLessons: GuideLesson[] = [
  {
    number: 1,
    slug: 'chao-mung-den-voi-eduai-hub',
    title: 'Chào mừng đến với EduAI-Hub',
    tag: 'Bắt đầu',
    readTime: '5 phút',
    cardDescription: 'Hiểu tinh thần của dự án: dùng AI để học tốt hơn, không học hộ.',
    goal: 'Hiểu EduAI-Hub giúp học sinh dùng AI như một bạn học có trách nhiệm.',
    intro:
      'AI có thể giúp bạn học nhanh hơn, nhưng chỉ khi bạn vẫn là người suy nghĩ, kiểm tra và luyện tập. Đây là bài mở đầu để đặt đúng tinh thần trước khi dùng bất kỳ công cụ AI nào.',
    icon: GraduationCap,
    accent: 'blue',
    sections: [
      {
        heading: 'EduAI-Hub sinh ra để giúp bạn học chủ động hơn',
        body: [
          'EduAI-Hub giúp học sinh THPT dùng các công cụ như ChatGPT, Gemini, Claude và các trợ lý AI trong nền tảng như một người đồng hành học tập. AI có thể giải thích lại bài khó, gợi ý cách đặt câu hỏi, tạo bài luyện tập và giúp bạn nhìn vấn đề từ nhiều góc.',
          'Nhưng nền tảng này không cổ vũ việc chép đáp án hay để AI làm hộ bài. Khi AI làm hết, bạn có thể có một câu trả lời đẹp. Khi bạn tự hiểu và làm lại được, bạn mới có năng lực thật.',
        ],
      },
      {
        heading: 'Dùng AI đúng bắt đầu từ thái độ đúng',
        body: [
          'Hãy xem AI như một bạn học rất nhanh, đọc nhiều, đôi khi hữu ích đến bất ngờ, nhưng vẫn cần được kiểm tra. Bạn đặt câu hỏi, bạn đọc câu trả lời, bạn quyết định phần nào dùng được và bạn chịu trách nhiệm với bài làm của mình.',
          'Nếu giữ được tinh thần đó, AI không làm bạn lười đi. Nó làm việc học sáng hơn: rõ câu hỏi hơn, nhiều ví dụ hơn, nhiều cách luyện tập hơn và nhiều cơ hội tự kiểm tra hơn.',
        ],
      },
    ],
    callout: {
      title: 'Nhớ câu này',
      body: 'AI không thay thế việc học. AI chỉ làm việc học sáng hơn nếu bạn còn là người cầm lái.',
    },
    takeaways: [
      'Dùng AI đúng là học chủ động hơn, không phải lười suy nghĩ hơn.',
      'AI nên hỗ trợ quá trình học, không thay thế trách nhiệm học.',
      'Bạn luôn cần hiểu lại câu trả lời bằng lời của mình.',
    ],
  },
  {
    number: 2,
    slug: 'ai-la-gi',
    title: 'AI là gì? Hiểu đơn giản trước đã',
    tag: 'Nền tảng',
    readTime: '7 phút',
    cardDescription: 'Biết AI là công cụ dự đoán và hỗ trợ, không phải một bộ não hoàn hảo.',
    goal: 'Hiểu AI có thể giúp gì, giới hạn ở đâu và vì sao cần kiểm chứng.',
    intro:
      'Trước khi hỏi AI làm gì cho mình, bạn cần biết nó là kiểu công cụ nào. Hiểu đúng sẽ giúp bạn bớt tin mù quáng và dùng AI khôn hơn.',
    icon: Brain,
    accent: 'green',
    sections: [
      {
        heading: 'AI là phần mềm học từ dữ liệu',
        body: [
          'Nói đơn giản, AI là phần mềm được huấn luyện trên rất nhiều dữ liệu để tạo ra phản hồi có vẻ hợp lý và hữu ích. Nó có thể viết, giải thích, tóm tắt, gợi ý ý tưởng, đặt câu hỏi luyện tập và hỗ trợ suy luận ở một mức nhất định.',
          'Điều quan trọng là AI không hiểu bài học giống như thầy cô hoặc chính bạn. Nó tạo ra câu trả lời dựa trên mẫu đã học, nên đôi khi trả lời rất trôi chảy dù đang sai.',
        ],
      },
      {
        heading: 'Một ví dụ dễ hình dung',
        body: [
          'AI giống một người bạn đọc rất nhiều tài liệu và trả lời rất nhanh. Nhưng vì trả lời nhanh, đôi khi nó cũng đoán sai rất tự tin.',
          'Vì vậy, khi AI giải thích một khái niệm Vật lý, một sự kiện Lịch sử hoặc một công thức Toán, bạn nên xem đó là bản nháp thông minh. Bản nháp ấy cần được so với sách giáo khoa, tài liệu chính thống hoặc lời giải của thầy cô.',
        ],
      },
      {
        heading: 'AI có thể sai theo những cách nào?',
        body: [
          'AI có thể bịa nguồn, nhầm công thức, sai đơn vị, lẫn ngày tháng hoặc giải thích thiếu điều kiện quan trọng. Những lỗi này nguy hiểm vì câu trả lời vẫn có thể nghe rất tự tin.',
        ],
        bullets: ['Công thức và phép biến đổi', 'Số liệu, ngày tháng, tên tác giả', 'Nguồn trích dẫn', 'Thông tin mới hoặc cần chuyên môn cao'],
      },
    ],
    callout: {
      title: 'Cẩn thận với câu trả lời quá tự tin',
      body: 'AI có thể hallucinate: tạo ra thông tin sai nhưng trình bày như thật. Tự tin không phải bằng chứng.',
    },
    takeaways: [
      'Hãy xem AI là trợ lý thông minh, không phải chân lý tuyệt đối.',
      'AI giúp học nhanh hơn khi bạn biết kiểm chứng.',
      'Mọi thông tin quan trọng đều cần đối chiếu.',
    ],
  },
  {
    number: 3,
    slug: 'chatgpt-gemini-claude-khac-nhau-the-nao',
    title: 'ChatGPT, Gemini, Claude khác nhau thế nào?',
    tag: 'Công cụ',
    readTime: '7 phút',
    cardDescription: 'Biết chọn công cụ phù hợp thay vì chạy theo công cụ nổi tiếng nhất.',
    goal: 'Hiểu điểm mạnh tương đối của các công cụ AI phổ biến và cách chọn theo nhiệm vụ.',
    intro:
      'Có nhiều công cụ AI miễn phí hoặc có bản miễn phí. Điều quan trọng không phải là công cụ nào đang nổi nhất, mà là công cụ nào phù hợp với việc học bạn đang làm.',
    icon: Sparkles,
    accent: 'orange',
    sections: [
      {
        heading: 'ChatGPT: giải thích, suy luận và luyện từng bước',
        body: [
          'ChatGPT thường hữu ích khi bạn cần giải thích khái niệm, luyện hỏi đáp, viết nháp, sửa cách diễn đạt hoặc học theo từng bước. Nếu bạn yêu cầu rõ ràng, nó có thể đóng vai gia sư kiên nhẫn và đặt câu hỏi ngược lại để kiểm tra hiểu biết.',
          'Ví dụ, bạn có thể yêu cầu: "Hãy giải thích bài này từng bước, dừng lại sau mỗi bước để em tự thử làm tiếp."',
        ],
      },
      {
        heading: 'Gemini và Claude: chọn theo tình huống',
        body: [
          'Gemini hữu ích khi bạn làm việc nhiều trong hệ sinh thái Google hoặc cần hỗ trợ nhanh với nhiều dạng nội dung, tùy phiên bản bạn đang dùng. Claude thường mạnh ở việc đọc văn bản dài, phân tích lập luận và viết tự nhiên.',
          'Các bản miễn phí có thể bị giới hạn về lượt dùng, độ dài, tệp đính kèm hoặc tính năng. Vì vậy, hãy linh hoạt: cùng một mục tiêu học tập có thể thử ở nhiều công cụ rồi so sánh.',
        ],
      },
      {
        heading: 'Prompt rõ quan trọng hơn công cụ bóng bẩy',
        body: [
          'Không có công cụ nào luôn tốt nhất. Một câu hỏi mơ hồ trên công cụ mạnh vẫn cho kết quả mơ hồ. Một prompt rõ ràng trên công cụ miễn phí vẫn có thể giúp bạn học rất ổn.',
        ],
      },
    ],
    callout: {
      title: 'Đừng chạy theo công cụ mới nhất',
      body: 'Công cụ tốt nhất là công cụ phù hợp với việc bạn đang làm và câu hỏi bạn biết đặt rõ.',
    },
    takeaways: [
      'ChatGPT, Gemini và Claude đều có thể hỗ trợ học tập.',
      'Mỗi công cụ có điểm mạnh và giới hạn riêng.',
      'Prompt rõ thường quan trọng hơn việc dùng AI nổi tiếng nhất.',
    ],
  },
  {
    number: 4,
    slug: 'prompt-la-gi',
    title: 'Prompt là gì?',
    tag: 'Kỹ năng hỏi',
    readTime: '6 phút',
    cardDescription: 'Hiểu vì sao cách hỏi quyết định chất lượng câu trả lời.',
    goal: 'Biết prompt là gì và vì sao câu hỏi rõ giúp AI trả lời tốt hơn.',
    intro:
      'Prompt là câu hỏi hoặc chỉ dẫn bạn đưa cho AI. Nếu prompt giống một đề bài mơ hồ, AI rất dễ trả lời lan man. Nếu prompt rõ, AI có nhiều bối cảnh để giúp đúng việc hơn.',
    icon: MessageSquareText,
    accent: 'blue',
    sections: [
      {
        heading: 'Prompt là cách bạn giao nhiệm vụ cho AI',
        body: [
          'Khi bạn viết "giải bài này giúp em", AI không biết bạn học lớp mấy, đang kẹt ở đâu, muốn được gợi ý hay muốn đáp án, cần giải thích ngắn hay chi tiết. Kết quả thường là một lời giải hoàn chỉnh, nhưng chưa chắc giúp bạn hiểu.',
          'Một prompt tốt nói rõ mục tiêu học, bối cảnh và cách AI nên hỗ trợ. Nó giống như bạn giao đề rõ cho một người trợ giảng.',
        ],
      },
      {
        heading: 'So sánh prompt yếu và prompt tốt hơn',
        body: ['Prompt yếu thường thiếu bối cảnh và dễ biến AI thành máy đưa đáp án. Prompt tốt hơn yêu cầu AI hướng dẫn quá trình học.'],
        bullets: [
          'Yếu: "Giải bài này giúp em."',
          'Tốt hơn: "Em học lớp 10, đang học hàm số bậc hai. Hãy hướng dẫn em cách làm từng bước, không đưa đáp án cuối ngay. Sau mỗi bước hãy hỏi em có hiểu không."',
        ],
      },
      {
        heading: 'Bạn hỏi càng rõ, bạn học càng chủ động',
        body: [
          'Khi viết prompt rõ, bạn buộc mình phải nghĩ: mình đang học gì, chưa hiểu phần nào, muốn AI giúp ra sao. Chính bước suy nghĩ này đã là một phần của việc học.',
        ],
      },
    ],
    examplePrompt: {
      label: 'Prompt tốt hơn',
      content:
        'Em học lớp 10, đang học hàm số bậc hai. Hãy hướng dẫn em cách làm từng bước, không đưa đáp án cuối ngay. Sau mỗi bước hãy hỏi em có hiểu không.',
    },
    takeaways: [
      'Prompt là cách bạn giao nhiệm vụ cho AI.',
      'Prompt mơ hồ thường tạo câu trả lời mơ hồ.',
      'Muốn AI trả lời tốt, trước hết mình phải hỏi đủ rõ.',
    ],
  },
  {
    number: 5,
    slug: 'cong-thuc-prompt-4-phan',
    title: 'Công thức prompt 4 phần',
    tag: 'Prompt',
    readTime: '8 phút',
    cardDescription: 'Biết viết prompt có vai trò, bối cảnh, nhiệm vụ và định dạng.',
    goal: 'Nắm công thức 4 phần để viết prompt học tập rõ và dễ dùng.',
    intro:
      'Bạn không cần thuộc một câu thần chú dài để hỏi AI. Chỉ cần nhớ 4 phần: vai trò, bối cảnh, nhiệm vụ và định dạng.',
    icon: ClipboardCheck,
    accent: 'green',
    sections: [
      {
        heading: 'Bốn phần của một prompt tốt',
        body: [
          'Vai trò cho AI biết nên trả lời như ai. Bối cảnh cho AI biết bạn đang học gì và đang ở trình độ nào. Nhiệm vụ nói rõ AI cần làm gì. Định dạng giúp câu trả lời dễ đọc và dễ học lại.',
        ],
        bullets: [
          'Vai trò: "Bạn là gia sư Toán lớp 10."',
          'Bối cảnh: "Em đang học hàm số bậc hai và chưa hiểu đỉnh parabol."',
          'Nhiệm vụ: "Hãy giải thích từng bước bằng ngôn ngữ dễ hiểu."',
          'Định dạng: "Cuối cùng cho 3 bài tự luyện có đáp án kiểm tra."',
        ],
      },
      {
        heading: 'Vì sao công thức này hiệu quả?',
        body: [
          'AI không đọc được suy nghĩ của bạn. Nếu bạn không nói rõ lớp, môn, chương, mục tiêu và dạng câu trả lời mong muốn, AI phải tự đoán. Công thức 4 phần giúp giảm phần đoán đó.',
          'Đặc biệt với học sinh THPT, bối cảnh lớp học và chương trình rất quan trọng. Cùng một khái niệm, cách giải thích cho lớp 10 có thể khác lớp 12.',
        ],
      },
    ],
    examplePrompt: {
      label: 'Prompt mẫu 4 phần',
      content:
        'Bạn là gia sư Toán lớp 10. Em đang học chương Hàm số bậc hai và chưa hiểu cách xác định đỉnh parabol. Hãy giải thích từng bước bằng ngôn ngữ dễ hiểu. Cuối cùng hãy cho em 3 bài tự luyện có đáp án kiểm tra.',
    },
    takeaways: [
      'Prompt tốt gồm vai trò, bối cảnh, nhiệm vụ và định dạng.',
      'Bối cảnh giúp AI bám sát chương trình học hơn.',
      'Prompt tốt giống như giao đề rõ cho một người trợ giảng.',
    ],
  },
  {
    number: 6,
    slug: 'dung-ai-de-hoc-khong-chep-bai',
    title: 'Dùng AI để học bài, không phải chép bài',
    tag: 'Học chủ động',
    readTime: '8 phút',
    cardDescription: 'Biết yêu cầu AI giải thích, gợi mở, kiểm tra thay vì làm hộ.',
    goal: 'Phân biệt dùng AI để học với dùng AI để né suy nghĩ.',
    intro:
      'AI có thể cho bạn một câu trả lời rất nhanh. Nhưng học không chỉ là có câu trả lời. Học là hiểu vì sao, tự làm lại được và biết sửa khi sai.',
    icon: NotebookPen,
    accent: 'orange',
    sections: [
      {
        heading: 'Sản phẩm khác năng lực',
        body: [
          'Nếu AI làm hết, bạn có sản phẩm. Nếu bạn tự làm lại được, bạn có năng lực. Hai thứ này khác nhau rất xa, nhất là khi vào bài kiểm tra không có AI ngồi cạnh.',
          'Dùng AI đúng là yêu cầu nó giải thích khái niệm, gợi ý bước đầu, chỉ ra lỗi sai, tạo bài tương tự hoặc hỏi ngược lại bạn. Những việc đó giúp bạn luyện suy nghĩ thay vì bỏ qua suy nghĩ.',
        ],
      },
      {
        heading: 'Những cách hỏi giúp bạn học thật',
        body: ['Hãy biến AI thành người hướng dẫn quá trình, không phải người nộp bài thay.'],
        bullets: [
          'Hỏi AI giải thích từng bước và dừng lại để bạn thử.',
          'Yêu cầu AI đưa ví dụ tương tự, không đưa đáp án ngay.',
          'Nhờ AI kiểm tra lời giải của bạn và chỉ ra lỗi.',
          'Nhờ AI tạo 3 câu hỏi nhỏ để kiểm tra bạn đã hiểu chưa.',
        ],
      },
    ],
    examplePrompt: {
      label: 'Prompt học chủ động',
      content:
        'Hãy hướng dẫn em từng bước, đừng đưa đáp án cuối ngay. Sau mỗi bước hãy hỏi em tự dự đoán bước tiếp theo.',
    },
    callout: {
      title: 'Một câu đáng nhớ',
      body: 'Đừng dùng AI để né suy nghĩ. Hãy dùng AI để suy nghĩ tốt hơn.',
    },
    takeaways: [
      'AI nên giúp bạn hiểu cách làm, không làm thay.',
      'Xin gợi ý và phản hồi tốt hơn xin đáp án.',
      'Tự làm lại là bước biến câu trả lời thành năng lực.',
    ],
  },
  {
    number: 7,
    slug: 'kiem-chung-thong-tin-ai',
    title: 'Kiểm chứng thông tin AI',
    tag: 'Tư duy phản biện',
    readTime: '7 phút',
    cardDescription: 'Biết đối chiếu câu trả lời AI với sách, tài liệu và nguồn đáng tin cậy.',
    goal: 'Có quy trình kiểm chứng trước khi dùng hoặc nộp nội dung AI hỗ trợ.',
    intro:
      'AI nhanh, nhưng không miễn sai. Kỹ năng kiểm chứng giúp bạn dùng AI mà không bị kéo theo những lỗi nghe rất hợp lý.',
    icon: SearchCheck,
    accent: 'blue',
    sections: [
      {
        heading: 'AI hay sai ở đâu?',
        body: [
          'AI có thể sai với công thức, ngày tháng, số liệu, thống kê, thông tin pháp luật, y tế, thông tin mới hoặc nguồn trích dẫn. Nó cũng có thể bỏ qua điều kiện quan trọng trong sách giáo khoa.',
          'Sai sót nguy hiểm nhất là sai nhưng nghe có vẻ đúng. Vì vậy, bạn không nên nộp trực tiếp nội dung AI tạo ra mà chưa kiểm tra.',
        ],
      },
      {
        heading: 'Quy trình kiểm chứng 3 bước',
        body: ['Bạn có thể dùng một quy trình ngắn trước khi tin hoặc dùng câu trả lời của AI.'],
        bullets: [
          'Bước 1: Đọc câu trả lời và đánh dấu phần quan trọng.',
          'Bước 2: Đối chiếu với SGK, tài liệu chính thống hoặc nguồn đáng tin.',
          'Bước 3: Tự giải thích lại bằng lời của mình để chắc rằng bạn hiểu.',
        ],
      },
      {
        heading: 'Kiểm chứng cũng là học',
        body: [
          'Khi kiểm tra lại một câu trả lời, bạn không chỉ tìm lỗi. Bạn đang luyện khả năng phân biệt điều chắc chắn, điều cần hỏi thêm và điều chưa nên dùng. Đó là kỹ năng học tập rất quan trọng trong thời AI.',
        ],
      },
    ],
    callout: {
      title: 'Trước khi nộp bài',
      body: 'Đừng để AI là người duy nhất đã đọc câu trả lời. Bài nộp vẫn là trách nhiệm của bạn.',
    },
    takeaways: [
      'Tin AI ít thôi, kiểm chứng nhiều hơn một chút.',
      'Công thức, số liệu và nguồn trích dẫn cần được kiểm tra kỹ.',
      'Tự giải thích lại là cách kiểm chứng hiểu biết của chính mình.',
    ],
  },
  {
    number: 8,
    slug: 'khong-phu-thuoc-ai',
    title: 'Không phụ thuộc AI',
    tag: 'Kỷ luật học tập',
    readTime: '7 phút',
    cardDescription: 'Biết dùng AI có kỷ luật và vẫn giữ năng lực tự học.',
    goal: 'Dùng AI như trợ thủ, không biến AI thành bộ não phụ.',
    intro:
      'AI càng tiện, bạn càng dễ hỏi ngay trước khi tự nghĩ. Bài này giúp bạn đặt một vài quy tắc nhỏ để giữ khả năng tự học.',
    icon: ShieldCheck,
    accent: 'green',
    sections: [
      {
        heading: 'Tự nghĩ trước khi hỏi',
        body: [
          'Trước khi hỏi AI, hãy dành 5 đến 10 phút đọc đề, gạch chân dữ kiện và thử đoán hướng làm. Khi bạn biết mình kẹt ở đâu, câu hỏi dành cho AI sẽ rõ hơn nhiều.',
          'Nếu mở AI ngay từ đầu, bạn có thể bỏ qua bước quan trọng nhất: tự hình thành suy nghĩ ban đầu. Bước đó tuy chậm, nhưng là nơi năng lực học tập được tạo ra.',
        ],
      },
      {
        heading: 'Quy tắc dùng AI không phụ thuộc',
        body: ['Bạn có thể áp dụng bộ quy tắc nhỏ này cho hầu hết môn học.'],
        bullets: [
          'Đọc đề trước.',
          'Thử làm trước.',
          'Hỏi AI để gợi ý đúng chỗ kẹt.',
          'Đóng AI và tự làm lại.',
          'Ghi chú bằng lời của mình.',
        ],
      },
      {
        heading: 'Dấu hiệu cần chậm lại',
        body: [
          'Nếu bạn thấy bất an khi làm bài mà không mở AI, hoặc câu nào cũng muốn hỏi AI trước khi nghĩ, đó là dấu hiệu cần giảm tốc. Hãy dùng AI sau khi bạn đã thử một vòng bằng chính mình.',
        ],
      },
    ],
    callout: {
      title: 'Câu ngắn gọn',
      body: 'AI là trợ thủ, không phải não phụ.',
    },
    takeaways: [
      'AI mạnh nhất khi bạn vẫn chủ động.',
      'Hãy thử nghĩ trước 5 đến 10 phút.',
      'Đóng AI và tự làm lại là bước chống phụ thuộc.',
    ],
  },
  {
    number: 9,
    slug: 'ba-tro-ly-ai-trong-eduai-hub',
    title: 'Ba trợ lý AI trong EduAI-Hub',
    tag: 'EduAI-Hub',
    readTime: '6 phút',
    cardDescription: 'Biết khi nào dùng Học tư duy prompt, Gợi ý prompt học tập và Đánh giá prompt.',
    goal: 'Chọn đúng trợ lý AI trong EduAI-Hub theo nhu cầu học tập.',
    intro:
      'EduAI-Hub không chỉ là nơi đọc cẩm nang. Nền tảng còn có các trợ lý giúp bạn luyện cách hỏi, tạo prompt học tập và cải thiện prompt đã có.',
    icon: Zap,
    accent: 'orange',
    sections: [
      {
        heading: 'Trợ lý 1: Học tư duy prompt',
        body: [
          'Dùng trợ lý này khi bạn chưa biết nên hỏi AI như thế nào. Nó giúp bạn hiểu cách đặt mục tiêu, thêm bối cảnh và biến một câu hỏi mơ hồ thành yêu cầu học tập rõ hơn.',
        ],
      },
      {
        heading: 'Trợ lý 2: Gợi ý prompt học tập',
        body: [
          'Dùng khi bạn đã có lớp, môn, bộ sách, chương hoặc bài học cụ thể. Trợ lý sẽ giúp tạo prompt sát với nhu cầu học tập hơn, thay vì một câu hỏi chung chung.',
        ],
      },
      {
        heading: 'Trợ lý 3: Đánh giá prompt của bạn',
        body: [
          'Dùng khi bạn đã viết prompt nhưng câu trả lời AI vẫn mơ hồ, quá dài hoặc lệch mục tiêu. Trợ lý này giúp chỉ ra prompt thiếu vai trò, thiếu bối cảnh, thiếu nhiệm vụ hay thiếu định dạng.',
        ],
        bullets: [
          'Chưa biết hỏi gì: dùng Học tư duy prompt.',
          'Có bài học cụ thể: dùng Gợi ý prompt học tập.',
          'Có prompt rồi nhưng chưa ổn: dùng Đánh giá prompt.',
        ],
      },
    ],
    takeaways: [
      'Chọn đúng trợ lý giúp AI phản hồi sát vấn đề hơn.',
      'Mỗi trợ lý phục vụ một bước khác nhau trong quá trình học.',
      'Prompt có thể được cải thiện dần, không cần hoàn hảo ngay.',
    ],
  },
  {
    number: 10,
    slug: 'quy-trinh-hoc-30-phut-voi-ai',
    title: 'Quy trình học 30 phút với AI',
    tag: 'Thực hành',
    readTime: '8 phút',
    cardDescription: 'Có một quy trình học thực tế để áp dụng ngay.',
    goal: 'Biết tổ chức một buổi học ngắn với AI có mục tiêu, kiểm chứng và tự luyện.',
    intro:
      'Một buổi học với AI không cần dài. Quan trọng là có mục tiêu rõ, biết hỏi đúng, kiểm chứng lại và kết thúc bằng việc bạn tự làm được nhiều hơn trước.',
    icon: Route,
    accent: 'blue',
    sections: [
      {
        heading: 'Quy trình 30 phút',
        body: ['Bạn có thể thử khung thời gian này cho một bài Toán, một đoạn Văn, một chủ đề tiếng Anh hoặc một phần ôn thi.'],
        bullets: [
          '5 phút: đọc bài và xác định chỗ chưa hiểu.',
          '5 phút: viết prompt rõ ràng.',
          '10 phút: học cùng AI và hỏi tiếp.',
          '5 phút: kiểm chứng bằng tài liệu.',
          '5 phút: tự làm lại, ghi chú và lưu prompt hay.',
        ],
      },
      {
        heading: 'Vì sao cần bước tự làm lại?',
        body: [
          'Nếu buổi học kết thúc ngay sau câu trả lời của AI, bạn mới dừng ở mức đọc hiểu. Khi tự làm lại, bạn biến phần đã đọc thành kỹ năng của mình.',
          'Bạn có thể đóng AI, lấy một bài tương tự, tự giải hoặc tự tóm tắt lại khái niệm bằng 5 dòng. Nếu làm được, buổi học đã có kết quả thật.',
        ],
      },
      {
        heading: 'Kết thúc bằng một câu hỏi tự kiểm tra',
        body: [
          'Hãy hỏi chính mình: "Sau buổi học này, mình hiểu hơn điều gì?" Nếu câu trả lời còn mơ hồ, hãy quay lại phần chưa rõ và hỏi AI theo cách cụ thể hơn.',
        ],
      },
    ],
    callout: {
      title: 'Kết bài',
      body: 'Dùng AI tốt không phải là hỏi thật nhiều. Dùng AI tốt là sau buổi học, bạn hiểu hơn trước.',
    },
    takeaways: [
      'Một buổi học AI tốt phải kết thúc bằng năng lực của bạn.',
      'Luôn có bước kiểm chứng và tự làm lại.',
      'Lưu prompt hay để lần sau học nhanh hơn.',
    ],
  },
  {
    number: 11,
    slug: 'bao-mat-dao-duc-va-trach-nhiem-khi-dung-ai',
    title: 'Bảo mật, đạo đức và trách nhiệm khi dùng AI',
    tag: 'An toàn AI',
    readTime: '7 phút',
    cardDescription: 'Biết dùng AI an toàn, không lộ thông tin cá nhân và không biến AI thành công cụ gian lận.',
    goal: 'Biết dùng AI an toàn, minh bạch và có trách nhiệm trong học tập.',
    intro:
      'Dùng AI tốt không chỉ là biết hỏi hay. Bạn còn cần biết điều gì không nên đưa cho AI, khi nào cần minh bạch và vì sao không nên biến AI thành người làm bài bí mật.',
    icon: LockKeyhole,
    accent: 'orange',
    sections: [
      {
        heading: 'Bảo vệ thông tin cá nhân trước đã',
        body: [
          'Khi trò chuyện với AI, bạn chỉ nên đưa những thông tin thật sự cần cho việc học: lớp, môn, chủ đề, phần đang kẹt hoặc mục tiêu bài làm. Không nên nhập số điện thoại, địa chỉ nhà, mật khẩu tài khoản, mã học sinh, thông tin riêng tư của gia đình hoặc tài liệu cá nhân nhạy cảm.',
          'Một nguyên tắc dễ nhớ: nếu thông tin đó bạn không muốn đăng công khai trước lớp, hãy cân nhắc thật kỹ trước khi đưa vào bất kỳ công cụ AI nào.',
        ],
      },
      {
        heading: 'Đạo đức học tập quan trọng hơn câu trả lời đẹp',
        body: [
          'AI có thể giúp bạn nghĩ ý tưởng, lập dàn ý, kiểm tra lỗi, cải thiện câu chữ hoặc tạo bài luyện tập. Nhưng copy nguyên văn đầu ra của AI rồi nộp như bài hoàn toàn của mình là không trung thực và cũng làm bạn mất cơ hội học thật.',
          'Trong kiểm tra, thi cử hoặc những bài có quy định rõ, dùng AI để vượt qua yêu cầu học tập là gian lận. Điểm số có thể qua một lần, nhưng năng lực thì không đi cùng.',
        ],
      },
      {
        heading: 'Dùng AI minh bạch và có trách nhiệm',
        body: [
          'Nếu AI được dùng để brainstorming, lập dàn ý, kiểm tra lỗi hoặc cải thiện bài viết, hãy trung thực theo đúng quy định của lớp học. Bạn có thể nói rõ AI hỗ trợ phần nào, còn phần suy nghĩ, chọn lọc và viết lại vẫn là của bạn.',
          'Cách hỏi tốt là yêu cầu AI giúp bạn hiểu và cải thiện, không yêu cầu AI âm thầm làm toàn bộ thay bạn.',
        ],
        bullets: [
          'Không gửi thông tin cá nhân nhạy cảm.',
          'Không nộp nguyên văn câu trả lời AI như bài của mình.',
          'Không dùng AI để gian lận trong kiểm tra hoặc thi cử.',
          'Dùng AI để nhận phản hồi, không để trốn việc học.',
        ],
      },
    ],
    examplePrompt: {
      label: 'Prompt có trách nhiệm',
      content:
        'Em muốn tự viết đoạn văn này. Hãy giúp em kiểm tra bố cục, chỉ ra phần chưa rõ và gợi ý cách cải thiện. Đừng viết lại toàn bộ bài thay em.',
    },
    callout: {
      title: 'Câu hỏi đạo đức',
      body: 'AI có thể giúp bạn học tốt hơn, nhưng cách bạn dùng AI mới quyết định nó là công cụ học tập hay công cụ gian lận.',
    },
    takeaways: [
      'Không đưa thông tin cá nhân nhạy cảm cho AI.',
      'Không copy nguyên văn để nộp bài.',
      'Dùng AI minh bạch, có trách nhiệm và phục vụ việc học thật.',
    ],
  },
  {
    number: 12,
    slug: 'bien-ai-thanh-he-thong-tu-hoc-ca-nhan',
    title: 'Biến AI thành hệ thống tự học cá nhân',
    tag: 'Hệ thống học tập',
    readTime: '8 phút',
    cardDescription: 'Biết kết hợp EduAI-Hub, prompt hay, bản đồ chương trình và dashboard để tự học bền vững.',
    goal: 'Xây một thói quen tự học với AI có phương pháp, có lưu trữ và có tự kiểm tra.',
    intro:
      'Bài cuối là bài tổng hợp. Dùng AI tốt không phải là tìm được một prompt thần kỳ, mà là xây được một hệ thống học đều đặn: biết hỏi, biết lưu, biết kiểm chứng và biết cải thiện qua từng lần học.',
    icon: Route,
    accent: 'green',
    sections: [
      {
        heading: 'Một prompt tốt rất hữu ích, nhưng một hệ thống học tốt còn mạnh hơn',
        body: [
          'Nếu chỉ có một prompt hay, bạn có thể học tốt trong một buổi. Nếu có một hệ thống, bạn có thể học tốt hơn qua nhiều tuần: biết bài nào cần học, dùng trợ lý nào, prompt nào hiệu quả, lỗi nào hay gặp và lần sau nên hỏi khác đi ra sao.',
          'EduAI-Hub được thiết kế để gom các phần đó lại: cẩm nang giúp hiểu phương pháp, Công Cụ AI giúp chọn đúng trợ lý, Kho Prompt giúp lưu câu hỏi hay, Bản đồ chương trình giúp thêm bối cảnh lớp/môn/bài, còn Dashboard giúp biến việc học thành phiên học thật.',
        ],
      },
      {
        heading: 'Quy trình tự học cá nhân với AI',
        body: ['Bạn có thể dùng quy trình này cho một bài học nhỏ hoặc một buổi ôn tập dài hơn.'],
        bullets: [
          'Chọn một bài học hoặc vấn đề cụ thể.',
          'Tạo prompt có bối cảnh rõ.',
          'Học cùng AI nhưng vẫn tự ghi chú.',
          'Kiểm chứng bằng tài liệu hoặc sách.',
          'Lưu prompt tốt vào Kho Prompt.',
          'Dùng lại và cải thiện prompt ở lần học sau.',
        ],
      },
      {
        heading: 'Cải thiện dần qua mỗi lần học',
        body: [
          'Sau mỗi phiên học, hãy tự hỏi: prompt nào giúp mình hiểu nhanh hơn, câu hỏi nào quá mơ hồ, phần nào AI trả lời chưa đáng tin và mình đã kiểm chứng ra sao. Những ghi chú nhỏ này giúp bạn dùng AI ngày càng sắc hơn.',
          'Mục tiêu cuối cùng không phải là hỏi AI thật nhiều. Mục tiêu là sau mỗi lần học, bạn hiểu rõ hơn, tự làm tốt hơn và ít phụ thuộc hơn.',
        ],
      },
    ],
    callout: {
      title: 'Bài cuối, nhưng là điểm bắt đầu',
      body: 'AI không tự biến bạn thành học sinh giỏi. Nhưng nếu bạn có hệ thống, AI có thể giúp bạn tiến bộ nhanh hơn mỗi ngày.',
    },
    takeaways: [
      'Một prompt tốt rất hữu ích, nhưng một hệ thống học tốt còn mạnh hơn.',
      'EduAI-Hub giúp gom lại cách hỏi, cách học, cách lưu prompt và cách tự kiểm tra.',
      'Mục tiêu cuối cùng là bạn học chủ động hơn, không phụ thuộc hơn.',
    ],
  },
];

export function getGuideLesson(slug?: string) {
  return guideLessons.find((lesson) => lesson.slug === slug);
}

export function getAdjacentGuideLessons(slug?: string) {
  const index = guideLessons.findIndex((lesson) => lesson.slug === slug);
  return {
    previous: index > 0 ? guideLessons[index - 1] : undefined,
    next: index >= 0 && index < guideLessons.length - 1 ? guideLessons[index + 1] : undefined,
  };
}
