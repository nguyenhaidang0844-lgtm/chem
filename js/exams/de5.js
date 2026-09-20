/* Đề 5 · Tổng hợp chương 1 (số 2) */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, K = g.Calc;
  function mc(t, o, a, e) { return { text: t, options: o, answer: a, explain: e }; }
  function tf(t, arr) { return { text: t, items: arr.map(function (x) { return { t: x[0], a: x[1], explain: x[2] }; }) }; }
  function sh(t, a, e, tol) { return { text: t, answer: a, explain: e, tol: tol !== undefined ? tol : 0.01 }; }

  E.part('de5', 'mcq', [
    mc('Tên gọi của ester CH3CH2COOCH2CH2CH3 là', ['propyl propionate.', 'ethyl butyrate.', 'propyl acetate.', 'methyl valerate.'], 0, 'Gốc alcohol là propyl (C3H7–), gốc acid là propionate (C2H5COO–).'),
    mc('Ester X (C4H6O2) thủy phân trong dung dịch NaOH thu được sodium acetate và acetaldehyde. Công thức cấu tạo của X là', ['CH3COOCH=CH2.', 'CH2=CHCOOCH3.', 'HCOOCH=CHCH3.', 'HCOOCH2CH=CH2.'], 0, 'CH3COOCH=CH2 + NaOH → CH3COONa + CH3CHO.'),
    mc('Thủy phân hoàn toàn HCOOCH=CH2 trong dung dịch NaOH dư, đun nóng, thu được các sản phẩm hữu cơ là', ['HCOONa và CH3CHO.', 'HCOONa và CH2=CHOH.', 'CH3COONa và CH3OH.', 'HCOOH và CH3CHO.'], 0, 'Gốc alcohol vinyl tạo CH2=CHOH không bền, chuyển thành CH3CHO; môi trường kiềm tạo muối HCOONa.'),
    mc('Phát biểu nào sau đây về ester là đúng?', ['Ester thường nhẹ hơn nước và ít tan trong nước.', 'Ester thường nặng hơn nước.', 'Tất cả các ester đều ở thể rắn ở điều kiện thường.', 'Ester tan tốt trong nước nhờ liên kết hydrogen giữa các phân tử ester.'], 0, 'Ester có phân tử khối thấp, trung bình thường là chất lỏng, nhẹ hơn nước và ít tan.'),
    mc('Poly(methyl methacrylate) được dùng để sản xuất', ['thủy tinh hữu cơ (plexiglas).', 'sợi nylon.', 'cao su buna.', 'xà phòng.'], 0, 'Polymer này dùng làm thủy tinh hữu cơ, răng giả, kính áp tròng,…'),
    mc('Chất hữu cơ X có công thức phân tử C2H4O2 vừa tác dụng được với dung dịch NaOH, vừa tham gia phản ứng tráng bạc. X là', ['HCOOCH3.', 'CH3COOH.', 'HOCH2CHO.', 'C2H5OH.'], 0, 'HCOOCH3 là ester của formic acid nên thủy phân trong NaOH và tráng bạc.'),
    mc('Ứng dụng nào sau đây không phải của chất béo?', ['Là nguồn cung cấp và dự trữ năng lượng cho cơ thể.', 'Là nguyên liệu sản xuất xà phòng.', 'Là nguyên liệu sản xuất glycerol.', 'Dùng trực tiếp làm chất giặt rửa tổng hợp.'], 3, 'Chất giặt rửa tổng hợp là muối sulfonate/sulfate, không phải chất béo.'),
    mc('Acid béo omega-3 có nhiều trong', ['dầu cá biển.', 'dầu mè.', 'dầu đậu nành.', 'dầu hướng dương.'], 0, 'Dầu mè, đậu nành, hướng dương chứa nhiều omega-6.'),
    mc('Phát biểu nào sau đây sai?', ['Chất béo lỏng chứa nhiều gốc acid béo không no.', 'Chất béo không tan trong nước và nhẹ hơn nước.', 'Thủy phân chất béo trong môi trường acid thu được glycerol và acid béo.', 'Phản ứng xà phòng hóa chất béo là phản ứng thuận nghịch.'], 3, 'Xà phòng hóa là phản ứng một chiều vì muối sinh ra không tác dụng ngược với glycerol.'),
    mc('Phần đuôi kị nước trong phân tử xà phòng là', ['nhóm –COONa.', 'gốc hydrocarbon mạch dài.', 'ion Na^{+}.', 'nhóm –OH.'], 1, 'Gốc hydrocarbon dài không phân cực là phần kị nước; nhóm –COONa là đầu ưa nước.'),
    mc('Nước cứng chứa nhiều các ion nào sau đây?', ['Ca^{2+}, Mg^{2+}.', 'Na^{+}, K^{+}.', 'Cl^{-}, Br^{-}.', 'H^{+}, OH^{-}.'], 0, 'Nước cứng chứa nhiều ion Ca^{2+} và Mg^{2+}.'),
    mc('Chất nào sau đây có thể dùng làm chất giặt rửa tổng hợp?', ['CH3[CH2]11OSO3Na.', 'CH3COONa.', 'C2H5OH.', 'CH3[CH2]11OH.'], 0, 'Muối sodium alkylsulfate có đầu ưa nước –OSO3Na và đuôi kị nước dài.'),
    mc('Cho các chất: tristearin, triolein, ethyl acetate, glycerol. Số chất tác dụng được với dung dịch NaOH, đun nóng là', ['1.', '2.', '3.', '4.'], 2, 'Tristearin, triolein và ethyl acetate đều là ester nên bị thủy phân trong NaOH; glycerol thì không.'),
    mc('Xà phòng lỏng (dùng làm nước rửa tay) thường có thành phần chính là muối của', ['potassium với acid béo.', 'sodium với acid béo.', 'calcium với acid béo.', 'ammonium với acid béo.'], 0, 'Xà phòng lỏng được sản xuất bằng cách xà phòng hóa chất béo với KOH; muối potassium tan tốt hơn.'),
    K.salicylate(), K.tenEster(), K.mcq(K.chatBeo(), 2), K.hydroTriolein('mcq')
  ]);

  E.part('de5', 'tf', [
    tf('Thí nghiệm điều chế ethyl acetate: cho 2 mL ethanol, 2 mL acetic acid nguyên chất và vài giọt H2SO4 đặc vào ống nghiệm, lắc đều, đun cách thủy 5 – 6 phút ở 65 – 70 °C; làm lạnh rồi thêm 2 mL dung dịch NaCl bão hòa.', [
      ['H2SO4 đặc vừa là chất xúc tác vừa hút nước, làm cân bằng chuyển dịch theo chiều tạo ester.', true, 'Đó là vai trò của H2SO4 đặc trong phản ứng ester hóa.'],
      ['Sau khi thêm NaCl bão hòa, có lớp chất lỏng có mùi thơm nổi lên trên mặt dung dịch.', true, 'Ethyl acetate nhẹ hơn nước và ít tan.'],
      ['Thêm dung dịch NaCl bão hòa để ester tan hoàn toàn trong dung dịch.', false, 'NaCl bão hòa làm giảm độ tan của ester, giúp ester tách thành lớp riêng.'],
      ['Ống nghiệm cần được đun trực tiếp trên ngọn lửa đèn cồn.', false, 'Phải đun cách thủy vì hỗn hợp chứa các chất dễ bay hơi, dễ cháy.']]),
    tf('Chất béo X có công thức (C17H35COO)(C17H33COO)2C3H5.', [
      ['X có tên gọi là tristearin.', false, 'Tristearin chứa ba gốc stearate; X chứa 1 gốc stearate và 2 gốc oleate.'],
      ['Phân tử khối của X là 886.', true, 'M = 41 + 3 × 44 + 239 + 2 × 237 = 886.'],
      ['Hydrogen hóa hoàn toàn 1 mol X cần tối đa 2 mol H2 (Ni, t°).', true, 'Mỗi gốc oleate có 1 liên kết C=C.'],
      ['Xà phòng hóa X bằng dung dịch NaOH dư thu được 3 muối khác nhau.', false, 'Chỉ thu được 2 muối: C17H35COONa và C17H33COONa.']]),
    tf('Ester X (C4H6O2) tác dụng với dung dịch NaOH, đun nóng, thu được muối Y và chất hữu cơ Z. Nung Y với vôi tôi xút thu được CH4; Z tham gia phản ứng tráng bạc.', [
      ['Muối Y là CH3COONa.', true, 'Nung CH3COONa với vôi tôi xút thu CH4.'],
      ['Chất Z là CH3CHO.', true, 'Z tráng bạc và X có 4C nên Z là CH3CHO.'],
      ['X có đồng phân hình học.', false, 'X là CH3COOCH=CH2, nguyên tử C ở nối đôi có hai nhóm thế giống nhau nên không có đồng phân hình học.'],
      ['X được điều chế trực tiếp từ acetic acid và ethyl alcohol.', false, 'Acetic acid và ethyl alcohol tạo ethyl acetate CH3COOC2H5.']]),
    tf('Thí nghiệm: cho xà phòng vào hai ống nghiệm: ống (1) chứa nước cất, ống (2) chứa nước cứng; lắc mạnh cả hai ống.', [
      ['Ống (1) tạo nhiều bọt.', true, 'Xà phòng hoạt động tốt trong nước mềm.'],
      ['Ống (2) ít bọt và xuất hiện kết tủa trắng.', true, 'Ion Ca^{2+}, Mg^{2+} tạo muối không tan với xà phòng.'],
      ['Kết tủa trắng ở ống (2) là CaCO3.', false, 'Kết tủa là muối calcium của acid béo, ví dụ (C17H35COO)2Ca.'],
      ['Nếu thay xà phòng bằng chất giặt rửa tổng hợp thì ống (2) vẫn tạo bọt và không có kết tủa.', true, 'Muối sulfonate/sulfate của Ca, Mg tan được.']])
  ]);

  E.part('de5', 'short', [
    sh('Có bao nhiêu đồng phân cấu tạo là ester đơn chức, mạch hở, có công thức phân tử C4H6O2 (không kể đồng phân hình học)?', 5, 'HCOOCH2CH=CH2, HCOOCH=CHCH3, HCOOC(CH3)=CH2, CH3COOCH=CH2, CH2=CHCOOCH3 → 5 đồng phân.'),
    sh('Cho các chất: CH3COOC2H5; CH3COOCH=CH2; CH3COOC6H5; HCOOCH3. Có bao nhiêu chất khi thủy phân trong dung dịch NaOH dư, đun nóng, không thu được alcohol?', 2, 'CH3COOCH=CH2 cho CH3CHO; CH3COOC6H5 cho phenol/muối phenolate → 2 chất.'),
    K.demH(), K.mAlcohol(), K.xaPhongHoa('muoi'), K.dauChuoi()
  ]);
})(window);
