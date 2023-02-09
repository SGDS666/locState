# useLocState
## 这是一个小到甚至可以直接复制到你项目中用来代替useState 的项目

# 特性
## 状态持久化 状态分离 存储在localStorage中
### 原理其实很简单 每个状态其实都是一个useState 只是做了些小改动 
### 状态会有一个副本合集 存在一个js对象中 这个副本只是用来记录 不会导致组件更新
### 每一次setState 都是改变原有的useState中的数据 
### 每一次读取 如果localStorage中有数据则返回localStorage中的数据 如果没有 则是从副本中读取
### 基于这一特性 每次父组件更新状态 子组件们都会重新读取localStorage的状态   所以甚至可以做一个局部的状态管理 但是不太推荐
### 设计的初衷只是为了方便一些需要状态持久化的场景

#### 先来看看数据持久化
#### 最常见的控制数字加减
```javascript
const Count = () => {
    const [count, setCount] = useLocState('count', 0)

    return (
        <div className={styles.box1} >
            <div onClick={e => {setCount(count - 1)}}>-</div>
            <input
                type="number"
                value={count}
                onChange={e => {
                    setCount(+e.target.value)

                }} />
            <div onClick={e => {setCount(count + 1)}}>+</div>
        </div>
    )
}

```






#### 状态正常并存储在本地
<img width="2033" alt="image" src="https://user-images.githubusercontent.com/86196091/217624364-af1378ac-885c-469e-a0ba-328fc1fe9886.png">


#### 刷新页面试试
![Kapture 2023-02-09 at 02 55 53](https://user-images.githubusercontent.com/86196091/217625698-85bf0a10-2719-43ff-9d1e-1a339ce3626d.gif)

#### 数据依旧存在

#### 来看看设计前意料之外的局部状态管理(我承认这在某种方面算是一个bug 但是貌似提供了便利 所以就保留了下来)
#### 功能依旧是数字加减 但是多了一个状态记录加减的操作记录 并且导入了一个子组件
```javascript
const Count2 = () => {
    const [count, setCount] = useLocState('count', 0)
    const [countlist, setCountList] = useLocState<number[]>('countlist', [])
    return (
        <>
            <CountHistory />
            <div className={styles.box1} >

                <div onClick={e => {
                    setCount(count - 1)
                    setCountList([...countlist, count])
                }}>-</div>
                <input
                    type="number"
                    value={count}
                    onChange={e => {
                        setCount(+e.target.value)

                    }} />
                <div onClick={e => {
                    setCount(count + 1)
                    setCountList([...countlist, count])
                }}>+</div>
            </div>
        </>

    )


//子组件不接受任何props 只是读取localStorage中的数据  
const CountHistory = () => {
    const countlist:number[] = useLocValue("countlist");
    const ref:any = useRef(null);
    useEffect(()=>{
        ref.current.scrollTop = ref.current.scrollHeight;
    })
    return (
        <div ref={ref} className={styles.box2} >
            {
                countlist?.map((item, index) => {
                    return (
                        <div key={index}>{item}</div>
                    )
                })
            }
        </div>
    )
}

```
<img width="1468" alt="image" src="https://user-images.githubusercontent.com/86196091/217637630-bb1d37a8-9301-47e4-9f80-2fb353d8c328.png">


![Kapture 2023-02-09 at 04 03 08](https://user-images.githubusercontent.com/86196091/217639050-c34ade6d-6d05-4eb4-8f51-3f207b26fa02.gif)


#### 因为加减操作是父组件进行的 所以每次更新状态都会导致自组件读取本地数据 从而更新页面
#### 所以如果父祖件没有进行更新 uselocValue(key:string) 只会运行一次 所以不要想用本库当全局状态管理 他本身只是一个持久化状态的 useState

#### 另外通过useLocState解构的setState在useLocState1.0.4版本之后才能像useState中的setState一样传入函数


