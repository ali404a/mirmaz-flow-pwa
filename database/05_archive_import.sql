-- =====================================================================
-- mirmaz FLOW — أرشيف المهام الحقيقية (اختياري)
-- الإصدار 2.0
--
-- هذا الملف يستورد 31 مهمة حقيقية كانت مضمّنة في index.html
-- (أساتذة، كابشنات، وروابط درايف فعلية).
--
-- شغّله فقط إن أردت استعادة الأرشيف. النظام يعمل بدونه.
-- المتطلب: 04_accounts.sql (يحتاج كوردنيتر موجوداً)
--
-- ⚠ تنبيه أمني: يحتوي 44 رابط Google Drive / Canva كانت مكشوفة
--   في الـHTML العام. راجع صلاحيات مشاركتها قبل الاعتماد عليها.
--
-- ملاحظات التحويل:
--   - المراحل القديمة 'todo' -> 'pending'
--   - المهام القديمة بلا مرحلة مراجعة/موافقة: تُضاف تلقائياً بحالة pending
--   - due القديم كان نصاً حراً ("تم النشر") -> نُقل إلى coord_note، وdue_date = null
-- =====================================================================

do $$
declare
  v_coord uuid;
  v_task  uuid;
begin
  select id into v_coord from public.profiles where role = 'coordinator' limit 1;
  if v_coord is null then
    raise exception 'شغّل 04_accounts.sql أولاً — لا يوجد كوردنيتر';
  end if;


  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('عقيل الزبيدي', '', 'academy', 'normal',
          false, v_coord, v_coord, 'سيتم تحديد مواعيد النشر بعد تغطية الامتحانات — [تحديث: Rejected]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن 
جانب من تغطية منصة مرماز للامتحان التجريبي الثاني للأستاذ عقيل الزبيدي، عرّاب اللغة العربية.
تمثّلت هذه التغطية بأفضل مستويات الجودة من ناحية التنظيم، وتقديم أسئلة مركّزة تعزّز ثقة الطالب بالامتحان 
الوزاري

تايتل| الامتحان التجريبي الثاني | الاستاذ عقيل الزبيدي', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1hHq6HWOi0_czxf2Nj3_t6LIh1bhWzKZO?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1jJ1lDN9yWV7hQ7wfbRPZz3uvWeZ6vGbn/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('نور الدين الدليمي', '', 'academy', 'normal',
          false, v_coord, v_coord, 'سيتم تحديد مواعيد النشر بعد تغطية الامتحانات — [الموعد الأصلي: تم النشر] — [تحديث: ننشره اليوم الساعة 7 على الاكاديمي + collab مع الاستاذ 07/07/2026]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن 
تغطية منصة مرماز لتجمع  طلبة الأستاذ نور الدين الدليمي لوضع خطة واضحة نحو التفوق في الكيمياء.
بالتنظيم والترتيب والمتابعة المستمرة، يبدأ طريق التفوق.

تايتل
تجمع طلبة الاستاذ نور الدين الدليمي', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1b2Gzq_fWIRQE1XO3Ty_cVl1u-Zwj_MH-?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1syp2CVtI_b0zETclxzDoFm7OHDc6CU3Z/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('محمد النداوي', '', 'academy', 'normal',
          false, v_coord, v_coord, 'سيتم تحديد مواعيد النشر بعد تغطية الامتحانات — [الموعد الأصلي: تم النشر] — [تحديث: ننشره اليوم الساعة 7 على الاكاديمي + collab مع الاستاذ]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن |
بأجواء كلها طاقة وإيجابية، جمع الأستاذ محمد النداوي أبطاله. حتى نترجم الخوف من اللغة الانكليزية إلى ثقة،
 ونرسم طريق الـ 100 بأسلوب يخلي الدراسة ممتعة.

تايتل |
تجمع طلبة أ. محمد النداوي | مادة اللغة الانكليزية', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1HubpL1hepx8nUCL6OdWFXpZX0Y3EQN3S?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1uymwmOVV6QuLs7ZF1UJ-z88YqgjmKDeM/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('مؤمل مهدي', '', 'academy', 'normal',
          false, v_coord, v_coord, 'سيتم تحديد مواعيد النشر بعد تغطية الامتحانات — [الموعد الأصلي: تم النشر]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن|
التفوق بالرياضيات ما يجي بالصدفة، يحتاج فهم وتدريب وخطة صحيحة.
ومن هذا المنطلق، التقى الأستاذ مؤمل مهدي بطلبة الموصل لدعمهم معنوياً ومشاركتهم خطوات عملية نحو التميز والتفوق في الرياضيات. 

تايتل |
تجمع طلبة أ.مؤمل مهدي مادة الرياضيات | موصل', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1DkwMMoml2WT_LieTDDUNHupGOhRsrGJi?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1xDhLTdEaZ1EManDyTyweX2SFen0NkYZh/view?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('علي الذهبي  مرماز زون', '', 'zone', 'normal',
          false, v_coord, v_coord, 'سيتم تحديد مواعيد النشر بعد تغطية الامتحانات — [الموعد الأصلي: تم التحديث] — [تحديث: ننشره الخميس الساعة 7 على الاكاديمي + collab مع الاستاذ 09.07.2026]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن| لان  الـ 100 ما تجي بالصدفة.. تجي بالدعم والتنظيم العالي! 
بأجواء كلها حماس وطاقة إيجابية، جمع الأستاذ علي الذهبي طلابه، لوضع خطة تضمن لكل طالب الوصول للدرجة الكاملة في الفيزياء.
تايتل 
1\تجمع طلبة أ.علي الذهبي | مادة الفيزياء
2\الملتقى الأول لطلبة الأستاذ علي الذهبي | رحلة الـ 100 في الفيزياء', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1S0nZsWiGEbGL0vcbwFP3oK0UnCYt1fN0?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1sosRNj_vpnCagGHyA28j7yyBAnoIuKgO/view?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('نماذج وكلاء', 'يرجى اختيار نموذج قالب وكلاء', 'academy', 'normal',
          false, v_coord, v_coord, 'اللوكو low rez, يحتاج تعديل الصورة الثالثة بوكس الاسعار بي هوايه الوان — [الموعد الأصلي: تم النشر + رفض تصميم كبريت] — [تحديث: تم تعديل الصورة الثالثة]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/file/d/10qn8qFWaYRQlDG3VLnWe3waZyoIjZZIK/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1LZZk3wWI2SqSXTunh3kAvK3XGGs8V-29?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('تيزر علي الذهبي  lzone', '', 'zone', 'normal',
          false, v_coord, v_coord, 'التيزر مايصير كولاب مع الاستاذ — [الموعد الأصلي: تم النشر] — [تحديث: ننشره الجمعة الساعة 7 على الاكاديمي + collab مع الاستاذ 10.09.2026]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'تايتل| 
قريبا 
كابشن| 
قريبا', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1V1-xVPFO0xD-HMnyz0JTOApc3NVx1kIW?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1j0K5yVAKKdgKhHTB8AsqEz9BD8uAIlT-?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('tvc علي الذهبي zone', '', 'zone', 'normal',
          false, v_coord, v_coord, 'الثمبنيل تتغير الصور تم تغير الثمبنيل — [الموعد الأصلي: تم النشر] — [تحديث: ننشره الاثنين الساعة 7 على الاكاديمي + collab مع الاستاذ 13.07.2026]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'تايتل|
كل بعد فيزيائي الة أ. علي الذهبي 

كابشن|
قوانين الفيزياء تفهمها من تشوفها كدامك! 
ويه الأستاذ علي الذهبي راح تفهم، تربط، وتحلل الفيزياء.. وتضمن التفوق.', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1H2LTxZEYYtZ0EITbcYv9QOPOUZ5qUBlF?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1j0K5yVAKKdgKhHTB8AsqEz9BD8uAIlT-?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('صور الاساتذة', 'تغيير صور الهايلايت لاساتذة مرماز اكاديمي على الهوية البصرية', 'academy', 'normal',
          false, v_coord, v_coord, 'Approved — [الموعد الأصلي: تم النشر]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1jRsoMo4L1ZEDE_WGkmQK2w31LWcWWR4O?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('توب فيو', '', 'academy', 'normal',
          false, v_coord, v_coord, 'pause', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'تايتل|
طريق الـ 100 يبدأ من مرماز اكاديمي
كابشن|
طرق هواية لل100 بس افضلهم ويه مرماز اكاديمي', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/file/d/1x737MWix9TlnYT0AmdX_gDtMNB5CFi8E/view?usp=share_link
https://drive.google.com/file/d/1YHwyPaBo5PNfMjm47w5MfXc_wpBNWfZP/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1ao3In75apIJSuElQGwOX7-BLOuK-COeE/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('نادي المتفوقين', '', 'academy', 'normal',
          false, v_coord, v_coord, 'pause', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'تايتل|
اختيار نموذج
   ١- من الحيرة للوضوح… مرماز توصلك
    ٢-من الحيرة للتفوق… مرماز توصلك
كابشن|
الحيرة موجودة بكل رحلة… بس مو ويه مرماز. 
كلشي تحتاجه للسادس بمكان واحد، حتى تركز على هدفك وتوصل للتفوق.', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/file/d/1UgqAwxVHL8CpSvCt7AqMAj6S8HcTP2eG/view?usp=share_link
 https://drive.google.com/file/d/1RLvhzr1zkokOBR5JdOY0DtQQwAMT3P9M/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/157HIxTIq1otAIj2LPPjWeyvPcR4_6eG4/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('فيديو رحلة السادس', '', 'academy', 'normal',
          false, v_coord, v_coord, 'pause — [تحديث: تم التحديث]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'تايتل|
رحلة السادس احلى ويه مرماز
كابشن|
التحديات موجودة، والطريق مو دائماً سهل. بس كل لحظه برحلتك هسة، هي البداية لقصة نجاحك بعدين.', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/file/d/1ZTjxUdOK9GadpDzX2hOSNFKOurEW66ZN/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1QvelX3MsnOZFqzrVXwuYCk-4FwNJAu_l?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('Live', '', 'academy', 'normal',
          false, v_coord, v_coord, 'pause', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن|
كل شي تحتاجه حتى تضمن التفوق والدرجة الكاملة صار موجود بمكان واحد.. "نادي مرماز السري للمتفوقين"
بطاقتك صارت جاهزة وتنتظرك حتى تفتحلك افاق التفوق والأسرار اللي تخليك دائماً بالقمة.

تايتل |
الدخول.. للمتفوقين فقط', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/file/d/1gp-EabLVlZ9nTMcUfyjExaqG7DpebuQJ/view?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1I7BgCS0c1dCcZ2rznsVd4DwOkkGmAFFe');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('Weekly report- digital', '', 'academy', 'normal',
          false, v_coord, v_coord, 'Assigned to hassan, please set the timeline to be delivered each WED — [تحديث: i need the latest update please]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('July CC-Academy', '', 'academy', 'normal',
          false, v_coord, v_coord, 'Start work on the topics and visual direction for July — [الموعد الأصلي: July 6th] — [تحديث: تم الرفع + تم التحديث]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://docs.google.com/presentation/d/1TWcyqAO7boaIpNbJzVCv25NGynK9aier/edit?usp=sharing&ouid=103175723286719805649&rtpof=true&sd=true');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://canva.link/x09vzj50k60av45 فكرة اعلان الصبغ');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('July CC-Zone', '', 'academy', 'normal',
          false, v_coord, v_coord, 'Start work on the topics and visual direction for July — [الموعد الأصلي: July 6th] — [تحديث: موعد التسليم 7/13]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('Summer Campaign-Zone', '', 'academy', 'normal',
          false, v_coord, v_coord, 'What is the update? — [تحديث: تم نشر جميع فديوهات الحملة]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1F965oi_HUqakDc70gnDNS0CdAmhpheAE?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('BB Designs', 'The goal is to launch an outdoor advertising campaign...', 'academy', 'normal',
          false, v_coord, v_coord, 'Coordinate with Jaefar to create the messages and visual direction — [الموعد الأصلي: July 7th] — [تحديث: تم الرفع + تم رفع نموذج البلبورد]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://canva.link/fozi3gc8ql66t0p');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1UIO3Mi0QwrViCP-RFIuB47V_PtpcspzD?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('الفيديو الجماعي الاول', '', 'academy', 'normal',
          false, v_coord, v_coord, '[الموعد الأصلي: تم النشر] — [تحديث: تم التحديث على قياس الريلز]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن |  كل خطوة اليوم...
تقربك من المية باجر. 

ابدأ صح وسجل بالدورة الصيفية الثانية مع نخبة أساتذة مرماز، وخلي قرارك اليوم هو التفوق.

#متحتاج_الـVAR_الـ100_قرار 


تايتل | المية تبدأ من قرار', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1G1dPaGiSHSD6KfkB5oXFu-yYXZr--vC0?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1_4mFHtYYqEHyjhqjaBavKqU6C92yIvOr?usp=sharing https://drive.google.com/file/d/1l7pPFT0u8l8Kja_OtQZLM6o3KpXaMGD1/view?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('الفيديو الجماعي الثاني', '', 'academy', 'normal',
          false, v_coord, v_coord, 'Rejected — [الموعد الأصلي: تم التحديث] — [تحديث: Rejected]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'التفوق ما يجي صدفة... يجي بخطوة. 

واليوم... دورك تاخذها.

سجّل هسة مع نخبة من افضل اساتذة العراق 
 بمرماز اكاديمي، وابدأ رحلتك للمعدل العالي.
ــــــــ
تايتل |   التفوق ما يجي صدفة  يجي بخطوة .', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1G1dPaGiSHSD6KfkB5oXFu-yYXZr--vC0?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1KDEr4AKd1wawAFuOrczsJX-1CGM_dnyT/view?usp=drive_link https://drive.google.com/file/d/1JX8FLpbE1kcZAUXOSzA6S3vQVxFrKkIS/view?usp=drive_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('Qi card installment campaign', 'Brief is shared', 'academy', 'normal',
          false, v_coord, v_coord, '[الموعد الأصلي: July 12th] — [تحديث: تم الرفع]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://canva.link/i79y8za9wnecbjn');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('zone ideas', '', 'zone', 'normal',
          false, v_coord, v_coord, '', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://canva.link/4re2ebzv7k277gg');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'تم الرفع لكبريت');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('كاروسيل تنظيم وقت الدراسه', '', 'academy', 'normal',
          false, v_coord, v_coord, '[تحديث: On hold]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن |
جربت هذه الطريقة من قبل؟ أو عندك طريقتك الخاصة؟', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/11wkiq4AWfsFgBuMFMeJxa1p6FOp8IkBL?usp=drive_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('تغطية الية امتحان مرماز زون', '', 'zone', 'normal',
          false, v_coord, v_coord, '[الموعد الأصلي: July 11th] — [تحديث: تم النشر]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'من أول مرة تدخل أجواء الوزاري… إذا جنت ويه مرماز.

بامتحانات مرماز نوفر تجربة تحاكي الامتحان الوزاري من كل النواحي:
📄 دفتر امتحاني مطابق للدفتر الوزاري
✍️ أسئلة وزارية
👨🏫 مراقبة حقيقية
✅ تصحيح وفق المعايير الوزارية

حتى تدخل الامتحان بثقة، لأنك عشت التجربة الحقيقية.

اختار صح… واكتب مستقبلك بيدك.

#أني_مرماز_وأنت.

تايتل
    ليش امتحانات مرماز مختلفة؟', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/file/d/1f1TfIpKqHejuNgpkTvUV4vyuTmxHyh2z/view?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('تغطية امتحان احمد النداوي', '', 'academy', 'normal',
          false, v_coord, v_coord, '[الموعد الأصلي: July 12th] — [تحديث: in progress]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('BTS Zone', '', 'academy', 'normal',
          false, v_coord, v_coord, '[تحديث: Approved, يتم نشرة يوم 14.07.2026]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'تايتل |
أفضل الأساتذة… بمكان واحد
كابشن |
طلاب دفعة 2027.. 
كل أستاذ قدّم خلاصة خبرته وسنوات عطائه حتى يضمن إلك أفضل بداية ممكنة
🎯شرح واضح ومفهوم.
💡خطة مدروسة تقضي على التراكمات.
📝 متابعة دقيقة تضمن مستواك.

سجل هسه بالدورة الصيفية الثانية واضمن ال100', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1w1VcBrabAfRcCIvS1Bo0v2EiHcKc8kRw?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1RiFXJmsSnlBjLWIA0Nhv0Q3pwbBuQwdf?usp=share_link');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('فيديو التقليد', '', 'academy', 'normal',
          false, v_coord, v_coord, '', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://canva.link/au4teoj7zketw1h');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('Aug CC-Academy', '', 'academy', 'normal',
          false, v_coord, v_coord, '[الموعد الأصلي: July 18th]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'Jaafer');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('Aug CC-Zone', '', 'academy', 'normal',
          false, v_coord, v_coord, '[الموعد الأصلي: July 18th]', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'Riam');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('cutdown aqeel', '', 'academy', 'normal',
          false, v_coord, v_coord, '', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, 'كابشن + تايتل الكت الاول 
تايتل |
طريقك لأعلى الدرجات | أ.عقيل الزبيدي
كابشن |
اعلى درجة تتحقق من تكون ويه عراب اللغة العربية الاستاذ عقيل الزبيدي
———————
كابشن +تايتل الكت الثاني 
تايتل |
اختيار المتفوقين | أ.عقيل الزبيدي
كابشن |
سهل تكون من المتفوقين من تختار الاستاذ عقيل الزبيدي', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1mka-b_U79ESaGS0b8KS28Kmw4fgH0Xal?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', 'https://drive.google.com/drive/folders/1gr6KC4FO9y1WoWpR1pmnov5jUBRxWTdN?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  insert into public.tasks (title, description, brand, priority, is_partnership,
                            coordinator, created_by, coord_note, coord_link)
  values ('نموذج بوستات النتائج', '', 'academy', 'normal',
          false, v_coord, v_coord, 'نحتاج فكرة بوست لشخص ديشوف النتائج بالتليفون وتطلع نتيجته ناجح واهله حواليه فرحانين .... نستخدم اشخاص بدال التميمة', '')
  returning id into v_task;
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'caption', 'done', 0, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'design', 'done', 1, '', 'https://drive.google.com/drive/folders/1vq_w-0zhRYFbgLNyjnCHOQj9pZBNklYs?usp=sharing');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'video', 'done', 2, '', '');
  insert into public.stages (task_id, kind, state, sort_order, text_content, link)
    values (v_task, 'publish', 'pending', 3, '', '');
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'review', 'pending', 4);
  insert into public.stages (task_id, kind, state, sort_order)
    values (v_task, 'approval', 'pending', 5);

  raise notice 'تم استيراد 31 مهمة أرشيفية.';
end $$;

select count(*) as imported_tasks from public.tasks;
select kind, count(*) from public.stages group by kind order by kind;
