import { useState } from "react";

export default function App() {
    const [shoppingList, setShoppingList] = useState([]);

    function handleAddItem(item) {
        const copyList = [...shoppingList];
        setShoppingList([...copyList, item]);
    }

    function handleDeleteItem(curId) {
        setShoppingList(shoppingList.filter((item) => item.id !== curId));
    }

    function handleChecked(itemId) {
        setShoppingList(shoppingList.map((item) => (item.id === itemId ? { ...item, bought: !item.bought } : item)));
    }

    function handleUpdateQuantity(id, newNum) {
        setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, quantity: newNum } : item)));
    }

    function handleClearAll() {
        setShoppingList([]);
    }

    return (
        <>
            <Footer />
            <div className="container">
                <div className="search-bar-div">
                    <SearchBar onSetShoppingList={handleAddItem} />
                </div>

                {shoppingList.length > 0 ? (
                    <ShoppingList shoppingList={shoppingList} onHandleDelete={handleDeleteItem} onHandleChecked={handleChecked} onUpdateQuantity={handleUpdateQuantity} onClearAll={handleClearAll} />
                ) : (
                    <NoSHoppingItem />
                )}
            </div>
        </>
    );
}

function ShoppingList({ shoppingList, onHandleDelete, onHandleChecked, onUpdateQuantity, onClearAll }) {
    const [orderBy, setOrderBy] = useState("input");

    let sortedList;

    if (orderBy === "input") sortedList = shoppingList;
    if (orderBy === "quantity") sortedList = shoppingList.slice().sort((a, b) => a.quantity - b.quantity);
    if (orderBy === "bought") sortedList = shoppingList.slice().sort((a, b) => a.bought - b.bought);

    return (
        <div>
            {shoppingList.length > 0 && <div className="divider"></div>}
            {shoppingList.length > 0 && <OrderBy onClearAll={onClearAll} orderBy={orderBy} setOrderBy={setOrderBy} />}
            <ul className="shopping-list">
                {sortedList.map((item) => (
                    <ShoppingItem key={item.id} item={item} onHandleDelete={onHandleDelete} onHandleChecked={onHandleChecked} onUpdateQuantity={onUpdateQuantity} />
                ))}
            </ul>
        </div>
    );
}

function ShoppingItem({ item, onHandleDelete, onHandleChecked, onUpdateQuantity }) {
    const [quantity, setQuantity] = useState(1);

    function handleQuantity(e) {
        const newQuantity = Number(e.target.value);
        setQuantity(Number(e.target.value));
        onUpdateQuantity(item.id, newQuantity);
    }
    return (
        <li className={`shopping-item fade-in`}>
            <input type="checkbox" checked={item.bought} onChange={() => onHandleChecked(item.id)} />
            <p className={item.bought ? "line-through" : ""}>{item.shopList}</p>
            <select className="selection order-by" value={quantity} onChange={handleQuantity}>
                {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                ))}
            </select>
            <button className="cross-button" onClick={() => onHandleDelete(item.id)}>
                ❌
            </button>
        </li>
    );
}

function SearchBar({ onSetShoppingList }) {
    const [search, setSearch] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!search) return;
        const id = window.crypto.randomUUID();
        const newEntry = { id, shopList: search, bought: false, quantity: 1 };
        onSetShoppingList(newEntry);
        setSearch("");
    }

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Add Shopping Items..." className="search-bar fade-in" value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button className="fade-out">Submit</button>}
        </form>
    );
}

function NoSHoppingItem() {
    return (
        <div className="no-shopping-items fade-in">
            <img src="Search_Icons.png" alt="no-Items" className="search-image" />
            <p>Try Adding Items...</p>
        </div>
    );
}

function OrderBy({ onClearAll, setOrderBy, orderBy }) {
    return (
        <div className="order-by-div">
            <select className="order-by" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                <option value={"input"}>Order By Input</option>
                <option value={"quantity"}>Order By Quantity</option>
                <option value={"bought"}>Order By Finished</option>
            </select>
            <button onClick={onClearAll}>Clear All</button>
        </div>
    );
}

function Footer() {
    return (
        <div className="footer">
            <img src="cart_icon.png" alt="logo_shopping_cart" />
            <div className="app-name">
                <h1>Shopping List</h1>
                <p>"Shop Smart, Live Easy!"</p>
            </div>
        </div>
    );
}
