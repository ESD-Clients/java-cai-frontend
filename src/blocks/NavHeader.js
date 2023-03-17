import { FaBars, FaBell, FaSearch, FaTimes, FaUser } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavHeader () {

    const [menuActive, setMenuActive] = useState(false);
    const [searchActive, setSearchActive] = useState(true);
    
    
    return (
        <>
            <div className="sm:hidden">
                <div className="flex justify-between items-center bg-teal-500 h-[52px] pt-2 pb-2">
                    {
                        searchActive ? (
                            <>
                                <div className="mx-2 w-full">
                                    <div className="flex border-b border-teal-300 p-2">
                                        <input
                                            className="flex-1 bg-transparent outline-none placeholder:text-teal-300 text-white text-sm"
                                            placeholder="Search item or store here..."
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="font-bold text-xl text-teal-50 cursor-pointer mx-2">Thriftee</h2>
                                <div className="text-white">
                                    <FaSearch
                                        onClick={() => setSearchActive(true)}
                                        className="inline m-2"
                                    />
                                    <FaBars
                                        onClick={() => setMenuActive(true)}
                                        className="inline m-2"
                                    />
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
            <div className={"absolute top-0 w-full min-h-screen bg-modal sm:min-h-0 sm:relative sm:block " + (!menuActive ? "hidden" : "")}>
                <div className="bg-teal-500 pt-1 pb-2">
                    <div className="max-w-[1280px] mx-auto">
                        
                        <div className="sm:flex justify-between my-2">
                            <div className="flex justify-between">
                                <div 
                                    to=""
                                    className="mx-2 cursor-pointer "
                                >
                                    <div className="flex items-center">
                                        <h2 className="font-bold text-xl ml-2 text-teal-50">Thriftee</h2>
                                    </div>
                                    
                                </div>

                                <FaTimes 
                                    className="m-2 sm:hidden text-white cursor-pointer"
                                    onClick={() => setMenuActive(false)} 
                                />
                            </div>
                            <div className="hidden sm:flex items-center text-white cursor-pointer">
                                <div className="mx-2">
                                    <h2 className="text-sm font-bold">
                                        MY BIDS
                                        (<span>0</span>)
                                    </h2>
                                </div>

                                <div className="mx-2 relative cursor-pointer">
                                    <FaBell
                                        className="text-xl"
                                    />
                                    <div className="absolute flex justify-center items-center h-5 w-5 bg-teal-600 rounded-full -top-2 -right-2">
                                        <h2 className="text-[10px] font-bold">99</h2>
                                    </div>
                                </div>

                                <div className="mx-2 cursor-pointer">
                                    <div className="bg-teal-600 p-3 rounded-full">
                                        <FaUser
                                            className="text-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:hidden text-white font-semibold">
                                <div className="m-2">
                                    <FaUser
                                        className="inline"
                                    />
                                    <span className="ml-2 text-sm">Account</span>
                                </div>
                                <div className="m-2">
                                    <FaBell
                                        className="inline"
                                    />
                                    <span className="ml-2 text-sm">Notifications (99)</span>
                                </div>
                                <div className="m-2">
        
                                    <span className="text-sm">MY BIDS (0)</span>
                                </div>
                            </div>
                        </div>

                        <hr className="border-teal-300"/>

                        <div className="flex justify-between my-2">
                            <div className="flex items-center">
                                <ul className="text-white text-sm">
                                    <li className="sm:inline m-2">Home</li>
                                    <li className="sm:inline m-2">Categories</li>
                                    <li className="sm:inline m-2">Stores</li>
                                    <li className="sm:inline m-2">Contact Us</li>
                                    <li className="sm:inline m-2">About Us</li>
                                </ul>
                            </div>
                            <div className="hidden sm:block mx-2">
                                <div className="border border-teal-300 rounded-md px-4 py-2">
                                    <input
                                        className="bg-transparent outline-none placeholder:text-teal-300 min-w-[220px] text-teal-50 text-sm"
                                        placeholder="Search item or store here..."
                                    />
                                    <FaSearch
                                        className="inline text-teal-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}