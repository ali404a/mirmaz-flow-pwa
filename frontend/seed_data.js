const fs = require('fs');
const tasksData = [
  {
    title: "عقيل الزبيدي", brief: "", date: "", time: "",
    caption: "كابشن \nجانب من تغطية منصة مرماز للامتحان التجريبي الثاني للأستاذ عقيل الزبيدي، عرّاب اللغة العربية.\nتمثّلت هذه التغطية بأفضل مستويات الجودة من ناحية التنظيم، وتقديم أسئلة مركّزة تعزّز ثقة الطالب بالامتحان \nالوزاري\n\nتايتل| الامتحان التجريبي الثاني | الاستاذ عقيل الزبيدي",
    thumbnail: "https://drive.google.com/drive/folders/1hHq6HWOi0_czxf2Nj3_t6LIh1bhWzKZO?usp=share_link",
    video: "https://drive.google.com/file/d/1jJ1lDN9yWV7hQ7wfbRPZz3uvWeZ6vGbn/view?usp=share_link",
    deadline: "", approval: "FALSE", comments: "سيتم تحديد مواعيد النشر بعد تغطية الامتحانات", update: "Rejected"
  },
  {
    title: "نور الدين الدليمي", brief: "", date: "", time: "",
    caption: "كابشن \nتغطية منصة مرماز لتجمع  طلبة الأستاذ نور الدين الدليمي لوضع خطة واضحة نحو التفوق في الكيمياء.\nبالتنظيم والترتيب والمتابعة المستمرة، يبدأ طريق التفوق.\n\nتايتل\nتجمع طلبة الاستاذ نور الدين الدليمي",
    thumbnail: "https://drive.google.com/drive/folders/1b2Gzq_fWIRQE1XO3Ty_cVl1u-Zwj_MH-?usp=share_link",
    video: "https://drive.google.com/file/d/1syp2CVtI_b0zETclxzDoFm7OHDc6CU3Z/view?usp=share_link",
    deadline: "تم النشر", approval: "FALSE", comments: "سيتم تحديد مواعيد النشر بعد تغطية الامتحانات", update: "ننشره اليوم الساعة 7 على الاكاديمي + collab مع الاستاذ 07/07/2026"
  },
  {
    title: "محمد النداوي", brief: "", date: "", time: "",
    caption: "كابشن |\nبأجواء كلها طاقة وإيجابية، جمع الأستاذ محمد النداوي أبطاله. حتى نترجم الخوف من اللغة الانكليزية إلى ثقة،\n ونرسم طريق الـ 100 بأسلوب يخلي الدراسة ممتعة.\n\nتايتل |\nتجمع طلبة أ. محمد النداوي | مادة اللغة الانكليزية",
    thumbnail: "https://drive.google.com/drive/folders/1HubpL1hepx8nUCL6OdWFXpZX0Y3EQN3S?usp=share_link",
    video: "https://drive.google.com/file/d/1uymwmOVV6QuLs7ZF1UJ-z88YqgjmKDeM/view?usp=share_link",
    deadline: "تم النشر", approval: "TRUE", comments: "سيتم تحديد مواعيد النشر بعد تغطية الامتحانات", update: "ننشره اليوم الساعة 7 على الاكاديمي + collab مع الاستاذ"
  },
  {
    title: "مؤمل مهدي", brief: "", date: "", time: "",
    caption: "كابشن|\nالتفوق بالرياضيات ما يجي بالصدفة، يحتاج فهم وتدريب وخطة صحيحة.\nومن هذا المنطلق، التقى الأستاذ مؤمل مهدي بطلبة الموصل لدعمهم معنوياً ومشاركتهم خطوات عملية نحو التميز والتفوق في الرياضيات. \n\nتايتل |\nتجمع طلبة أ.مؤمل مهدي مادة الرياضيات | موصل",
    thumbnail: "https://drive.google.com/drive/folders/1DkwMMoml2WT_LieTDDUNHupGOhRsrGJi?usp=share_link",
    video: "https://drive.google.com/file/d/1xDhLTdEaZ1EManDyTyweX2SFen0NkYZh/view?usp=sharing",
    deadline: "تم النشر ", approval: "TRUE", comments: "سيتم تحديد مواعيد النشر بعد تغطية الامتحانات", update: ""
  },
  {
    title: "علي الذهبي  مرماز زون", brief: "", date: "", time: "",
    caption: "كابشن| لان  الـ 100 ما تجي بالصدفة.. تجي بالدعم والتنظيم العالي! \nبأجواء كلها حماس وطاقة إيجابية، جمع الأستاذ علي الذهبي طلابه، لوضع خطة تضمن لكل طالب الوصول للدرجة الكاملة في الفيزياء.\nتايتل \n1\\تجمع طلبة أ.علي الذهبي | مادة الفيزياء\n2\\الملتقى الأول لطلبة الأستاذ علي الذهبي | رحلة الـ 100 في الفيزياء",
    thumbnail: "https://drive.google.com/drive/folders/1S0nZsWiGEbGL0vcbwFP3oK0UnCYt1fN0?usp=share_link",
    video: "https://drive.google.com/file/d/1sosRNj_vpnCagGHyA28j7yyBAnoIuKgO/view?usp=sharing",
    deadline: "تم التحديث", approval: "FALSE", comments: "سيتم تحديد مواعيد النشر بعد تغطية الامتحانات", update: "ننشره الخميس الساعة 7 على الاكاديمي + collab مع الاستاذ 09.07.2026"
  },
  {
    title: "نماذج وكلاء", brief: "يرجى اختيار نموذج قالب وكلاء", date: "", time: "",
    caption: "", thumbnail: "https://drive.google.com/file/d/10qn8qFWaYRQlDG3VLnWe3waZyoIjZZIK/view?usp=share_link",
    video: "https://drive.google.com/drive/folders/1LZZk3wWI2SqSXTunh3kAvK3XGGs8V-29?usp=share_link",
    deadline: "تم النشر + رفض تصميم كبريت", approval: "TRUE", comments: "اللوكو low rez, يحتاج تعديل الصورة الثالثة بوكس الاسعار بي هوايه الوان", update: "تم تعديل الصورة الثالثة"
  },
  {
    title: "تيزر علي الذهبي  lzone", brief: "", date: "", time: "",
    caption: "تايتل| \nقريبا \nكابشن| \nقريبا ",
    thumbnail: "https://drive.google.com/drive/folders/1V1-xVPFO0xD-HMnyz0JTOApc3NVx1kIW?usp=share_link",
    video: "https://drive.google.com/drive/folders/1j0K5yVAKKdgKhHTB8AsqEz9BD8uAIlT-?usp=sharing",
    deadline: "تم النشر", approval: "FALSE", comments: "التيزر مايصير كولاب مع الاستاذ", update: "ننشره الجمعة الساعة 7 على الاكاديمي + collab مع الاستاذ 10.09.2026"
  },
  {
    title: "tvc علي الذهبي zone", brief: "", date: "", time: "",
    caption: "تايتل|\nكل بعد فيزيائي الة أ. علي الذهبي \n\nكابشن|\nقوانين الفيزياء تفهمها من تشوفها كدامك! \nويه الأستاذ علي الذهبي راح تفهم، تربط، وتحلل الفيزياء.. وتضمن التفوق.",
    thumbnail: "https://drive.google.com/drive/folders/1H2LTxZEYYtZ0EITbcYv9QOPOUZ5qUBlF?usp=share_link",
    video: "https://drive.google.com/drive/folders/1j0K5yVAKKdgKhHTB8AsqEz9BD8uAIlT-?usp=share_link",
    deadline: "تم النشر", approval: "FALSE", comments: "الثمبنيل تتغير الصور تم تغير الثمبنيل ", update: "ننشره الاثنين الساعة 7 على الاكاديمي + collab مع الاستاذ 13.07.2026"
  },
  {
    title: "صور الاساتذة", brief: "تغيير صور الهايلايت لاساتذة مرماز اكاديمي على الهوية البصرية", date: "", time: "",
    caption: "", thumbnail: "https://drive.google.com/drive/folders/1jRsoMo4L1ZEDE_WGkmQK2w31LWcWWR4O?usp=share_link", video: "",
    deadline: "تم النشر ", approval: "TRUE", comments: "Approved", update: ""
  },
  {
    title: "توب فيو", brief: "", date: "", time: "",
    caption: "تايتل|\nطريق الـ 100 يبدأ من مرماز اكاديمي\nكابشن|\nطرق هواية لل100 بس افضلهم ويه مرماز اكاديمي",
    thumbnail: "https://drive.google.com/file/d/1x737MWix9TlnYT0AmdX_gDtMNB5CFi8E/view?usp=share_link\nhttps://drive.google.com/file/d/1YHwyPaBo5PNfMjm47w5MfXc_wpBNWfZP/view?usp=share_link",
    video: "https://drive.google.com/file/d/1ao3In75apIJSuElQGwOX7-BLOuK-COeE/view?usp=share_link",
    deadline: "", approval: "FALSE", comments: "pause", update: ""
  },
  {
    title: "نادي المتفوقين", brief: "", date: "", time: "",
    caption: "تايتل|\nاختيار نموذج\n   ١- من الحيرة للوضوح… مرماز توصلك\n    ٢-من الحيرة للتفوق… مرماز توصلك\nكابشن|\nالحيرة موجودة بكل رحلة… بس مو ويه مرماز. \nكلشي تحتاجه للسادس بمكان واحد، حتى تركز على هدفك وتوصل للتفوق.",
    thumbnail: "https://drive.google.com/file/d/1UgqAwxVHL8CpSvCt7AqMAj6S8HcTP2eG/view?usp=share_link\n https://drive.google.com/file/d/1RLvhzr1zkokOBR5JdOY0DtQQwAMT3P9M/view?usp=share_link",
    video: "https://drive.google.com/file/d/157HIxTIq1otAIj2LPPjWeyvPcR4_6eG4/view?usp=share_link",
    deadline: "", approval: "FALSE", comments: "pause", update: ""
  },
  {
    title: "فيديو رحلة السادس", brief: "", date: "", time: "",
    caption: "تايتل|\nرحلة السادس احلى ويه مرماز\nكابشن|\nالتحديات موجودة، والطريق مو دائماً سهل. بس كل لحظه برحلتك هسة، هي البداية لقصة نجاحك بعدين.",
    thumbnail: "https://drive.google.com/file/d/1ZTjxUdOK9GadpDzX2hOSNFKOurEW66ZN/view?usp=share_link",
    video: "https://drive.google.com/drive/folders/1QvelX3MsnOZFqzrVXwuYCk-4FwNJAu_l?usp=share_link",
    deadline: "", approval: "FALSE", comments: "pause", update: "تم التحديث"
  },
  {
    title: "Live", brief: "", date: "", time: "",
    caption: "كابشن|\nكل شي تحتاجه حتى تضمن التفوق والدرجة الكاملة صار موجود بمكان واحد.. \"نادي مرماز السري للمتفوقين\"\nبطاقتك صارت جاهزة وتنتظرك حتى تفتحلك افاق التفوق والأسرار اللي تخليك دائماً بالقمة.\n\nتايتل |\nالدخول.. للمتفوقين فقط",
    thumbnail: "https://drive.google.com/file/d/1gp-EabLVlZ9nTMcUfyjExaqG7DpebuQJ/view?usp=share_link",
    video: "https://drive.google.com/drive/folders/1I7BgCS0c1dCcZ2rznsVd4DwOkkGmAFFe",
    deadline: "", approval: "FALSE", comments: "pause", update: ""
  },
  {
    title: "Weekly report- digital", brief: "", date: "", time: "",
    caption: "", thumbnail: "", video: "", deadline: "", approval: "FALSE", comments: "Assigned to hassan, please set the timeline to be delivered each WED", update: "i need the latest update please "
  },
  {
    title: "July CC-Academy", brief: "", date: "", time: "",
    caption: "", thumbnail: "https://docs.google.com/presentation/d/1TWcyqAO7boaIpNbJzVCv25NGynK9aier/edit?usp=sharing&ouid=103175723286719805649&rtpof=true&sd=true",
    video: "https://canva.link/x09vzj50k60av45 فكرة اعلان الصبغ",
    deadline: "July 6th", approval: "FALSE", comments: "Start work on the topics and visual direction for July", update: "تم الرفع + تم التحديث"
  },
  {
    title: "July CC-Zone", brief: "", date: "", time: "", caption: "", thumbnail: "", video: "",
    deadline: "July 6th", approval: "FALSE", comments: "Start work on the topics and visual direction for July", update: "موعد التسليم 7/13"
  },
  {
    title: "Summer Campaign-Zone", brief: "", date: "", time: "", caption: "", thumbnail: "https://drive.google.com/drive/folders/1F965oi_HUqakDc70gnDNS0CdAmhpheAE?usp=share_link", video: "",
    deadline: "", approval: "TRUE", comments: "What is the update?", update: "تم نشر جميع فديوهات الحملة"
  },
  {
    title: "BB Designs", brief: "The goal is to launch an outdoor advertising campaign...", date: "", time: "", caption: "",
    thumbnail: "https://canva.link/fozi3gc8ql66t0p", video: "https://drive.google.com/drive/folders/1UIO3Mi0QwrViCP-RFIuB47V_PtpcspzD?usp=sharing",
    deadline: "July 7th", approval: "FALSE", comments: "Coordinate with Jaefar to create the messages and visual direction", update: "تم الرفع + تم رفع نموذج البلبورد"
  },
  {
    title: "الفيديو الجماعي الاول", brief: "", date: "", time: "",
    caption: "كابشن |  كل خطوة اليوم...\nتقربك من المية باجر. \n\nابدأ صح وسجل بالدورة الصيفية الثانية مع نخبة أساتذة مرماز، وخلي قرارك اليوم هو التفوق.\n\n#متحتاج_الـVAR_الـ100_قرار \n\n\nتايتل | المية تبدأ من قرار",
    thumbnail: "https://drive.google.com/drive/folders/1G1dPaGiSHSD6KfkB5oXFu-yYXZr--vC0?usp=share_link",
    video: "https://drive.google.com/drive/folders/1_4mFHtYYqEHyjhqjaBavKqU6C92yIvOr?usp=sharing https://drive.google.com/file/d/1l7pPFT0u8l8Kja_OtQZLM6o3KpXaMGD1/view?usp=sharing",
    deadline: "تم النشر", approval: "FALSE", comments: "", update: "تم التحديث على قياس الريلز"
  },
  {
    title: "الفيديو الجماعي الثاني", brief: "", date: "", time: "",
    caption: "التفوق ما يجي صدفة... يجي بخطوة. \n\nواليوم... دورك تاخذها.\n\nسجّل هسة مع نخبة من افضل اساتذة العراق \n بمرماز اكاديمي، وابدأ رحلتك للمعدل العالي.\nــــــــ\nتايتل |   التفوق ما يجي صدفة  يجي بخطوة .",
    thumbnail: "https://drive.google.com/drive/folders/1G1dPaGiSHSD6KfkB5oXFu-yYXZr--vC0?usp=share_link",
    video: "https://drive.google.com/file/d/1KDEr4AKd1wawAFuOrczsJX-1CGM_dnyT/view?usp=drive_link https://drive.google.com/file/d/1JX8FLpbE1kcZAUXOSzA6S3vQVxFrKkIS/view?usp=drive_link",
    deadline: "تم التحديث", approval: "FALSE", comments: "Rejected", update: "Rejected"
  },
  {
    title: "Qi card installment campaign", brief: "Brief is shared", date: "", time: "", caption: "",
    thumbnail: "https://canva.link/i79y8za9wnecbjn", video: "", deadline: "July 12th", approval: "FALSE", comments: "", update: "تم الرفع"
  },
  {
    title: "zone ideas", brief: "", date: "", time: "", caption: "",
    thumbnail: "https://canva.link/4re2ebzv7k277gg", video: "تم الرفع لكبريت", deadline: "", approval: "FALSE", comments: "", update: ""
  },
  {
    title: "كاروسيل تنظيم وقت الدراسه", brief: "", date: "", time: "",
    caption: "كابشن |\nجربت هذه الطريقة من قبل؟ أو عندك طريقتك الخاصة؟", thumbnail: "https://drive.google.com/drive/folders/11wkiq4AWfsFgBuMFMeJxa1p6FOp8IkBL?usp=drive_link", video: "",
    deadline: "", approval: "FALSE", comments: "", update: "On hold"
  },
  {
    title: "تغطية الية امتحان مرماز زون", brief: "", date: "", time: "",
    caption: "من أول مرة تدخل أجواء الوزاري… إذا جنت ويه مرماز.\n\nبامتحانات مرماز نوفر تجربة تحاكي الامتحان الوزاري من كل النواحي:\n📄 دفتر امتحاني مطابق للدفتر الوزاري\n✍️ أسئلة وزارية\n👨🏫 مراقبة حقيقية\n✅ تصحيح وفق المعايير الوزارية\n\nحتى تدخل الامتحان بثقة، لأنك عشت التجربة الحقيقية.\n\nاختار صح… واكتب مستقبلك بيدك.\n\n#أني_مرماز_وأنت.\n\nتايتل\n    ليش امتحانات مرماز مختلفة؟",
    thumbnail: "", video: "https://drive.google.com/file/d/1f1TfIpKqHejuNgpkTvUV4vyuTmxHyh2z/view?usp=sharing",
    deadline: "July 11th", approval: "FALSE", comments: "", update: "تم النشر"
  },
  {
    title: "تغطية امتحان احمد النداوي", brief: "", date: "", time: "", caption: "", thumbnail: "", video: "", deadline: "July 12th", approval: "FALSE", comments: "", update: "in progress"
  },
  {
    title: "BTS Zone", brief: "", date: "", time: "",
    caption: "تايتل |\nأفضل الأساتذة… بمكان واحد\nكابشن |\nطلاب دفعة 2027.. \nكل أستاذ قدّم خلاصة خبرته وسنوات عطائه حتى يضمن إلك أفضل بداية ممكنة\n🎯شرح واضح ومفهوم.\n💡خطة مدروسة تقضي على التراكمات.\n📝 متابعة دقيقة تضمن مستواك.\n\nسجل هسه بالدورة الصيفية الثانية واضمن ال100",
    thumbnail: "https://drive.google.com/drive/folders/1w1VcBrabAfRcCIvS1Bo0v2EiHcKc8kRw?usp=sharing",
    video: "https://drive.google.com/drive/folders/1RiFXJmsSnlBjLWIA0Nhv0Q3pwbBuQwdf?usp=share_link",
    deadline: "", approval: "FALSE", comments: "", update: "Approved, يتم نشرة يوم 14.07.2026"
  },
  {
    title: "فيديو التقليد", brief: "", date: "", time: "", caption: "", thumbnail: "https://canva.link/au4teoj7zketw1h", video: "", deadline: "", approval: "FALSE", comments: "", update: ""
  },
  {
    title: "Aug CC-Academy", brief: "", date: "", time: "", caption: "", thumbnail: "Jaafer", video: "", deadline: "July 18th", approval: "FALSE", comments: "", update: ""
  },
  {
    title: "Aug CC-Zone", brief: "", date: "", time: "", caption: "", thumbnail: "Riam", video: "", deadline: "July 18th", approval: "FALSE", comments: "", update: ""
  },
  {
    title: "cutdown aqeel", brief: "", date: "", time: "",
    caption: "كابشن + تايتل الكت الاول \nتايتل |\nطريقك لأعلى الدرجات | أ.عقيل الزبيدي\nكابشن |\nاعلى درجة تتحقق من تكون ويه عراب اللغة العربية الاستاذ عقيل الزبيدي\n———————\nكابشن +تايتل الكت الثاني \nتايتل |\nاختيار المتفوقين | أ.عقيل الزبيدي\nكابشن |\nسهل تكون من المتفوقين من تختار الاستاذ عقيل الزبيدي",
    thumbnail: "https://drive.google.com/drive/folders/1mka-b_U79ESaGS0b8KS28Kmw4fgH0Xal?usp=sharing",
    video: "https://drive.google.com/drive/folders/1gr6KC4FO9y1WoWpR1pmnov5jUBRxWTdN?usp=sharing",
    deadline: "", approval: "FALSE", comments: "", update: ""
  },
  {
    title: "نموذج بوستات النتائج", brief: "", date: "", time: "", caption: "",
    thumbnail: "https://drive.google.com/drive/folders/1vq_w-0zhRYFbgLNyjnCHOQj9pZBNklYs?usp=sharing", video: "",
    deadline: "", approval: "FALSE", comments: "نحتاج فكرة بوست لشخص ديشوف النتائج بالتليفون وتطلع نتيجته ناجح واهله حواليه فرحانين .... نستخدم اشخاص بدال التميمة ", update: ""
  }
];

const builtTasks = tasksData.map((d, i) => {
  return {
    id: 's' + i + Date.now(),
    title: d.title,
    desc: d.brief,
    brand: d.title.includes('zone') || d.title.includes('زون') ? 'zone' : 'academy',
    isPartnership: false,
    priority: 'normal',
    due: d.deadline,
    sheetApproval: d.approval,
    sheetUpdate: d.update,
    coordNote: d.comments,
    stages: [
      { id: 's' + i + '1', title: 'كتابة المحتوى', kind: 'caption', text: d.caption, state: 'done', person: 'u4' },
      { id: 's' + i + '2', title: 'التصميم', kind: 'design', link: d.thumbnail, state: 'done', person: 'u5' },
      { id: 's' + i + '3', title: 'المونتاج', kind: 'video', link: d.video, state: 'done', person: 'u6' },
      { id: 's' + i + '4', title: 'النشر', isPublish: true, publishDate: d.date, publishTime: d.time, state: 'todo', person: 'u2' }
    ]
  };
});

fs.writeFileSync('seeded_tasks.json', JSON.stringify(builtTasks, null, 2));
console.log('Seeded tasks written to seeded_tasks.json');
