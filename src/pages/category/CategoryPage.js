import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import MyContext from "../../context/myContext";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";

const CategoryPage = () => {
    const { categoryname } = useParams();
    const { getAllProduct, loading } = useContext(MyContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const [selectedDate, setSelectedDate] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Removed from cart");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (loading) return;

        const filtered = getAllProduct.filter((product) => {
            const isAvailableOnSelectedDate = selectedDate ? product.availableDates?.includes(selectedDate) : true;
            return product.category.toLowerCase().includes(categoryname.toLowerCase()) && isAvailableOnSelectedDate;
        });

        setFilteredProducts(filtered);
    }, [getAllProduct, cartItems, categoryname, selectedDate, loading]);

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center">
                    <Loader />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mt-10">
                <div className="">
                    <h1 className="text-center mb-5 text-2xl font-semibold capitalize">{categoryname}</h1>
                </div>
                <div className="flex justify-center mt-5">
                   <p className="text-2xl text-center mb-5">Date :  </p> <input 
                        type="date" 
                        name="date" 
                        id="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <section className="text-gray-600 body-font">
                    <div className="container px-5 py-5 mx-auto">
                        <div className="flex flex-wrap -m-4 justify-center">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item, index) => {
                                    const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);
                                    return (
                                        <div key={index} className="p-4 w-full md:w-1/4">
                                            <div className="h-full border border-gray-300 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                                <img
                                                    onClick={() => navigate(`/productinfo/${item.id}`)}
                                                    className="lg:h-80 h-96 w-full"
                                                    src={item.productImageUrl}
                                                    alt="Product"
                                                />
                                                <div className="p-6">
                                                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                                        All In One
                                                    </h2>
                                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                        {item.title.substring(0, 25)}
                                                    </h1>
                                                    <p className={`text-${isInCart ? 'red' : 'green'}-900`}>
                                                        {isInCart ? 'Not Available' : 'Available'}
                                                    </p>
                                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                        ₹{item.price}
                                                    </h1>
                                                    <div className="flex justify-center">
                                                        {isInCart ? (
                                                            <button
                                                                onClick={() => deleteCart(item)}
                                                                className="bg-red-600 hover:bg-red-700 w-full text-white py-[4px] rounded-lg font-bold"
                                                            >
                                                                Remove From Cart
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => addCart(item)}
                                                                className="bg-orange-500 hover:bg-orange-600 w-full text-white py-[4px] rounded-lg font-bold"
                                                            >
                                                                Add To Cart
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center w-full">
                                    <img
                                        className="mb-2 mx-auto"
                                        src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png"
                                        alt="Not Found"
                                    />
                                    <h1 className="text-black text-xl">No {categoryname} products found</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}

export default CategoryPage;
