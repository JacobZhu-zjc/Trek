/* eslint-disable @typescript-eslint/no-explicit-any */
let getAccessTokenSilently: any = null;

export const sec = {
    getAccessTokenSilently: () => getAccessTokenSilently,
    setAccessTokenSilently: (func: any) => (getAccessTokenSilently = func)
};