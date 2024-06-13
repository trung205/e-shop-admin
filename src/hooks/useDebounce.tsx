import { debounce } from "@/utils/funtions";
import {useEffect, useMemo, useRef} from "react";

export const useDebounce = (callback: any, time = 500) => {
	const ref: any = useRef();

	useEffect(() => {
			ref.current = callback;
	}, [callback]);

	const debouncedCallback = useMemo(() => {
			const func = () => {
			ref.current?.();
			};

			return debounce(func, time);
	}, []);

	return debouncedCallback;
};
