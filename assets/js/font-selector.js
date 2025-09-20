// 폰트 선택기 JavaScript

function toggleFontSelector() {
    const fontOptions = document.getElementById('font-options');
    if (fontOptions.style.display === 'none' || fontOptions.style.display === '') {
        fontOptions.style.display = 'block';
    } else {
        fontOptions.style.display = 'none';
    }
}

function changeFont(fontType) {
    const html = document.documentElement;

    // 기존 폰트 클래스 제거 (html과 body 모두)
    html.classList.remove('font-chosun', 'font-seoul');
    document.body.classList.remove('font-chosun', 'font-seoul');

    // 새 폰트 클래스 추가 (html과 body 모두)
    html.classList.add('font-' + fontType);
    document.body.classList.add('font-' + fontType);

    // 선택 메뉴 닫기
    const fontOptions = document.getElementById('font-options');
    if (fontOptions) {
        fontOptions.style.display = 'none';
    }

    // 선택된 폰트를 localStorage에 저장
    localStorage.setItem('selectedFont', fontType);
}

// 페이지 로드시 저장된 폰트 설정 적용
document.addEventListener('DOMContentLoaded', function() {
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont) {
        changeFont(savedFont);
    } else {
        // 기본값으로 조선100년체 설정
        changeFont('chosun');
    }

    // 폰트 선택기 외부 클릭시 메뉴 닫기
    document.addEventListener('click', function(event) {
        const fontSelector = document.querySelector('.font-selector');
        const fontOptions = document.getElementById('font-options');

        if (!fontSelector.contains(event.target)) {
            fontOptions.style.display = 'none';
        }
    });
});