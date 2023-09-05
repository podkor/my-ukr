const dataTabTitles = new Map([
    [1, "Таблиця Коефіцієнтів UEFA"],
    [2, "Українська Премєр Ліга Таблиця"],
    [3, "Grandma's Smuzi (Кавера Українською)"],
    [4, "Deep State Map"],
    [5, "Курс Долара до Гривні"],
    [6, "Live результати"],
    [7, "Мапа Повітряних тривог"],
    [8, "Втрати русні"],
    [9, "Wikipedia Україна"],
    [10, "Kalush"],
    [11, "Donate Фонд Притули"],
    [12, "Donate Повернись Живим"],
    [13, "YouTube Телебачення Торонто"],
    [14, "YouTube Стерненко"],
    [15, "Youtube Бутусов"],
    [16, "Погода"]
]);

function getTitleById(id){
    return dataTabTitles.get(id);
}

module.exports = {
    getTitleById: getTitleById
}

