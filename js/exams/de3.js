/* Đề 3 · Xà phòng và chất giặt rửa */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, K = g.Calc;
  function mc(t, o, a, e) { return { text: t, options: o, answer: a, explain: e }; }
  function tf(t, arr) { return { text: t, items: arr.map(function (x) { return { t: x[0], a: x[1], explain: x[2] }; }) }; }
  function sh(t, a, e, tol) { return { text: t, answer: a, explain: e, tol: tol !== undefined ? tol : 0.01 }; }

  E.part('de3', 'mcq', [
    mc('Thành phần chính của chất giặt rửa tổng hợp là', ['C15H31COONa.', '(C17H35COO)2Ca.', 'CH3[CH2]11-C6H4-SO3Na.', 'C17H35COOK.'], 2, 'Chất giặt rửa tổng hợp thường là muối sodium alkylsulfate hoặc alkylbenzene sulfonate.'),
    mc('Hợp chất nào dưới đây được sử dụng làm xà phòng?', ['CH3COONa.', 'CH3(CH2)14COONa.', 'CH3(CH2)12COOCH3.', 'CH3(CH2)5O(CH2)5CH3.'], 1, 'Xà phòng là muối sodium hoặc potassium của acid béo; CH3(CH2)14COONa là sodium palmitate.'),
    mc('Trong thành phần của xà phòng và chất giặt rửa thường có một số ester. Vai trò của các ester này là', ['làm tăng khả năng giặt rửa.', 'tạo hương thơm mát, dễ chịu.', 'tạo màu sắc hấp dẫn.', 'làm giảm giá thành sản phẩm.'], 1, 'Nhiều ester có mùi thơm nên được dùng làm chất tạo hương.'),
    mc('Xà phòng và chất giặt rửa có điểm chung là', ['chứa muối sodium có khả năng làm giảm sức căng bề mặt của các chất bẩn.', 'các muối được lấy từ phản ứng xà phòng hóa chất béo.', 'là sản phẩm của công nghệ hóa dầu.', 'đều có nguồn gốc từ động vật hoặc thực vật.'], 0, 'Cả hai đều là chất hoạt động bề mặt, làm giảm sức căng bề mặt.'),
    mc('Nguyên nhân làm cho quả bồ kết có khả năng giặt rửa là', ['trong bồ kết có chất khử mạnh.', 'bồ kết có thành phần là ester của glycerol.', 'trong bồ kết có chất oxi hóa mạnh.', 'bồ kết có những chất có cấu tạo kiểu đầu phân cực gắn với đuôi dài không phân cực.'], 3, 'Saponin trong bồ kết có cấu tạo giống xà phòng: đầu ưa nước và đuôi kị nước.'),
    mc('Để tẩy vết dầu, mỡ bám trên quần áo, dùng chất nào sau đây là phù hợp nhất?', ['Nước cất.', 'Dung dịch sodium hydroxide.', 'Nước Javel.', 'Dung dịch xà phòng.'], 3, 'Đuôi kị nước của xà phòng thâm nhập vào vết dầu mỡ, phân tán chúng vào nước.'),
    mc('Từ tristearin, người ta dùng phản ứng nào để điều chế xà phòng?', ['Phản ứng ester hóa.', 'Phản ứng thủy phân ester trong môi trường acid.', 'Phản ứng cộng hydrogen.', 'Phản ứng thủy phân ester trong môi trường kiềm.'], 3, 'Đây là phản ứng xà phòng hóa: (C17H35COO)3C3H5 + 3NaOH → 3C17H35COONa + C3H5(OH)3.'),
    mc('Hóa chất chủ đạo trong ngành công nghiệp sản xuất xà phòng là', ['K2SO4.', 'NaCl.', 'Mg(NO3)2.', 'NaOH.'], 3, 'NaOH (hoặc KOH) được dùng để xà phòng hóa chất béo.'),
    mc('Không nên dùng xô, chậu bằng nhôm để đựng quần áo ngâm xà phòng vì', ['quần áo bị mục nhanh.', 'xô chậu nhanh hỏng do trong xà phòng có kiềm.', 'quần áo bị bạc màu nhanh.', 'quần áo không sạch.'], 1, 'Xà phòng có tính kiềm, làm nhôm bị ăn mòn.'),
    mc('Không nên dùng xà phòng khi giặt rửa với nước cứng vì', ['xuất hiện kết tủa làm giảm tác dụng giặt rửa và ảnh hưởng đến chất lượng sợi vải.', 'gây ô nhiễm môi trường.', 'tạo ra kết tủa CaCO3, MgCO3 bám lên sợi vải.', 'gây hại cho da tay.'], 0, 'Ca^{2+}, Mg^{2+} tạo muối kết tủa (C17H35COO)2Ca, (C17H35COO)2Mg với xà phòng.'),
    mc('Chất giặt rửa tổng hợp có ưu điểm nào sau đây mà xà phòng không có?', ['Được làm từ chất béo thiên nhiên.', 'Có thể dùng trong nước cứng vì không bị kết tủa với ion Ca^{2+}, Mg^{2+}.', 'Luôn dễ bị vi sinh vật phân hủy hoàn toàn.', 'Có thành phần chính là muối của acid béo.'], 1, 'Muối sulfonate/sulfate của Ca, Mg tan được nên không tạo kết tủa.'),
    mc('Cho các phát biểu sau:\n(a) Xà phòng là sản phẩm của phản ứng xà phòng hóa chất béo với dung dịch NaOH hoặc KOH.\n(b) Muối sodium hoặc potassium của acid hữu cơ là thành phần chính của xà phòng.\n(c) Khi đun nóng chất béo với dung dịch NaOH hoặc KOH ta được xà phòng.\n(d) Từ dầu mỏ có thể sản xuất được chất giặt rửa tổng hợp.\nSố phát biểu đúng là', ['1.', '2.', '3.', '4.'], 2, 'Đúng: (a), (c), (d). (b) sai vì thành phần chính của xà phòng là muối của acid béo chứ không phải mọi acid hữu cơ.'),
    mc('Cho các phát biểu sau:\n(a) Chất ưa nước là những chất tan tốt trong nước như methanol, sodium acetate,…\n(b) Chất kị nước là những chất không tan trong dầu mỡ, dung môi hữu cơ,…\n(c) Xà phòng là hỗn hợp muối sodium hoặc potassium của các acid béo.\n(d) Chất tẩy rửa tổng hợp là muối sodium của acid béo.\n(e) Phân tử chất giặt rửa gồm 1 đầu ngắn ưa dầu mỡ gắn với 1 đầu dài ưa nước.\n(f) Ưu điểm của xà phòng là dùng được với nước cứng.\nSố phát biểu đúng là', ['2.', '3.', '4.', '5.'], 0, 'Đúng: (a), (c). (b) sai: chất kị nước tan trong dầu mỡ; (d) sai; (e) sai: phải là đầu phân cực ngắn ưa nước gắn với đuôi hydrocarbon dài kị nước (ưa dầu mỡ); (f) sai vì xà phòng không dùng được với nước cứng.'),
    mc('Cho các phát biểu sau:\n(a) Xà phòng mất tác dụng tẩy rửa khi dùng nước cứng vì tạo muối kết tủa với cation Ca^{2+}, Mg^{2+}.\n(b) Bột giặt tổng hợp dùng được với nước cứng vì muối sulfonate có độ tan lớn, không kết tủa với Ca^{2+}, Mg^{2+}.\n(c) Bột giặt, kem giặt có thể chứa chất tẩy trắng như sodium hypochlorite.\n(d) Chất giặt rửa tổng hợp có gốc hydrocarbon phân nhánh không gây ô nhiễm vì dễ bị vi sinh vật phân hủy.\n(e) Chất ưa nước là những chất tan tốt trong dầu mỏ, alkane,…\nSố phát biểu sai là', ['1.', '2.', '3.', '4.'], 1, 'Sai: (d) gốc phân nhánh khó bị phân hủy sinh học; (e) chất ưa nước tan tốt trong nước. Các ý (a), (b), (c) đúng.'),
    K.mcq(K.chatBeo(), 2), K.mcq(K.xaPhongHoa('muoi'), 2), K.mcq(K.xaPhongHoa('glycerol'), 2), K.mcq(K.doiKiem(), 2)
  ]);

  E.part('de3', 'tf', [
    tf('(SGK – KNTT) Chất giặt rửa tổng hợp là chất được tổng hợp hóa học, có tác dụng giặt rửa như xà phòng nhưng không phải muối sodium, potassium của acid béo.', [
      ['Các muối CH3[CH2]14COONa và CH3[CH2]10CH2OSO3Na là thành phần chính của chất giặt rửa tổng hợp.', false, 'CH3[CH2]14COONa là sodium palmitate, thành phần của xà phòng.'],
      ['Thành phần chính của chất giặt rửa tổng hợp điển hình là CH3[CH2]10CH2OSO3Na hoặc CH3[CH2]11–C6H4–SO3Na.', true, 'Đó là muối sodium alkylsulfate và alkylbenzene sulfonate.'],
      ['Saponin trong bồ hòn và quả bồ kết là chất giặt rửa tự nhiên, khi tiếp xúc với nước tạo lớp bọt nhẹ tương tự xà phòng.', true, 'Saponin có đầu ưa nước và đuôi kị nước.'],
      ['Phần ưa nước của xà phòng và chất giặt rửa tổng hợp là gốc hydrocarbon mạch dài (R).', false, 'Gốc hydrocarbon dài là phần kị nước; phần ưa nước là nhóm phân cực –COONa, –SO3Na, –OSO3Na.']]),
    tf('(SGK – Cánh Diều) Trong công nghiệp, để sản xuất xà phòng, người ta đun chất béo (mỡ động vật, dầu thực vật) với dung dịch kiềm đặc ở nhiệt độ cao: (RCOO)3C3H5 + 3NaOH → 3RCOONa + C3H5(OH)3.', [
      ['Thành phần chủ yếu của muối RCOONa là sodium palmitate và sodium stearate.', true, 'Mỡ động vật chứa chủ yếu gốc palmitate và stearate.'],
      ['Để tách muối của acid béo, người ta cho dung dịch NaCl bão hòa vào hỗn hợp sản phẩm, muối của acid béo nổi lên.', true, 'Muối của acid béo ít tan trong dung dịch NaCl bão hòa.'],
      ['Trong phòng thí nghiệm, có thể đựng hỗn hợp chất béo và NaOH trong bát nhôm để điều chế lượng nhỏ xà phòng.', false, 'Nhôm bị kiềm ăn mòn.'],
      ['Xà phòng còn được sản xuất từ dầu mỏ theo sơ đồ: alkane → acid béo → muối sodium/potassium của acid béo.', true, 'Đó là một cách sản xuất xà phòng từ dầu mỏ.']]),
    tf('(SGK Hóa học 12 – KNTT) Thí nghiệm: Bước 1: cho khoảng 2 gam chất béo và 4 mL dung dịch NaOH 40% vào bát sứ, đun khoảng 10 phút, khuấy liên tục. Bước 2: đổ hỗn hợp vào cốc chứa 30 mL dung dịch NaCl bão hòa, khuấy nhẹ, để nguội.', [
      ['Sau bước 2 thấy có lớp chất rắn màu trắng chứa muối sodium của acid béo nổi lên.', true, 'Đó là xà phòng.'],
      ['Vai trò của dung dịch NaCl bão hòa ở bước 2 là để tách muối sodium của acid béo ra khỏi hỗn hợp.', true, 'NaCl làm giảm độ tan của xà phòng.'],
      ['Ở bước 1, nếu thay mỡ lợn bằng dầu nhớt (hỗn hợp hydrocarbon) thì hiện tượng thí nghiệm vẫn xảy ra tương tự.', false, 'Dầu nhớt là hydrocarbon, không phải ester nên không xà phòng hóa.'],
      ['Trong công nghiệp, phản ứng ở thí nghiệm trên được ứng dụng để sản xuất xà phòng và glycerol.', true, 'Xà phòng hóa chất béo cho xà phòng và glycerol.']]),
    tf('(SGK Hóa học 12 – Cánh Diều) Thành phần chính của chất giặt rửa tổng hợp điển hình là các muối: CH3[CH2]10CH2OSO3Na (1) hoặc CH3[CH2]11–C6H4–SO3Na (2).', [
      ['Chất giặt rửa tổng hợp được sản xuất từ dầu mỏ theo sơ đồ: dầu mỏ → [R–SO3H; R–OSO3H] → [R–SO3Na; R–OSO3Na].', true, 'Sơ đồ đúng như trong sách giáo khoa.'],
      ['Phần ưa nước trong phân tử (1) và (2) là các nhóm –OSO3Na và –SO3Na.', true, 'Đây là phần đầu phân cực.'],
      ['Chất giặt rửa tổng hợp dùng được với nước cứng vì không bị kết tủa bởi các ion Ca^{2+} và Mg^{2+}.', true, 'Muối sulfonate/sulfate của Ca, Mg tan tốt.'],
      ['Chất giặt rửa tổng hợp có gốc hydrocarbon phân nhánh hoặc chứa vòng benzene ít gây ô nhiễm vì dễ bị vi sinh vật phân hủy.', false, 'Gốc phân nhánh hoặc vòng benzene khó bị vi sinh vật phân hủy nên gây ô nhiễm môi trường.']])
  ]);

  E.part('de3', 'short', [
    sh('Cho các chất sau: CH3[CH2]10CH2OSO3Na; CH3[CH2]14COONa; CH3[CH2]11–C6H4–SO3Na; CH3CH2COONa; CH3[CH2]16COOK. Có bao nhiêu chất có thể là thành phần chính của xà phòng?', 2, 'Xà phòng là muối của acid béo (mạch C dài): CH3[CH2]14COONa và CH3[CH2]16COOK → 2 chất.'),
    sh('Cho các chất sau: C15H31COONa; CH3[CH2]11OSO3Na; CH3[CH2]11C6H4SO3Na; C17H33COOK. Có bao nhiêu chất là thành phần chính của chất giặt rửa tổng hợp?', 2, 'CH3[CH2]11OSO3Na và CH3[CH2]11C6H4SO3Na là chất giặt rửa tổng hợp; hai chất còn lại là xà phòng.'),
    K.hhMo(), K.muoiKhan(), K.doiKiem(), K.phanTramO()
  ]);
})(window);
