import { ViewStyle } from "react-native";

export function cn(...inputs: (string | undefined | null | false | ViewStyle | ViewStyle[])[]) {
    return inputs
        .filter(Boolean)
        .map((input) => {
            if (typeof input === "string") {
                return input;
            }
            return "";
        })
        .join(" ");
} 