import {EffectCallback, useCallback} from "react";
import {useFocusEffect} from "@react-navigation/native";

export function useOnFocusOnceEffect(effect: EffectCallback) {
    useFocusEffect(
        useCallback(effect, [])
    );
}