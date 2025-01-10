export const sortCode = (list, key, order = 'asc') => {
    return [...list].sort((a, b) => {
        const regex = /([a-zA-Z]+)(\d+)/;

        // null 또는 undefined 체크 (항상 맨 아래로 보냄)
        if (!a[key] && !b[key]) return 0; // 둘 다 null인 경우 위치 변경 없음
        if (!a[key]) return 1; // a가 null이면 뒤로
        if (!b[key]) return -1; // b가 null이면 뒤로

        const [, aPrefix, aNumber] = a[key].match(regex);
        const [, bPrefix, bNumber] = b[key].match(regex);

        // 알파벳 부분 비교
        const prefixComparison = aPrefix.localeCompare(bPrefix);
        if (prefixComparison !== 0) {
            return order === 'asc' ? prefixComparison : -prefixComparison;
        }

        // 숫자 부분 비교
        return order === 'asc' 
            ? Number(aNumber) - Number(bNumber) 
            : Number(bNumber) - Number(aNumber);
    });
};

export const sortNumber = (list, key, order = 'asc') => {
    return [...list].sort((a, b) => {
        // null 또는 undefined 체크 (항상 맨 아래로 보냄)
        if (a[key] == null && b[key] == null) return 0; // 둘 다 null 또는 undefined인 경우 위치 변경 없음
        if (a[key] == null) return 1; // a가 null 또는 undefined면 뒤로
        if (b[key] == null) return -1; // b가 null 또는 undefined면 뒤로

        // 숫자 비교
        return order === 'asc'
            ? a[key] - b[key]
            : b[key] - a[key];
    });
};

export const sortDate = (list, key, order = 'asc') => {
    return [...list].sort((a, b) => {
        // null 또는 undefined 체크 (항상 맨 아래로 보냄)
        if (!a[key] && !b[key]) return 0; // 둘 다 null인 경우 위치 변경 없음
        if (!a[key]) return 1; // a가 null이면 뒤로
        if (!b[key]) return -1; // b가 null이면 뒤로

        // 날짜 문자열을 Date 객체로 변환
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);

        // 날짜 비교
        return order === 'asc' 
            ? dateA - dateB 
            : dateB - dateA;
    });
};
