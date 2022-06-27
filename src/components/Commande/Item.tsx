import { useState } from "react"

const Item = (props: any) => {

    let {name} = props 

    let [quantity, setQuantity] = useState(0)
    let [container, setContainer] = useState("Grand Bac 1/1")

    const handleQuantityChange = (quantity: number) => {
        setQuantity(quantity)
        // TODO: Modifier dans le store
    }

    const handleContainerChange = (container: any) => {
        setContainer(container)
        // TODO: Modifier dans le store
    }

    return (
        <div className="flex justify-center">
            <p className="w-1/3 border border-black border-solid">{name}</p>
            <input className="w-1/3 border border-black border-solid" value={quantity} type="number" 
                    onChange={(event)=>handleQuantityChange(parseInt(event.target.value))} />
            <select className="w-1/3 border border-black border-solid" name="Container" id="container-select"
                    onChange={(event)=>handleContainerChange(event.target.value)}>
                <option value="Grand Bac 1/1" selected>Grand Bac 1/1</option>
                <option value="Sachet">Sachet</option>
                <option value="Barquette">Barquette</option>
            </select>
        </div>
    )
}

export default Item