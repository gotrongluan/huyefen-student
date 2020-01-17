import { useRef, useEffect } from 'react';

export const usePrevious = (variable) => {
    const myRef = useRef();
    useEffect(() => {
        myRef.current = variable;
    });
    return myRef.current;
};

export const useEffectOnlyUpdates = (effect, conditionArray) => {
    const myRef = useRef(false);
    useEffect(() => {
        if (myRef.current) return effect();
    }, [effect]);
    useEffect(() => {
        myRef.current = true;
    }, []);
};