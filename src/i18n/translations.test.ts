import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCurrentLang, setLang, t, onLangChange, translations } from './translations';
import { soundEngine } from '../audio/audioEngine';

describe('i18n 다국어 번역 시스템 (translations.ts)', () => {
  beforeEach(() => {
    // 테스트마다 기본 언어 en으로 리셋
    setLang('en');
  });

  it('기본 언어는 en(영어)이어야 함', () => {
    expect(getCurrentLang()).toBe('en');
  });

  it('setLang()으로 언어를 ko 또는 en으로 전환할 수 있어야 함', () => {
    setLang('ko');
    expect(getCurrentLang()).toBe('ko');

    setLang('en');
    expect(getCurrentLang()).toBe('en');
  });

  it('onLangChange() 리스너가 언어 변경 시 호출되어야 함', () => {
    const cb = vi.fn();
    const unsubscribe = onLangChange(cb);

    setLang('ko');
    expect(cb).toHaveBeenCalledWith('ko');

    setLang('en');
    expect(cb).toHaveBeenCalledWith('en');

    unsubscribe();
    cb.mockClear();

    setLang('ko');
    expect(cb).not.toHaveBeenCalled();
  });

  it('동일한 언어로 setLang() 호출 시 리스너가 중복 호출되지 않아야 함', () => {
    setLang('en');
    const cb = vi.fn();
    onLangChange(cb);

    setLang('en'); // 변경 없음
    expect(cb).not.toHaveBeenCalled();
  });

  it('t() 함수가 현재 언어에 맞는 텍스트를 반환해야 함', () => {
    setLang('en');
    expect(t('header.title')).toBe('Galois Cube');
    expect(t('controls.undo')).toBe('↩ Undo');
    expect(t('tutorial.next1')).toBe('Next (1/3) ➔');

    setLang('ko');
    expect(t('header.title')).toBe('갈루아 큐브');
    expect(t('controls.undo')).toBe('↩ 되돌리기');
    expect(t('tutorial.next1')).toBe('다음 (1/3) ➔');
  });

  it('t() 함수가 params 템플릿 대체 변수를 정상 치환해야 함', () => {
    setLang('en');
    expect(t('board.row', { n: 2 })).toBe('R2');
    expect(t('board.col', { n: 3 })).toBe('C3');
    expect(t('status.stageInfo', { size: 3, moves: 4 })).toBe('3×3 (Min 4 Moves Guaranteed)');

    setLang('ko');
    expect(t('board.row', { n: 2 })).toBe('2행');
    expect(t('board.col', { n: 3 })).toBe('3열');
    expect(t('status.stageInfo', { size: 3, moves: 4 })).toBe('3×3 (최소 4수 보장 퍼즐)');
  });

  it('미등록 키 요청 시 fallback으로 키 자체를 반환해야 함', () => {
    expect(t('unknown.non_existent_key')).toBe('unknown.non_existent_key');
  });

  it('translations 딕셔너리에 영어와 한국어 모든 필수 키가 매핑되어 있어야 함', () => {
    const enKeys = Object.keys(translations.en);
    const koKeys = Object.keys(translations.ko);

    expect(enKeys.length).toBeGreaterThan(40);
    expect(koKeys.length).toBeGreaterThan(40);

    // 주요 키들이 양쪽 모두에 존재하는지 검증
    const requiredKeys = [
      'header.title',
      'settings.difficulty',
      'controls.undo',
      'controls.hint',
      'controls.solution',
      'tutorial.headerTitle',
      'tutorial.step1Name',
      'tutorial.step2Name',
      'tutorial.step3Name',
      'about.title',
      'about.confirm'
    ];

    requiredKeys.forEach(k => {
      expect(translations.en[k]).toBeDefined();
      expect(translations.ko[k]).toBeDefined();
    });
  });

  it('audioEngine.speak()이 브라우저 음성합성 API 호출 시 언어별(en/ko) 음성 파라미터를 올바르게 전달해야 함', () => {
    const mockCancel = vi.fn();
    const mockSpeak = vi.fn();
    const mockVoices = [
      { name: 'Microsoft David - English (United States)', lang: 'en-US' },
      { name: 'Google US English', lang: 'en-US' },
      { name: 'Microsoft Heami - Korean (Korean)', lang: 'ko-KR' },
      { name: 'Google 한국의', lang: 'ko-KR' }
    ];

    const mockSynth = {
      cancel: mockCancel,
      speak: mockSpeak,
      getVoices: vi.fn().mockReturnValue(mockVoices)
    };

    class MockSpeechSynthesisUtterance {
      public text: string;
      public lang = '';
      public rate = 1;
      public pitch = 1;
      public voice: any = null;
      constructor(text: string) {
        this.text = text;
      }
    }

    vi.stubGlobal('window', {
      speechSynthesis: mockSynth,
      SpeechSynthesisUtterance: MockSpeechSynthesisUtterance
    });
    vi.stubGlobal('SpeechSynthesisUtterance', MockSpeechSynthesisUtterance);
    vi.stubGlobal('speechSynthesis', mockSynth);

    // 영어 모드 speak
    setLang('en');
    soundEngine.speak('Hello world');
    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    const enUtter = mockSpeak.mock.calls[0][0];
    expect(enUtter.lang).toBe('en-US');
    expect(enUtter.text).toBe('Hello world');

    mockSpeak.mockClear();

    // 한국어 모드 speak
    setLang('ko');
    soundEngine.speak('안녕하세요');
    expect(mockSpeak).toHaveBeenCalled();
    const koUtter = mockSpeak.mock.calls[0][0];
    expect(koUtter.lang).toBe('ko-KR');
    expect(koUtter.text).toBe('안녕하세요');
  });
});
