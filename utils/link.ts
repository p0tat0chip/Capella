import * as Linking from "expo-linking";

const linking = {
    prefixes: ["myapp://", "https://myapp.com"],
    config: {
        screens: {
            Home: "home",
            SOS: "sos",
            Profile: "profile/:id",
        },
    },
};

export default linking;