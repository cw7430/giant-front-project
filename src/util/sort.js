export const sortCode = (list, key, order = 'asc') => {
    return list.sort((a, b) => {
        const regex = /([a-zA-Z]+)(\d+)/;
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

export const sortDate = (list, key, order = 'asc') => {
    return list.sort((a, b) => {
        // 날짜 문자열을 Date 객체로 변환
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);

        // 날짜 비교
        if (order === 'asc') {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    });
};
