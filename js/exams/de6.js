/* Đề 6 · Vận dụng cao */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, K = g.Calc;
  function mc(t, o, a, e) { return { text: t, options: o, answer: a, explain: e }; }
  function tf(t, arr) { return { text: t, items: arr.map(function (x) { return { t: x[0], a: x[1], explain: x[2] }; }) }; }
  function sh(t, a, e, tol) { return { text: t, answer: a, explain: e, tol: tol !== undefined ? tol : 0.01 }; }

  E.part('de6', 'mcq', [
    mc('Số đồng phân cấu tạo là ester, đơn chức, mạch hở, có công thức phân tử C5H10O2 là', ['6.', '7.', '8.', '9.'], 3, 'HCOOC4H9 (4 đồng phân gốc butyl) + CH3COOC3H7 (2) + C2H5COOC2H5 (1) + C3H7COOCH3 (2) = 9.'),
    mc('Hợp chất X mạch hở, công thức phân tử C4H6O4, thủy phân trong dung dịch NaOH dư thu được (COONa)2 và một alcohol duy nhất. X là', ['CH3OOC–COOCH3.', 'HCOOCH2CH2OOCH.', 'CH3COOCH2COOH.', 'HOOC–CH2–CH2–COOH.'], 0, 'CH3OOC–COOCH3 + 2NaOH → (COONa)2 + 2CH3OH.'),
    mc('Sắp xếp các chất HCOOCH3, C2H5OH, CH3COOH theo thứ tự nhiệt độ sôi tăng dần là', ['HCOOCH3, C2H5OH, CH3COOH.', 'C2H5OH, HCOOCH3, CH3COOH.', 'CH3COOH, C2H5OH, HCOOCH3.', 'HCOOCH3, CH3COOH, C2H5OH.'], 0, 'Ester không có liên kết hydrogen liên phân tử (32 °C) < alcohol (78 °C) < carboxylic acid (118 °C).'),
    mc('Cho sơ đồ: Triolein → X → Y → Z (lần lượt qua H2, Ni, t°; NaOH dư, t°; HCl). Tên gọi của Z là', ['oleic acid.', 'linoleic acid.', 'stearic acid.', 'palmitic acid.'], 2, 'Triolein → tristearin → C17H35COONa → C17H35COOH (stearic acid).'),
    mc('Ester X có công thức phân tử C8H8O2, chứa vòng benzene, phản ứng với NaOH theo tỉ lệ mol 1 : 2 và thu được 2 muối. Công thức cấu tạo của X là', ['CH3COOC6H5.', 'C6H5COOCH3.', 'HCOOCH2C6H5.', 'C6H5CH2COOH.'], 0, 'CH3COOC6H5 + 2NaOH → CH3COONa + C6H5ONa + H2O.'),
    mc('Số đồng phân cấu tạo có công thức phân tử C4H8O2, tác dụng được với dung dịch NaOH nhưng không tham gia phản ứng tráng bạc là', ['2.', '3.', '4.', '5.'], 2, 'Gồm 2 acid (CH3CH2CH2COOH, (CH3)2CHCOOH) và 2 ester không phải formate (CH3COOC2H5, C2H5COOCH3).'),
    mc('Nhận xét nào sau đây về xà phòng và chất giặt rửa là sai?', ['Xà phòng là muối sodium hoặc potassium của acid béo.', 'Chất giặt rửa tổng hợp có thể dùng trong nước cứng.', 'Chất giặt rửa có gốc hydrocarbon phân nhánh khó bị vi sinh vật phân hủy hơn gốc không phân nhánh.', 'Mọi chất giặt rửa tổng hợp đều dễ bị phân hủy sinh học.'], 3, 'Một số chất giặt rửa tổng hợp (gốc phân nhánh) khó phân hủy sinh học nên gây ô nhiễm.'),
    mc('Phân tử khối của triolein là', ['806.', '878.', '884.', '890.'], 2, '(C17H33COO)3C3H5: C57H104O6 → M = 57 × 12 + 104 + 96 = 884.'),
    mc('Cho các phát biểu sau:\n(a) Ester no, đơn chức, mạch hở có công thức chung C_{n}H_{2n}O_{2}.\n(b) Phản ứng thủy phân ester trong môi trường kiềm còn gọi là phản ứng xà phòng hóa.\n(c) Phenyl acetate thủy phân trong dung dịch NaOH dư thu được hai muối.\n(d) Đun nóng dầu thực vật với H2 (Ni) thu được chất béo rắn hơn.\n(e) Chất béo và xà phòng đều tan tốt trong nước.\n(f) Xà phòng dùng tốt trong nước cứng.\nSố phát biểu đúng là', ['2.', '3.', '4.', '5.'], 2, 'Đúng: (a), (b), (c), (d). Sai: (e) chất béo không tan trong nước; (f) xà phòng bị kết tủa với Ca^{2+}, Mg^{2+}.'),
    mc('Cho các phát biểu sau:\n(a) Triolein và tristearin đều làm mất màu nước bromine.\n(b) Methyl acrylate và vinyl acetate đều làm mất màu nước bromine.\n(c) Hydrogen hóa hoàn toàn triolein thu được tristearin.\n(d) Thủy phân ethyl formate trong dung dịch H2SO4 loãng thu được HCOOH và C2H5OH.\n(e) Xà phòng hóa chất béo bằng KOH thu được muối potassium của acid béo.\nSố phát biểu sai là', ['1.', '2.', '3.', '4.'], 0, 'Chỉ (a) sai vì tristearin là chất béo no, không làm mất màu nước bromine.'),
    K.mcq(K.hhEster(), 2), K.mcq(K.hhMo(), 1), K.esterTuMuoi(), K.hieuSuat('mcq'), K.mcq(K.mAlcohol(), 2), K.mcq(K.dotChay(), 2), K.mcq(K.muoiKhan(), 2), K.tenEster()
  ]);

  E.part('de6', 'tf', [
    tf('Cho các chất: HCOOC2H5 (X), CH3COOCH3 (Y), C2H5COOH (Z).', [
      ['X và Y là đồng phân cấu tạo của nhau.', true, 'X, Y, Z đều có công thức phân tử C3H6O2; X và Y cùng là ester.'],
      ['X tham gia phản ứng tráng bạc, Y không tham gia phản ứng tráng bạc.', true, 'X là ester của formic acid nên có nhóm –CHO.'],
      ['Nhiệt độ sôi của Z cao hơn X và Y.', true, 'Z là acid nên có liên kết hydrogen liên phân tử.'],
      ['Thủy phân X và Y trong dung dịch NaOH thu được cùng một muối.', false, 'X cho HCOONa; Y cho CH3COONa.']]),
    tf('Khi xà phòng hóa triglyceride X bằng dung dịch NaOH dư, đun nóng, thu được glycerol, sodium oleate, sodium stearate và sodium palmitate.', [
      ['Phản ứng trên là phản ứng xà phòng hóa.', true, 'Thủy phân chất béo trong môi trường kiềm.'],
      ['1 mol X phản ứng tối đa với 3 mol NaOH.', true, 'X là triester.'],
      ['Có 3 đồng phân cấu tạo thỏa mãn tính chất của X.', true, 'Ba gốc khác nhau, vị trí ở giữa có 3 cách chọn → 3 đồng phân.'],
      ['Phân tử X có 5 liên kết π.', false, 'X có 3 liên kết π ở C=O và 1 liên kết π ở C=C (oleate), tổng 4.']]),
    tf('(SGK Hóa học 12 – CTST) Isopropyl formate là ester có trong cà phê Arabica.', [
      ['Công thức của isopropyl formate là HCOOCH(CH3)2.', true, 'Gốc isopropyl là –CH(CH3)2.'],
      ['Isopropyl formate là ester không no, đơn chức, mạch hở.', false, 'Đây là ester no, đơn chức, mạch hở (C4H8O2).'],
      ['Phần trăm khối lượng oxygen trong isopropyl formate khoảng 36,4%.', true, '%O = 32 : 88 × 100% ≈ 36,4%.'],
      ['Isopropyl formate được điều chế từ propan-1-ol và formic acid.', false, 'Phải dùng propan-2-ol (isopropyl alcohol).']]),
    tf('(SGK Hóa học 12 – CTST) Methyl methacrylate được dùng để điều chế poly(methyl methacrylate).', [
      ['Công thức cấu tạo của methyl methacrylate là CH2=C(CH3)COOCH3.', true, 'Gốc acid là methacrylate, gốc alcohol là methyl.'],
      ['Methyl methacrylate được điều chế từ methacrylic acid và ethyl alcohol.', false, 'Phải dùng methyl alcohol (methanol).'],
      ['Thủy phân hoàn toàn methyl methacrylate trong NaOH thu được 1 muối và 1 aldehyde.', false, 'Thu được muối CH2=C(CH3)COONa và alcohol CH3OH.'],
      ['1 mol methyl methacrylate tác dụng tối đa với 1 mol Br2.', true, 'Chỉ có một liên kết C=C.']])
  ]);

  E.part('de6', 'short', [
    sh('Có bao nhiêu hợp chất có công thức phân tử C3H6O2 tác dụng được với dung dịch NaOH?', 3, 'HCOOC2H5, CH3COOCH3 và C2H5COOH → 3 hợp chất.'),
    sh('Phân tử triolein (C17H33COO)3C3H5 có bao nhiêu nguyên tử hydrogen?', 104, '3 × 33 + 5 = 104.'),
    K.hhMo(), K.dauChuoi(), K.chatBeo(), K.hhEster()
  ]);
})(window);
