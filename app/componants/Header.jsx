"use client";

import { useState } from 'react';
import { PhoneOutlined, WhatsAppOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Modal, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
    addItemToCart,
    updateItemQuantity,
} from '@/app/redux/cartSlice'; 

export default function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const totalUniqueItems = cartItems.length;

    const toggleCart = () => {
        setIsCartOpen(prev => !prev);
    };

    const handleClose = () => {
        setIsCartOpen(false);
    };

    const handleIncreaseQuantity = (item) => {
        dispatch(addItemToCart(item));
    };

    const handleDecreaseQuantity = (item) => {
        const currentQuantity = item.quantity;

        if (currentQuantity > 1) {
            dispatch(updateItemQuantity({ id: item._id, quantity: currentQuantity - 1 }));
        } else if (currentQuantity === 1) {
            if (window.confirm("Do you want to remove this item from the cart?")) {
                dispatch(updateItemQuantity({ id: item._id, quantity: 0 }));
            }
        }
    };

    const totalPrice = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    const handleGoToCart = () => {
        handleClose(); 
    };

    const handleCheckout = () => {
        handleClose();
    };

    return (
        <div className='sticky top-0 z-50 mx-auto'>
            <div className="bg-gray-100 flex justify-center gap-4 p-2 text-center text-sm shadow-sm">
                <Link href='tel:090909090' className="transition-transform transform hover:scale-105 hover:shadow-md flex items-center justify-center bg-white border border-gray-300 rounded-lg px-2 py-1 text-blue-600 hover:bg-blue-50">
                    <PhoneOutlined className="mr-2" />
                    <span className="font-small text-xs">Order via Call</span>
                </Link>
                <Link href='https://wa.me/090909090' className="transition-transform transform hover:scale-105 hover:shadow-md flex items-center justify-center bg-white border border-gray-300 rounded-lg px-2 py-1 text-green-600 hover:bg-green-50">
                    <WhatsAppOutlined className="mr-2" />
                    <span className="font-medium text-xs">Order via WhatsApp</span>
                </Link>
            </div>

            <header className="relative flex flex-col items-center p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center w-full">
                    <Link href="/">
                        <img src="/images/logo.svg" alt="Logo" className="h-10" />
                    </Link>

                    <div className="relative">
                        <button className="cart-button" onClick={toggleCart}>
                            <Badge count={totalUniqueItems} showZero={true}>
                                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
                            </Badge>
                        </button>
                    </div>
                </div>
            </header>

            <Modal
                title="Cart Items"
                visible={isCartOpen}
                onCancel={handleClose}
                footer={null}
                width={400}
            >
                <ul>
                    {totalUniqueItems > 0 ? (
                        cartItems.map(item => (
                            <li key={item._id} className="flex justify-between items-center py-2 border-b border-gray-300">
                                <div className="flex flex-col">
                                    <span className="font-bold">{item.name}</span>
                                    <span className="text-sm text-gray-500">Price: ₹{item.price}</span>
                                    <span className="text-sm text-gray-500">Total: ₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center">
                                    <Button
                                        onClick={() => handleDecreaseQuantity(item)}
                                        className="border-blue-500 text-blue-500 mr-2"
                                        size="small"
                                    >
                                        -
                                    </Button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <Button
                                        onClick={() => handleIncreaseQuantity(item)}
                                        className="border-blue-500 text-blue-500"
                                        size="small"
                                    >
                                        +
                                    </Button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No items in the cart.</p>
                    )}
                </ul>
                {totalUniqueItems > 0 && (
                    <div className="mt-4">
                        <span className="text-xl font-bold">Total: ₹ {totalPrice.toFixed(2)}</span>
                        <div className="flex justify-between mt-4">
                            <Link href="/cart">
                                <Button type="primary" className="w-full mr-2" onClick={handleGoToCart}>Go to Cart</Button>
                            </Link>
                            <Link href="/checkout">
                                <Button type="primary" className="w-full" onClick={handleCheckout}>Checkout</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

