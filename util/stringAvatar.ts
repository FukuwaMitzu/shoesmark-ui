import stringToColor from "./stringToColor";

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0].charAt(0)}${name.split(' ')[1][0].charAt(0)}`,
    };
}

export default stringAvatar;