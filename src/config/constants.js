export const colorTheme = "#FADA5E";
export const linearColorTheme = {
    from: 'yellow',
    to: '#fada5e'
};
export const brand = 'HuYeFen';
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
export const customColorMap = {
    // 'SILVER': {
	// 	color: 'rgb(192, 192, 192)'
	// },
	// 'BLACK': {
	// 	color: 'rgba(0, 0, 0, 0.65)'
	// },
	// 'RED': {
	// 	color: 'rgba(255, 0, 0, 0.65)'
	// },
	// 'BLUE': {
	// 	color: 'rgba(0, 0, 255, 0.65)'
	// },
	// 'LIME': {
	// 	color: 'rgba(0, 255, 0, 0.65)'
	// },
	// 'YELLOW': {
	// 	color: 'rgb(255, 255, 0)'
	// },
	// 'CYAN': {
	// 	color: 'rgb(0, 255, 255)'
	// },
	// 'MAGENTA': {
	// 	color: 'rgb(255, 0, 255)'
	// },
	// 'GRAY': {
	// 	color: 'rgb(128, 128, 128)'
	// },
	// 'MAROON': {
	// 	color: 'rgb(128, 0, 0)'
	// },
	// 'OLIVE': {
	// 	color: 'rgb(128, 128, 0)'
	// },
	// 'GREEN': {
	// 	color: 'rgb(0, 128, 0)'
	// },
	// 'PURPLE': {
	// 	color: 'rgb(128, 0, 128)'
	// },
	// 'TEAL': {
	// 	color: 'rgb(0, 128, 128)'
	// },
	// 'WHITE': {
	// 	color: 'rgb(255, 255, 255)'
	// }
};
export const customStyleMap = {
	'HIGHLIGHT': {
		background: '#fada5e',
		padding: '0.5px',
		color: 'black',
		borderRadius: '2px',
		border: '0.2px solid #FADA5E',
    },
    'BOLD': {
		fontWeight: 'bold'
    },
	...customColorMap
};
export const videoRates = {
    '0.25': '0.25',
    '0.5': '0.5',
    '0.75': '0.75',
    '1.0': 'Normal',
    '1.25': '1.25',
    '1.5': '1.5',
    '1.75': '1.75',
    '2.0': '2.0'
};
export const avatarSrc = 'https://scontent.fdad1-1.fna.fbcdn.net/v/t1.0-9/31913935_1717355651692555_3814867150049378304_n.jpg?_nc_cat=103&_nc_eui2=AeGgfa-fjxwJu4-euNHVct9mMIl_ii-8HobprSKtHHGPmVsMCbhofDD9lkyD0E3TnXmw9eA88TrapYMJ0YwKQWBAAlfoRlDInP46xYnEIOBjzg&_nc_oc=AQlNPR5E8p93LgqTm2HppA81qOnzgHK_HuO7n5BAyvCShh_9G8H2tB9qVHBjxRIj-Ag&_nc_ht=scontent.fdad1-1.fna&oh=b641bf1810fa2239a20d6fa5d270487c&oe=5ED47CE5';