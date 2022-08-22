import stringToColor from "./stringToColor";

function stringAvatar(name: string) {
    const nameArr = name.split(' ');
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${nameArr[0].charAt(0)}${nameArr[nameArr.length-1].charAt(0)}`,
    };
}

export default stringAvatar;