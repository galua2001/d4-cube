# -*- coding: utf-8 -*-
"""
formulas.test.ts 및 formulaModal.test.ts 테스트 케이스 확장 및 보강 스크립트
"""
import sys

# 1. formulas.test.ts 업데이트
formulas_test_path = r'C:\Users\user\matrix-cube\src\data\formulas.test.ts'
with open(formulas_test_path, 'r', encoding='utf-8') as f:
    f_test = f.read()

# 18번 테스트의 godNumberFormulas.length 11 -> 14로 수정
f_test = f_test.replace("expect(godNumberFormulas.length).toBe(11);", "expect(godNumberFormulas.length).toBe(14);")

# 신규 테스트 39, 40, 41, 42 추가 (마지막 닫는 }); 바로 앞)
new_formula_tests = '''
  it('39. [D4 4수 마스터 공식: d4-checkerboard-super-4] 체커보드(X자/십자) 위상차 4수 메타데이터 & 단계별 Multi-Cancel All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-checkerboard-super-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-checkerboard-super-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: X자 타일(0, 2, 4, 6, 8)은 R180, 십자 타일(1, 3, 5, 7)은 R270
    const s0 = f!.steps![0].boardOps;
    [0, 2, 4, 6, 8].forEach(idx => expect(s0[idx]).toBe(D4.R180));
    [1, 3, 5, 7].forEach(idx => expect(s0[idx]).toBe(D4.R270));

    // 1수: 주대각선(↖) R180 ➔ 0, 4, 8번 셀 3개 동시 소거(트리플 킬)
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[4]).toBe(D4.ID);
    expect(s1[8]).toBe(D4.ID);

    // 2수: 부대각선(↗) R180 ➔ 2, 6번 코너 더블 킬 소거
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[6]).toBe(D4.ID);

    // 3수: 2행 R90 ➔ 3, 5번 변 더블 킬 소거
    const s3 = f!.steps![3].boardOps;
    expect(s3[3]).toBe(D4.ID);
    expect(s3[5]).toBe(D4.ID);

    // 4수: 2열 R90 ➔ 1, 4, 7번 2열 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('40. [D4 3수 마스터 공식: d4-t-spine-flush-3] T자형(1행+2열) 척추 정렬 3수 폭파 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-t-spine-flush-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-t-spine-flush-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0단계(초기) + 3수

    // 0단계: 1행(0, 1, 2)과 2열 척추(4, 7)만 뒤틀림 (외곽 3, 5, 6, 8은 이미 ID)
    const s0 = f!.steps![0].boardOps;
    expect(s0[0]).toBe(D4.R180);
    expect(s0[1]).toBe(D4.MX);
    expect(s0[2]).toBe(D4.R180);
    expect(s0[4]).toBe(D4.MX);
    expect(s0[7]).toBe(D4.MX);
    [3, 5, 6, 8].forEach(idx => expect(s0[idx]).toBe(D4.ID));

    // 1수: 1행 R90 ➔ 1번 타일 MX ∘ R90 = MD 위상 결합
    const s1 = f!.steps![1].boardOps;
    expect(s1[1]).toBe(D4.MD);

    // 2수: 2열 MX ➔ 4, 7번 척추 소거 (더블 킬), 1번 타일 R270 동기화
    const s2 = f!.steps![2].boardOps;
    expect(s2[4]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);
    expect(s2[0]).toBe(D4.R270);
    expect(s2[1]).toBe(D4.R270);
    expect(s2[2]).toBe(D4.R270);

    // 3수: 1행 R90 ➔ 1행 전체 3개 타일(0, 1, 2) 일제 소거 (트리플 킬 폭파) ➔ 전 타일 100% ID
    const s3 = f!.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('41. [D4 4수 마스터 공식: d4-chiral-pinwheel-4] 4방향 바람개비형 회전-반사 복합체 4수 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-chiral-pinwheel-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-chiral-pinwheel-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 중심 4번 ID, 변은 R270/MX 교차, 코너는 MAD/MD
    const s0 = f!.steps![0].boardOps;
    expect(s0[4]).toBe(D4.ID);
    expect(s0[1]).toBe(D4.R270);
    expect(s0[3]).toBe(D4.MX);
    expect(s0[5]).toBe(D4.MX);
    expect(s0[7]).toBe(D4.R270);

    // 1수: 1행 R90 ➔ 1번 변 타일 소거
    const s1 = f!.steps![1].boardOps;
    expect(s1[1]).toBe(D4.ID);

    // 2수: 3열 MX ➔ 2번 코너, 5번 변 더블 킬 소거
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[5]).toBe(D4.ID);

    // 3수: 3행 R90 ➔ 7번 변, 8번 코너 더블 킬 소거
    const s3 = f!.steps![3].boardOps;
    expect(s3[7]).toBe(D4.ID);
    expect(s3[8]).toBe(D4.ID);

    // 4수: 1열 MX ➔ 0, 3, 6번 셀 1열 일제 소거 (트리플 킬 폭파) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('42. D4 신규 마스터 공식 3선 i18n 번역 키 및 다국어 사전 등록 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4CheckerboardSuper4.title']).toContain('체커보드');
    expect(translations.en['formula.item.d4CheckerboardSuper4.title']).toContain('Checkerboard');
    expect(translations.ko['formula.item.d4TSpineFlush3.title']).toContain('T자형');
    expect(translations.en['formula.item.d4TSpineFlush3.title']).toContain('T-Spine');
    expect(translations.ko['formula.item.d4ChiralPinwheel4.title']).toContain('바람개비');
    expect(translations.en['formula.item.d4ChiralPinwheel4.title']).toContain('Pinwheel');

    // 실전 보드 연습 관련 키 검증
    expect(translations.ko['formula.btnPracticeOnBoard']).toContain('이 공식 직접 풀어보기');
    expect(translations.en['formula.btnPracticeOnBoard']).toContain('Practice on Board');
    expect(translations.ko['practice.badgeTitle']).toContain('연습 모드');
    expect(translations.en['practice.badgeTitle']).toContain('Practice');
  });
'''

last_brace_idx = f_test.rfind('});')
if last_brace_idx != -1:
    f_test = f_test[:last_brace_idx] + new_formula_tests + '\n});\n'
    with open(formulas_test_path, 'w', encoding='utf-8') as f:
        f.write(f_test)
    print("Successfully updated formulas.test.ts!")
else:
    print("Error: Could not find last }); in formulas.test.ts!")

# 2. formulaModal.test.ts 업데이트
modal_test_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.test.ts'
with open(modal_test_path, 'r', encoding='utf-8') as f:
    m_test = f.read()

new_modal_tests = '''
  it('18. D4 신규 마스터 공식 3선 (d4-checkerboard-super-4, d4-t-spine-flush-3, d4-chiral-pinwheel-4) 모달 인터랙티브 제어 및 단계별 스텝 시뮬레이션 검증', () => {
    controller.open('d4-checkerboard-super-4');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);
    controller.setStep(4);

    controller.selectFormula('d4-t-spine-flush-3');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);

    controller.selectFormula('d4-chiral-pinwheel-4');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);
    controller.setStep(4);

    controller.setCategory('god-number');
    expect(controller.isOpen()).toBe(true);

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('19. 공식 비법서 [🚀 이 공식 직접 풀어보기] 실전 연습 콜백 (setPracticeCallback) 연동 및 모달 자동 닫힘 검증', () => {
    const practiceSpy = vi.fn();
    controller.setPracticeCallback(practiceSpy);

    controller.open('d4-checkerboard-super-4');
    expect(controller.isOpen()).toBe(true);

    // 연습 버튼 mock 탐색 및 클릭 트리거
    const practiceBtn = elements['btn-practice-formula'];
    expect(practiceBtn).toBeDefined();

    practiceBtn.triggerEvent('click');

    // 콜백이 해당 공식 객체와 함께 호출되었는지 확인
    expect(practiceSpy).toHaveBeenCalledTimes(1);
    expect(practiceSpy.mock.calls[0][0].id).toBe('d4-checkerboard-super-4');

    // 모달이 자동으로 닫혔는지 검증
    expect(controller.isOpen()).toBe(false);
  });
'''

last_brace_modal = m_test.rfind('});')
if last_brace_modal != -1:
    m_test = m_test[:last_brace_modal] + new_modal_tests + '\n});\n'
    with open(modal_test_path, 'w', encoding='utf-8') as f:
        f.write(m_test)
    print("Successfully updated formulaModal.test.ts!")
else:
    print("Error: Could not find last }); in formulaModal.test.ts!")
