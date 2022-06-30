import { useState } from "react"
import store from "../../store"


const getContainerID = (containerName: string):string => {

    let container_id = ""

    store.containerCategories.forEach(((category: any)=>{
        category.containers.forEach((container:any)=>{
            if (container.name===containerName)
            container_id = container.id
        })  
    }))
    return container_id
}


const Item = (props: any) => {

    let {id, name, containerProp} = props 

    let [quantity, setQuantity] = useState(0)
    let [container, setContainer] = useState(containerProp)

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity)
        
        if (newQuantity !== 0) {
            store.updateOrder(id, name, newQuantity, {name: container, id:getContainerID(container)})
        }
    }

    const handleContainerChange = (newContainer: string) => {
        setContainer(newContainer)
        
        if (quantity !== 0) {
            store.updateOrder(id, name, quantity, {name: newContainer, id:getContainerID(newContainer)})
        }
    }

    
    return (
        <div className="flex justify-center">
            <p className="w-1/3 border border-black border-solid truncate">{name}</p>
            <input className="w-1/3 border border-black border-solid" value={quantity} type="number" min="0" disabled={store.orderStatus!=="On order"}
                    onChange={(event)=>handleQuantityChange(parseInt(event.target.value))} />
            <select className="w-1/3 border border-black border-solid" name="Container" id="container-select" defaultValue={containerProp}
                    onChange={(event)=>handleContainerChange(event.target.value)} disabled={store.orderStatus!=="On order"}>
                {store.containerCategories.map(category=>
                    <optgroup label={category.name}>
                        {category.containers.map(container=>
                            <option value={container.name}>
                                {container.name}
                            </option>
                        )}
                    </optgroup>
                )}
            </select>
        </div>
    )
}

export default Item