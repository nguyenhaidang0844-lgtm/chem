/* Đề 4 · Tổng hợp chương 1 (số 1) */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, K = g.Calc;
  function mc(t, o, a, e) { return { text: t, options: o, answer: a, explain: e }; }
  function tf(t, arr) { return { text: t, items: arr.map(function (x) { return { t: x[0], a: x[1], explain: x[2] }; }) }; }
  function sh(t, a, e, tol) { return { text: t, answer: a, explain: e, tol: tol !== undefined ? tol : 0.01 }; }

  E.part('de4', 'mcq', [
    mc('Tên gọi của HCOOC2H5 là', ['methyl formate.', 'ethyl formate.', 'methyl acetate.', 'ethyl acetate.'], 1, 'HCOO– là gốc formate, C2H5– là gốc ethyl → ethyl formate.'),
    mc('Ester X có mùi đặc trưng giống mùi táo, công thức phân tử C5H10O2. Thủy phân X trong dung dịch NaOH thu được sodium butanoate và một alcohol. Công thức của X là', ['CH3COOCH2CH2CH3.', 'CH3CH2COOCH2CH3.', 'CH3CH2CH2COOCH3.', '(CH3)2CHCOOCH2CH3.'], 2, 'Muối sodium butanoate là CH3CH2CH2COONa nên X là CH3CH2CH2COOCH3 (methyl butanoate).'),
    mc('Phản ứng hóa học nào sau đây xảy ra thuận nghịch?', ['Đun nóng ethyl acetate với dung dịch H2SO4 loãng.', 'Đun nóng ethyl acetate với dung dịch NaOH.', 'Hydrogen hóa chất béo có gốc acid không no.', 'Đun nóng chất béo với dung dịch NaOH.'], 0, 'Thủy phân ester trong môi trường acid là phản ứng thuận nghịch; trong kiềm là một chiều.'),
    mc('Ester CH3COOCH=CH2 có tên gọi là', ['vinyl acetate.', 'allyl acetate.', 'methyl acrylate.', 'ethyl acetate.'], 0, 'CH2=CH– là gốc vinyl, CH3COO– là gốc acetate.'),
    mc('Ester nào sau đây có khả năng tham gia phản ứng tráng bạc?', ['HCOOCH3.', 'CH3COOCH3.', 'CH3COOC2H5.', 'C2H5COOCH3.'], 0, 'Chỉ ester của formic acid (HCOOR) có nhóm –CHO nên tráng bạc được.'),
    mc('Đun nóng phenyl acetate CH3COOC6H5 với lượng dư dung dịch NaOH, thu được các sản phẩm hữu cơ là', ['CH3COONa và C6H5OH.', 'CH3COONa và C6H5ONa.', 'CH3COOH và C6H5ONa.', 'CH3COONa và CH3OH.'], 1, 'CH3COOC6H5 + 2NaOH → CH3COONa + C6H5ONa + H2O (phenol phản ứng tiếp với NaOH).'),
    mc('Chất nào sau đây không phải là ester?', ['CH3COOC2H5.', 'HCOOCH3.', 'C2H5OC2H5.', 'CH3COOCH=CH2.'], 2, 'C2H5OC2H5 (diethyl ether) không có nhóm –COO–.'),
    mc('Số đồng phân cấu tạo ester có công thức phân tử C3H6O2 là', ['1.', '2.', '3.', '4.'], 1, 'Gồm HCOOC2H5 và CH3COOCH3.'),
    mc('Isoamyl acetate có mùi đặc trưng của', ['chuối chín.', 'dứa chín.', 'táo.', 'lê.'], 0, 'Isoamyl acetate còn gọi là dầu chuối.'),
    mc('Ester nào sau đây không thể điều chế trực tiếp bằng phản ứng ester hóa giữa carboxylic acid và alcohol?', ['CH3COOC2H5.', 'HCOOCH3.', 'CH3COOCH=CH2.', 'C2H5COOCH3.'], 2, 'Vinyl alcohol CH2=CH–OH không bền, chuyển thành CH3CHO nên không dùng làm nguyên liệu ester hóa.'),
    mc('Chất nào sau đây không thuộc loại lipid?', ['Chất béo.', 'Sáp.', 'Glucose.', 'Steroid.'], 2, 'Glucose là carbohydrate. Lipid gồm chất béo, sáp, steroid, phospholipid,…'),
    mc('Chất nào sau đây là chất béo no?', ['(C17H35COO)3C3H5.', '(C17H33COO)3C3H5.', '(C17H31COO)3C3H5.', 'C3H5(OH)3.'], 0, 'Tristearin chỉ chứa gốc stearate no.'),
    mc('Chất nào sau đây làm mất màu nước bromine?', ['Tristearin.', 'Tripalmitin.', 'Triolein.', 'Ethyl acetate.'], 2, 'Triolein có liên kết C=C ở gốc oleate nên cộng Br2.'),
    mc('Xà phòng hóa hoàn toàn tristearin bằng dung dịch KOH dư, sản phẩm thu được là', ['C17H35COOK và C3H5(OH)3.', 'C17H35COONa và C3H5(OH)3.', 'C17H35COOH và C3H5(OH)3.', 'C17H33COOK và C3H5(OH)3.'], 0, '(C17H35COO)3C3H5 + 3KOH → 3C17H35COOK + C3H5(OH)3.'),
    K.hieuSuat('mcq'), K.mcq(K.dotChay(), 2), K.esterTuMuoi(), K.mcq(K.muoiKhan(), 2)
  ]);

  E.part('de4', 'tf', [
    tf('Ethyl acetate là dung môi dùng để tách, chiết chất hữu cơ; được điều chế từ acetic acid và ethanol với xúc tác H2SO4 đặc.', [
      ['Công thức phân tử của ethyl acetate là C4H8O2.', true, 'CH3COOC2H5 có 4 C, 8 H, 2 O.'],
      ['Phản ứng điều chế ethyl acetate từ acetic acid và ethanol là phản ứng thuận nghịch.', true, 'Đây là phản ứng ester hóa, đạt trạng thái cân bằng.'],
      ['Thủy phân ethyl acetate trong dung dịch NaOH thu được C2H5COONa và CH3OH.', false, 'Sản phẩm là CH3COONa và C2H5OH.'],
      ['Ethyl acetate tham gia được phản ứng tráng bạc.', false, 'Ethyl acetate không chứa nhóm –CHO nên không tráng bạc.']]),
    tf('Vinyl acetate CH3COOCH=CH2 được dùng để sản xuất poly(vinyl acetate).', [
      ['Vinyl acetate là ester không no, đơn chức, mạch hở.', true, 'Có một liên kết C=C ở gốc alcohol.'],
      ['Thủy phân vinyl acetate trong dung dịch NaOH thu được CH3COONa và CH3CHO.', true, 'Vinyl alcohol sinh ra không bền, chuyển thành acetaldehyde.'],
      ['Vinyl acetate làm mất màu nước bromine.', true, 'Có liên kết C=C nên cộng Br2.'],
      ['Vinyl acetate được điều chế trực tiếp từ acetic acid và vinyl alcohol.', false, 'Vinyl alcohol không bền nên không dùng để điều chế.']]),
    tf('Tripalmitin là chất béo có trong mỡ động vật và dầu cọ.', [
      ['Tripalmitin là chất rắn ở điều kiện thường.', true, 'Chất béo no ở trạng thái rắn.'],
      ['Công thức của tripalmitin là (C15H31COO)3C3H5.', true, 'Gốc palmitate là C15H31COO–.'],
      ['Để xà phòng hóa hoàn toàn 1 mol tripalmitin cần 1 mol NaOH.', false, 'Cần 3 mol NaOH vì tripalmitin là triester.'],
      ['Tripalmitin cộng H2 (Ni, t°) tạo thành tristearin.', false, 'Tripalmitin là chất béo no, không cộng H2.']]),
    tf('(SGK – KNTT) Cho ba hợp chất butan-1-ol, propanoic acid, methyl acetate và các giá trị nhiệt độ sôi (không theo thứ tự): 57 °C; 118 °C; 141 °C.', [
      ['Nhiệt độ sôi của butan-1-ol là 141 °C.', false, 'Butan-1-ol sôi ở 118 °C; propanoic acid sôi ở 141 °C.'],
      ['Methyl acetate có nhiệt độ sôi thấp nhất (57 °C) do giữa các phân tử không có liên kết hydrogen.', true, 'Ester không có H linh động.'],
      ['Propanoic acid có nhiệt độ sôi cao nhất vì liên kết hydrogen giữa các phân tử carboxylic acid bền hơn giữa các phân tử alcohol.', true, 'Carboxylic acid có thể tạo dimer bền.'],
      ['Với các chất có khối lượng phân tử tương đương, nhiệt độ sôi tăng dần: hydrocarbon < aldehyde, ketone, ester < alcohol < carboxylic acid.', true, 'Đây là quy luật chung về nhiệt độ sôi.']])
  ]);

  E.part('de4', 'short', [
    sh('Có bao nhiêu đồng phân cấu tạo là ester có công thức phân tử C4H8O2?', 4, 'HCOOCH2CH2CH3, HCOOCH(CH3)2, CH3COOC2H5, C2H5COOCH3 → 4 đồng phân.'),
    sh('Cho các chất: CH3COOC2H5; CH2=CHCOOCH3; (C17H33COO)3C3H5; (C17H35COO)3C3H5; CH3COOH; C17H31COOH. Có bao nhiêu chất làm mất màu nước bromine?', 3, 'Các chất có liên kết C=C: CH2=CHCOOCH3, (C17H33COO)3C3H5, C17H31COOH → 3 chất.'),
    K.chatBeo(), K.hieuSuat('short'), K.hydroTriolein('short'), K.dotChay()
  ]);
})(window);
