export const colorTheme = "#FADA5E";
export const linearColorTheme = {
    from: 'yellow',
    to: '#fada5e'
};
export const brand = 'Hanjh';
export const tagColor = id => {
    const colors = [
        'green', 'geekblue', 'gold', 'volcano', 'cyan', 'magenta', 'lime', 'orange', 'blue', 'red', 'purple'
    ];
    const n = colors.length;
    return colors[id % n];
};
export const featuredColor = id => {
    const colors = [
        '#87d068','#f50', '#fada5e', '#1890ff'
    ];
    const n = colors.length;
    return colors[id % n];
};