import Item from './Item'

const Category = (props: any) => {

    let { categoryName, listItems } = props

    let list = listItems.map((item:any) => 
        <li key={item.name}>
            <Item id={item.id} name={item.name} containerProp={item.container} />
        </li>
    )

    return (
        <div className="ml-5">
            <h2 className="text-xl font-bold">{categoryName}</h2>
            <ol>
                {list}
            </ol>
        </div>
    )

}


export default Category