export const formatChatType = (chatType: string) => {
    if (chatType === 'personal') {
        return 'Личный чат';
    } else if (chatType === 'group') {
        return 'Группа';
    } else if (chatType === 'channel') {
        return 'Канал';
    }
    return chatType;
}
