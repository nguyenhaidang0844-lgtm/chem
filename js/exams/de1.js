/* Đề 1 · Ester */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, K = g.Calc;
  function mc(t, o, a, e) { return { text: t, options: o, answer: a, explain: e }; }
  function tf(t, arr) { return { text: t, items: arr.map(function (x) { return { t: x[0], a: x[1], explain: x[2] }; }) }; }
  function sh(t, a, e, tol) { return { text: t, answer: a, explain: e, tol: tol !== undefined ? tol : 0.01 }; }

  E.part('de1', 'mcq', [
    mc('(SGK – Cánh Diều) Hợp chất nào dưới đây thuộc loại ester?', ['HOCH2CH2CHO.', 'CH3CH2CH2COOH.', 'HOCH2COCH3.', 'CH3CH2COOCH3.'], 3, 'Ester có nhóm –COO– nối hai gốc hydrocarbon: CH3CH2COOCH3 (methyl propionate).'),
    mc('Ester no, đơn chức, mạch hở có công thức tổng quát là', ['C_{n}H_{2n}O_{2} (n ≥ 2).', 'C_{n}H_{2n-2}O_{2} (n ≥ 2).', 'C_{n}H_{2n+2}O_{2} (n ≥ 2).', 'C_{n}H_{2n}O (n ≥ 2).'], 0, 'Ester no, đơn chức, mạch hở có 1 liên kết π (ở C=O) nên có dạng C_{n}H_{2n}O_{2} với n ≥ 2.'),
    mc('Ethyl propionate là ester có mùi thơm của dứa. Công thức của ethyl propionate là', ['HCOOC2H5.', 'C2H5COOC2H5.', 'C2H5COOCH3.', 'CH3COOCH3.'], 1, 'Ethyl = C2H5– (gốc alcohol), propionate = C2H5COO– (gốc acid) → C2H5COOC2H5.'),
    mc('So với các acid, alcohol có cùng số nguyên tử carbon thì ester có nhiệt độ sôi', ['thấp hơn do khối lượng phân tử của ester nhỏ hơn nhiều.', 'thấp hơn do giữa các phân tử ester không tồn tại liên kết hydrogen.', 'cao hơn do giữa các phân tử ester có liên kết hydrogen bền vững.', 'cao hơn do khối lượng phân tử của ester lớn hơn nhiều.'], 1, 'Phân tử ester không có nguyên tử H linh động (–OH) nên không tạo liên kết hydrogen liên phân tử, do đó sôi thấp hơn acid và alcohol.'),
    mc('Ester nào sau đây tác dụng với dung dịch NaOH thu được ethyl alcohol?', ['CH3COOC2H5.', 'CH3COOC3H7.', 'C2H5COOCH3.', 'HCOOCH3.'], 0, 'CH3COOC2H5 + NaOH → CH3COONa + C2H5OH.'),
    mc('Ester X có công thức phân tử C4H6O2, khi thủy phân trong môi trường acid thu được acetaldehyde. Công thức cấu tạo thu gọn của X là', ['CH2=CHCOOCH3.', 'CH3COOCH=CH2.', 'HCOOC(CH3)=CH2.', 'HCOOCH=CH-CH3.'], 1, 'CH3COOCH=CH2 + H2O ⇌ CH3COOH + CH3CHO (vinyl alcohol không bền chuyển thành acetaldehyde).'),
    mc('Thủy phân hoàn toàn hỗn hợp ethyl propionate và ethyl formate trong dung dịch NaOH, thu được sản phẩm gồm', ['1 muối và 1 alcohol.', '2 muối và 2 alcohol.', '1 muối và 2 alcohol.', '2 muối và 1 alcohol.'], 3, 'Hai ester cho hai muối khác nhau (C2H5COONa, HCOONa) nhưng cùng một alcohol là C2H5OH.'),
    mc('Ester X có công thức phân tử C4H8O2. Thủy phân X trong dung dịch H2SO4 loãng, đun nóng, thu được ethyl alcohol và chất hữu cơ Y. Công thức của Y là', ['CH3OH.', 'CH3COOH.', 'C2H5COOH.', 'HCOOH.'], 1, 'X là CH3COOC2H5 nên Y là CH3COOH.'),
    mc('Phát biểu nào sau đây sai?', ['Ethyl formate có khả năng tham gia phản ứng tráng bạc.', 'Phân tử methyl methacrylate chỉ có một liên kết π.', 'Ethyl acetate có công thức phân tử là C4H8O2.', 'Methyl acrylate có khả năng tham gia phản ứng cộng Br2 trong dung dịch.'], 1, 'Methyl methacrylate CH2=C(CH3)COOCH3 có 2 liên kết π (một ở C=C, một ở C=O).'),
    mc('Công thức của triolein là', ['(C17H33COO)3C3H5.', '(HCOO)3C3H5.', '(C2H5COO)3C3H5.', '(CH3COO)3C3H5.'], 0, 'Triolein là triester của glycerol với oleic acid C17H33COOH.'),
    mc('Chất béo động vật hầu hết ở thể rắn do chứa', ['chủ yếu gốc acid béo không no.', 'glycerol trong phân tử.', 'chủ yếu gốc acid béo no.', 'gốc acid béo.'], 2, 'Gốc acid béo no làm chất béo có nhiệt độ nóng chảy cao nên ở thể rắn.'),
    mc('Thủy phân tristearin ((C17H35COO)3C3H5) trong dung dịch NaOH, thu được muối có công thức là', ['C2H3COONa.', 'HCOONa.', 'C17H33COONa.', 'C17H35COONa.'], 3, 'Tristearin cho sodium stearate C17H35COONa và glycerol.'),
    mc('Phát biểu nào sau đây không đúng?', ['Chất béo là triester của glycerol và các monocarboxylic acid có mạch carbon dài, không phân nhánh.', 'Chất béo chứa chủ yếu các gốc no của acid thường là chất rắn ở nhiệt độ phòng.', 'Chất béo chứa chủ yếu các gốc không no của acid thường là chất lỏng ở nhiệt độ phòng và được gọi là dầu.', 'Phản ứng thủy phân chất béo trong môi trường kiềm là phản ứng thuận nghịch.'], 3, 'Thủy phân chất béo trong kiềm (xà phòng hóa) là phản ứng một chiều.'),
    mc('(SGK – KNTT) Cho các phát biểu sau:\n(1) Một số ester có mùi thơm nên được dùng làm chất tạo hương trong công nghiệp thực phẩm và mĩ phẩm.\n(2) Chất béo là triester của glycerol với acid béo.\n(3) Chất béo tan tốt trong nước.\n(4) Mỡ động vật, dầu thực vật có thể được dùng làm nguyên liệu để sản xuất xà phòng.\n(5) Phản ứng thủy phân ester trong môi trường acid luôn là phản ứng một chiều.\nSố phát biểu đúng là', ['2.', '3.', '4.', '5.'], 1, 'Đúng: (1), (2), (4). Sai: (3) chất béo không tan trong nước; (5) thủy phân trong acid là phản ứng thuận nghịch.'),
    K.hieuSuat('mcq'), K.hydroTriolein('mcq'), K.esterTuMuoi(), K.tenEster()
  ]);

  E.part('de1', 'tf', [
    tf('(SGK Hóa học 12 – Cánh Diều) Cho các ester: C2H5COOCH3 (1); CH3CH2CH2COOC2H5 (2); CH3COOCH3 (3); C2H5COOC2H5 (4).', [
      ['Tên gọi các ester lần lượt là: (1) methyl propionate; (2) ethyl butyrate; (3) methyl acetate; (4) ethyl propionate.', true, 'Đọc tên gốc alcohol trước rồi tên gốc acid.'],
      ['Ester (2) và (4) có mùi dứa chín.', true, 'Ethyl butyrate và ethyl propionate đều có mùi thơm của dứa.'],
      ['Độ tan trong nước của các ester giảm dần theo thứ tự: (2) > (1) > (3) > (4).', false, 'Ester có số C càng nhiều càng ít tan: (3) > (1) > (4) > (2).'],
      ['Các ester tạo liên kết hydrogen với nước nên tan nhiều trong nước hơn hẳn alcohol và carboxylic acid có cùng số nguyên tử carbon.', false, 'Ester ít tan trong nước, kém tan hơn alcohol và acid cùng số C.']]),
    tf('(SGK Hóa học 12 – KNTT) Tiến hành thí nghiệm: cho vào hai ống nghiệm (1) và (2) mỗi ống 1,0 mL ethyl acetate; thêm 2 mL dung dịch H2SO4 20% vào ống (1) và 2 mL dung dịch NaOH 30% vào ống (2); đun cách thủy cả hai ống ở 60 – 70 °C.', [
      ['Sau khi thêm dung dịch ở bước 2, chất lỏng trong cả hai ống nghiệm đều đồng nhất.', false, 'Ester ít tan trong nước nên chất lỏng tách thành hai lớp.'],
      ['Sau khi đun, sản phẩm thu được ở cả hai ống nghiệm đều là CH3COOH.', false, 'Ống (2) trong môi trường kiềm tạo muối CH3COONa.'],
      ['Sau khi đun, ống (1) thể tích lớp chất lỏng phía trên giảm; ống (2) tạo thành hỗn hợp đồng nhất.', true, 'Ester bị thủy phân nên lớp ester giảm dần (ống 1) và tan hết (ống 2).'],
      ['Phản ứng ở ống (1) là thuận nghịch, phản ứng ở ống (2) là một chiều.', true, 'Thủy phân trong acid thuận nghịch, trong kiềm một chiều.']]),
    tf('(SGK – Cánh Diều) Salicylic acid (2-hydroxybenzoic acid) phản ứng với methyl alcohol, xúc tác sulfuric acid, thu được methyl salicylate (C8H8O3) dùng làm thuốc giảm đau.', [
      ['Công thức của salicylic acid là o–HO–C6H4–COOH.', true, 'Nhóm –OH và –COOH ở vị trí ortho.'],
      ['Phản ứng giữa salicylic acid và methyl alcohol có mặt sulfuric acid là phản ứng thuận nghịch.', true, 'Đây là phản ứng ester hóa.'],
      ['1 mol methyl salicylate tác dụng với Na dư thu được 1 mol khí H2.', false, 'Phân tử chỉ có 1 nhóm –OH phenol nên thu được 0,5 mol H2.'],
      ['1 mol methyl salicylate tác dụng tối đa với 1 mol NaOH.', false, 'Phản ứng được với 2 mol NaOH (nhóm –OH phenol và nhóm ester).']]),
    tf('(Đề TN THPT QG – 2023) Thủy phân hoàn toàn triglyceride X trong dung dịch NaOH thu được C17H33COONa và C3H5(OH)3.', [
      ['X là triolein có công thức (C17H33COO)3C3H5.', true, 'Muối C17H33COONa là sodium oleate nên X là triolein.'],
      ['1 mol X tác dụng với NaOH dư thu được 3 mol C17H33COONa.', true, 'X là triester nên tạo 3 mol muối.'],
      ['X là chất béo no, ở trạng thái rắn ở điều kiện thường.', false, 'Triolein chứa gốc không no nên là chất lỏng.'],
      ['1 mol X tác dụng tối đa với 3 mol H2 (Ni, t°) thu được Y; Y tác dụng với NaOH dư thu được muối C17H33COONa.', false, 'Y là tristearin, thu được muối C17H35COONa.']])
  ]);

  E.part('de1', 'short', [
    sh('Cho các ester sau: HCOOCH3; CH3COOCH3; (COOCH3)2; (HCOO)2C2H4; CH2=CHCOOCH3; C2H5COOC2H5; CH3COOC6H5. Có bao nhiêu ester no, đơn chức, mạch hở?', 3, 'Thỏa mãn: HCOOCH3, CH3COOCH3, C2H5COOC2H5 → 3 ester.'),
    sh('Số hợp chất đơn chức, là đồng phân cấu tạo của nhau, có cùng công thức phân tử C4H8O2 và đều tác dụng được với dung dịch NaOH là bao nhiêu?', 6, 'Gồm 2 acid (CH3CH2CH2COOH, (CH3)2CHCOOH) và 4 ester (HCOOCH2CH2CH3, HCOOCH(CH3)2, CH3COOC2H5, C2H5COOCH3) → 6.'),
    sh('Cho a mol ester X (C9H10O2) tác dụng vừa đủ với 2a mol NaOH, thu được dung dịch không có phản ứng tráng bạc. Có bao nhiêu công thức cấu tạo phù hợp với X?', 4, 'X là ester của phenol, không phải formate: C2H5COOC6H5 (1) và CH3COOC6H4CH3 (o, m, p: 3) → 4 công thức.'),
    K.mAlcohol(), K.dauChuoi(), K.phanTramO()
  ]);
})(window);
