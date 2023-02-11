export declare const useLocState: <T>(key: string, value: T) => [T, (newValue: T | ((preValue: T) => T)) => void];
export declare const useLocValue: (key: string) => any;
export declare const clearLocValue: () => void;
