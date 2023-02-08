import { useEffect, useLayoutEffect, useState } from "react";
interface TM<T>{
    [key: string]: T;
}
const M:TM<any> = {}
const getLocData = (key: string) => {
    const valueString = localStorage.getItem("locState")
    const valueobj: { [key: string]: any } = JSON.parse(valueString ?? "{}")
    const selfState = valueobj[key]
    if(selfState!==null&&selfState!==undefined){
        M[key] = selfState
        return selfState
    }
    
    
}
const saveLocData = <T>(key: string,newValue:T) => {
    const DBState: { [key: string]: any } = JSON.parse(localStorage.getItem("locState") ?? "{}")
    M[key] = newValue
    DBState[key] = newValue
    
    localStorage.setItem("locState", JSON.stringify(DBState));


}

export const useLocState = <T>(key: string, value: T): [T, (newValue: T) => void] => {

    const [state, setState] = useState(value);

    const locState: T = getLocData(key)

    useEffect(() => { //loc有值时赋值给state
        if (locState) {
            setState(locState)
        }
        


    }, [])
    useLayoutEffect(()=>{//loc无值时将state存储进loc
        if(!locState){
            saveLocData(key,state)
        }
    },[])

    const SetLocState = (newValue: T) => {

        setState(preValue => {
            saveLocData(key,newValue)
            return newValue
        })
    }

    return [state, SetLocState];
}
export const useLocValue = (key: string) =>{
    const [locValue,setLocValue] = useState(null)
    useEffect(()=>{
        if(locValue===null){
            setTimeout(() => {
                setLocValue( getLocData(key))
            }, 10);
            
        }
    },[locValue])

    if(locValue){
        return locValue
    }
    return M[key]//缓存数据 未读取loc前方便其他组件读取

    

}



