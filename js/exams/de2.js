/* Đề 2 · Lipid – Chất béo */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, K = g.Calc;
  function mc(t, o, a, e) { return { text: t, options: o, answer: a, explain: e }; }
  function tf(t, arr) { return { text: t, items: arr.map(function (x) { return { t: x[0], a: x[1], explain: x[2] }; }) }; }
  function sh(t, a, e, tol) { return { text: t, answer: a, explain: e, tol: tol !== undefined ? tol : 0.01 }; }

  E.part('de2', 'mcq', [
    mc('Công thức của tripalmitin là', ['(C17H35COO)3C3H5.', '(C15H31COO)3C3H5.', '(C17H33COO)3C3H5.', '(C17H31COO)3C3H5.'], 1, 'Palmitic acid là C15H31COOH nên tripalmitin là (C15H31COO)3C3H5.'),
    mc('Chất nào sau đây là acid béo?', ['C15H31COOH.', 'CH3COOH.', 'C3H5(OH)3.', 'C6H5COOH.'], 0, 'Acid béo có mạch carbon dài (12 – 24 C); C15H31COOH là palmitic acid.'),
    mc('Chất béo là', ['triester của glycerol với acid béo.', 'ester của ethylene glycol với acid béo.', 'hợp chất tan tốt trong nước, chứa C, H, O.', 'muối sodium hoặc potassium của acid béo.'], 0, 'Chất béo là triester của glycerol với acid béo, gọi chung là triglyceride.'),
    mc('Ở điều kiện thường, chất nào sau đây ở trạng thái lỏng?', ['(C17H33COO)3C3H5.', '(C17H35COO)3C3H5.', '(C15H31COO)3C3H5.', 'C17H35COONa.'], 0, 'Triolein chứa gốc acid béo không no nên là chất lỏng; tristearin, tripalmitin và muối sodium đều là chất rắn.'),
    mc('Quá trình chuyển dầu thực vật (lỏng) thành bơ thực vật (rắn) dựa trên phản ứng', ['hydrogen hóa (cộng H2, xúc tác Ni).', 'xà phòng hóa.', 'ester hóa.', 'oxi hóa bởi oxygen không khí.'], 0, 'Cộng H2 vào liên kết C=C của gốc acid béo không no tạo chất béo no, ở dạng rắn.'),
    mc('Triolein tác dụng với H2 dư (Ni, t°) thu được chất X. Thủy phân triolein thu được alcohol Y. X và Y lần lượt là', ['tripalmitin và ethylene glycol.', 'tripalmitin và glycerol.', 'tristearin và ethylene glycol.', 'tristearin và glycerol.'], 3, 'Hydrogen hóa triolein cho tristearin; thủy phân chất béo luôn cho glycerol.'),
    mc('Đun nóng triglyceride trong dung dịch NaOH dư đến phản ứng hoàn toàn luôn thu được chất nào sau đây?', ['Glycerol.', 'Ethylene glycol.', 'Ethanol.', 'Methanol.'], 0, 'Triglyceride là triester của glycerol nên luôn tạo glycerol.'),
    mc('Nguyên nhân dầu, mỡ để lâu trong không khí bị ôi là', ['các gốc acid béo không no bị oxi hóa chậm bởi oxygen không khí tạo hợp chất có mùi khó chịu.', 'chất béo bị thủy phân hoàn toàn bởi hơi nước trong không khí.', 'chất béo bị hydrogen hóa bởi khí quyển.', 'chất béo bị ester hóa với CO2 trong không khí.'], 0, 'Đó là quá trình oxi hóa chậm liên kết C=C ở gốc acid béo không no.'),
    mc('Phát biểu nào sau đây về acid béo là đúng?', ['Là carboxylic acid đơn chức, mạch carbon dài, không phân nhánh, thường có số nguyên tử carbon chẵn.', 'Là carboxylic acid hai chức có mạch carbon ngắn.', 'Là ester của glycerol với carboxylic acid.', 'Luôn là acid no.'], 0, 'Acid béo có thể no (palmitic, stearic) hoặc không no (oleic, linoleic).'),
    mc('Công thức của oleic acid là', ['C15H31COOH.', 'C17H35COOH.', 'C17H33COOH.', 'C17H31COOH.'], 2, 'Oleic acid C17H33COOH có 1 liên kết C=C; stearic là C17H35COOH; linoleic là C17H31COOH.'),
    mc('Để phân biệt acetic acid, glycerol và triolein, có thể chỉ cần dùng', ['nước và quỳ tím.', 'nước và dung dịch NaOH.', 'dung dịch NaOH.', 'nước bromine.'], 0, 'Triolein không tan trong nước (tách lớp); trong hai chất tan còn lại, acetic acid làm quỳ tím hóa đỏ.'),
    mc('Cho các phát biểu sau:\n(a) Chất béo là triester của glycerol với các monocarboxylic acid có số chẵn nguyên tử carbon (12 – 24), mạch dài, không phân nhánh.\n(b) Lipid gồm chất béo, sáp, steroid, phospholipid,…\n(c) Chất béo là các chất lỏng.\n(d) Chất béo chứa chủ yếu gốc không no thường là chất lỏng ở nhiệt độ phòng và gọi là dầu.\n(e) Phản ứng thủy phân chất béo trong môi trường kiềm là phản ứng thuận nghịch.\n(f) Chất béo là thành phần chính của dầu, mỡ động vật, thực vật.\nSố phát biểu đúng là', ['2.', '3.', '4.', '5.'], 2, 'Đúng: (a), (b), (d), (f). Sai: (c) chất béo có thể rắn; (e) thủy phân trong kiềm là một chiều.'),
    mc('Phát biểu nào sau đây về chất béo là đúng?', ['Chất béo nhẹ hơn nước và không tan trong nước.', 'Chất béo nặng hơn nước và tan tốt trong nước.', 'Chất béo tan tốt trong nước nhưng không tan trong dung môi hữu cơ.', 'Chất béo luôn là chất rắn ở nhiệt độ phòng.'], 0, 'Chất béo nhẹ hơn nước, không tan trong nước, tan trong dung môi hữu cơ ít phân cực.'),
    mc('Nhóm vitamin nào sau đây tan tốt trong chất béo?', ['A, D, E, K.', 'B1, B2, C.', 'C, PP, B12.', 'B6, C, PP.'], 0, 'Các vitamin A, D, E, K tan trong chất béo nên được vận chuyển, hấp thụ cùng chất béo.'),
    K.mcq(K.chatBeo(), 2), K.mcq(K.muoiKhan(), 2), K.mcq(K.xaPhongHoa('muoi'), 2), K.hydroTriolein('mcq')
  ]);

  E.part('de2', 'tf', [
    tf('(SGK Hóa học 12 – CTST) Chất béo X có công thức cấu tạo: C3H5(OCOC15H31)(OCOC17H33)(OCOC17H31).', [
      ['Thủy phân X trong môi trường KOH thu được 3 muối: C15H31COOK, C17H33COOK, C17H31COOK.', true, 'Ba gốc acid khác nhau cho ba muối potassium.'],
      ['Số liên kết π trong phân tử X là 3.', false, 'X có 3 liên kết π ở C=O và 3 liên kết π ở C=C (0 + 1 + 2) nên có 6 liên kết π.'],
      ['Hydrogen hóa hoàn toàn 1 mol X cần tối đa 3 mol H2 (Ni, t°).', true, 'X có 3 liên kết C=C (oleate 1, linoleate 2).'],
      ['Phần trăm khối lượng oxygen trong X khoảng 11,2%.', true, 'X là C55H100O6 (M = 856): %O = 96 : 856 × 100% ≈ 11,2%.']]),
    tf('(SBT Hóa học 12 CB) Cho tristearin vào cốc thủy tinh chứa lượng dư dung dịch NaOH, đun sôi và khuấy đều đến khi thu được chất lỏng đồng nhất; để nguội rồi thêm muối ăn, khuấy tan, thấy hỗn hợp tách hai lớp: phía trên là chất rắn màu trắng, phía dưới là chất lỏng.', [
      ['Lớp chất rắn màu trắng phía trên chứa sodium stearate, lớp chất lỏng phía dưới chứa glycerol.', true, 'Muối của acid béo nhẹ, ít tan trong dung dịch NaCl nên nổi lên.'],
      ['Vai trò của muối ăn là làm xúc tác cho phản ứng xà phòng hóa.', false, 'Muối ăn làm tăng khối lượng riêng của dung dịch, giúp tách muối của acid béo ra khỏi hỗn hợp.'],
      ['Phản ứng trong thí nghiệm là phản ứng xà phòng hóa, được ứng dụng để sản xuất xà phòng và glycerol.', true, '(C17H35COO)3C3H5 + 3NaOH → 3C17H35COONa + C3H5(OH)3.'],
      ['Trong thí nghiệm trên, có thể thay cốc thủy tinh bằng cốc nhôm.', false, 'Nhôm bị dung dịch NaOH đặc, nóng ăn mòn.']]),
    tf('Bơ thực vật được sản xuất bằng cách hydrogen hóa một phần dầu thực vật.', [
      ['Dầu thực vật chứa nhiều gốc acid béo không no nên có thể cộng H2.', true, 'Liên kết C=C ở gốc không no cộng H2 (xúc tác Ni, đun nóng).'],
      ['Sau hydrogen hóa, chất béo chứa nhiều gốc no hơn nên chuyển từ lỏng sang rắn.', true, 'Gốc no làm nhiệt độ nóng chảy của chất béo tăng.'],
      ['Hydrogen hóa hoàn toàn triolein (Ni, t°) thu được tripalmitin.', false, 'Sản phẩm là tristearin (gốc C17H35COO–).'],
      ['1 mol trilinolein cộng tối đa 3 mol H2.', false, 'Mỗi gốc linoleate có 2 liên kết C=C, nên 1 mol trilinolein cộng tối đa 6 mol H2.']]),
    tf('Về sự oxi hóa chất béo và acid béo omega:', [
      ['Dầu, mỡ để lâu trong không khí bị ôi do các gốc acid béo không no bị oxi hóa chậm.', true, 'Sản phẩm oxi hóa có mùi khó chịu.'],
      ['Có thể thêm vitamin C, vitamin E vào thực phẩm chứa chất béo làm chất chống oxi hóa.', true, 'Chúng làm chậm quá trình oxi hóa chất béo.'],
      ['Dầu, mỡ bị ôi do bị thủy phân bởi hơi nước trong không khí.', false, 'Nguyên nhân chính là oxi hóa bởi oxygen, không phải thủy phân.'],
      ['Acid béo omega-3 và omega-6 là các acid béo no.', false, 'Chúng là acid béo không no, có liên kết đôi đầu tiên ở vị trí số 3 hoặc số 6.']])
  ]);

  E.part('de2', 'short', [
    sh('Có tối đa bao nhiêu triglyceride chứa đồng thời gốc oleate và gốc stearate (không tính đồng phân quang học)?', 4, 'Gồm 2 chất có 2 gốc oleate + 1 gốc stearate (stearate ở giữa hoặc ở đầu) và 2 chất có 2 gốc stearate + 1 gốc oleate → 4 chất.'),
    sh('Hydrogen hóa hoàn toàn 1 mol trilinolein (C17H31COO)3C3H5 cần tối đa bao nhiêu mol H2?', 6, 'Mỗi gốc linoleate có 2 liên kết C=C, 3 gốc có 6 liên kết C=C → cần 6 mol H2.'),
    sh('Phân tử tristearin (C17H35COO)3C3H5 có tất cả bao nhiêu nguyên tử carbon?', 57, '3 × 18 (mỗi gốc C17H35COO có 18 C) + 3 (gốc glyceryl) = 57.'),
    K.hhMo(), K.demH(), K.xaPhongHoa('glycerol')
  ]);
})(window);
