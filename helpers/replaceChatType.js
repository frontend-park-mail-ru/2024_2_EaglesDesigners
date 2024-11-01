module.exports = function(chatType) {
    if (chatType === 'personal') {
        return 'Личный чат';
    } else if (chatType === 'group') {
        return 'Группа';
    } else if (chatType === 'channel') {
        return 'Канал';
    }
    return chatType; // Возвращаем оригинальное значение, если не совпадает
}
