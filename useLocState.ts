import { useEffect, useLayoutEffect, useState } from "react";
interface TM<T> {
    [key: string]: T;
}
const M: TM<any> = {}


const getLocData = (key: string) => {
    const valueString = localStorage.getItem("locState")
    const valueobj: { [key: string]: any } = JSON.parse(valueString ?? "{}")
    const selfState = valueobj[key]
    if (selfState !== null && selfState !== undefined) {
        M[key] = selfState
        return selfState
    }


}
const saveLocData = <T>(key: string, newValue: T) => {
    const DBState: { [key: string]: any } = JSON.parse(localStorage.getItem("locState") ?? "{}")
    M[key] = newValue
    DBState[key] = newValue

    localStorage.setItem("locState", JSON.stringify(DBState));


}

export const useLocState = <T>(key: string, value: T): [T, (newValue:T|((preValue:T)=>T)) => void] => {

    const [state, setState] = useState(value);

    const locState: T = getLocData(key)

    useEffect(() => { //loc有值时赋值给state
        if (locState) {
            setState(locState)
        }



    }, [])
    useLayoutEffect(() => {//loc无值时将state存储进loc
        if (!locState) {
            saveLocData(key, state)
        }
    }, [])

    const SetLocState = (newValue:T|((preValue:T)=>T)) => {
        if(typeof newValue === "function"){
            setState(preValue => {
                 //@ts-ignore
                saveLocData(key, newValue(preValue))
                //@ts-ignore
                return newValue(preValue)
            })
        }else{
            setState(preValue => {
                saveLocData(key, newValue)
                return newValue
            })
        }
        
    }

    return [state, SetLocState];
}
export const useLocValue = (key: string) => {
    const [locValue, setLocValue] = useState(null)
    const newValue = getLocData(key)
    useEffect(() => {
        if(locValue===null||locValue===undefined){
            setLocValue(newValue)
            return
        }
        if (Array.isArray(locValue) && Array.isArray(newValue) ) {
            //@ts-ignore
            if (newValue.length !== locValue.length) {
                //@ts-ignore
                setLocValue(newValue)
                return
            }
        }
        

    }, [newValue])

    if (locValue) {
        return locValue
    }
    return M[key]



}


export const clearLocValue= () => {
    localStorage.removeItem("locState")
}

