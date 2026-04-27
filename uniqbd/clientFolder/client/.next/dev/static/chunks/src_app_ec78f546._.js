(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/TiltCard.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const TiltCard = ({ product })=>{
    _s();
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const imgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleMouseMove = (e)=>{
        const card = cardRef.current;
        const img = imgRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * 10;
        const rotateY = (x - centerX) / centerX * -10;
        // small transition for smooth real-time response
        card.style.transition = "transform 0.05s ease-out";
        img.style.transition = "transform 0.05s ease-out";
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        img.style.transform = `translateX(${rotateY * 4}px) translateY(${rotateX * 4}px) translateZ(40px)`;
    };
    const handleMouseLeave = ()=>{
        const card = cardRef.current;
        const img = imgRef.current;
        // Smooth reset
        card.style.transition = "transform 0.3s ease-out";
        img.style.transition = "transform 0.3s ease-out";
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        img.style.transform = "translateX(0px) translateY(0px) translateZ(0px)";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group perspective-[1000px] w-[500px] h-[500px] m-20",
        style: {
            perspective: "1000px"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: cardRef,
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
            className: "relative bg-imgcard backdrop-blur-3xl cursor-pointer   flex flex-col items-center justify-center px-4 py-4 rounded-xl text-sm font-medium text-button   hover:shadow-2xl border-button shadow-lg shadow-button/30 transform-gpu will-change-transform",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bg-button/30 blur-3xl opacity-40 top-[-20px] left-[-20px] rounded-full pointer-events-none"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/TiltCard.jsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bg-button/20 blur-3xl opacity-30 bottom-[-20px] right-[-20px] rounded-full pointer-events-none"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/TiltCard.jsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    ref: imgRef,
                    src: product.img,
                    alt: product.name,
                    className: "object-contain z-10",
                    style: {
                        transformStyle: "preserve-3d"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/components/TiltCard.jsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "mt-4 text-text font-semibold text-center z-20 relative",
                    children: product.name
                }, void 0, false, {
                    fileName: "[project]/src/app/components/TiltCard.jsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/components/TiltCard.jsx",
            lineNumber: 47,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/components/TiltCard.jsx",
        lineNumber: 43,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(TiltCard, "MDmnKeV/jGf+7r9d6p7q6HieqKQ=");
_c = TiltCard;
const __TURBOPACK__default__export__ = TiltCard;
var _c;
__turbopack_context__.k.register(_c, "TiltCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/data/games.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// data/games.js
__turbopack_context__.s([
    "games",
    ()=>games
]);
const games = [
    {
        id: 1,
        name: "PUBG UC",
        slug: "pubg-uc",
        category: "top-up",
        img: "/images/uc.png",
        packages: [
            {
                uc: "60 UC",
                price: "70TK"
            },
            {
                uc: "325 UC",
                price: "TK350"
            },
            {
                uc: "660 UC",
                price: "TK700"
            }
        ]
    },
    {
        id: 2,
        name: "Free Fire Diamonds",
        slug: "free-fire",
        category: "top-up",
        img: "/images/diamond.png",
        packages: [
            {
                uc: "100 Diamonds",
                price: "TK90"
            },
            {
                uc: "310 Diamonds",
                price: "TK260"
            },
            {
                uc: "520 Diamonds",
                price: "TK420"
            }
        ]
    },
    {
        id: 3,
        name: "COD Points",
        slug: "cod-points",
        category: "top-up",
        img: "/images/cp.png",
        packages: [
            {
                uc: "80 CP",
                price: "TK90"
            },
            {
                uc: "420 CP",
                price: "TK420"
            },
            {
                uc: "880 CP",
                price: "TK800"
            }
        ]
    },
    {
        id: 4,
        name: "COD Points",
        slug: "cod-points-2",
        category: "top-up",
        img: "/images/cp.png",
        packages: [
            {
                uc: "80 CP",
                price: "TK90"
            },
            {
                uc: "420 CP",
                price: "TK420"
            },
            {
                uc: "880 CP",
                price: "TK800"
            }
        ]
    },
    {
        id: 5,
        name: "PUBG UC",
        slug: "pubg-uc-2",
        category: "top-up",
        img: "/images/uc.png",
        packages: [
            {
                uc: "60 UC",
                price: "70TK"
            },
            {
                uc: "325 UC",
                price: "TK350"
            },
            {
                uc: "660 UC",
                price: "TK700"
            }
        ]
    },
    {
        id: 6,
        name: "COD Points",
        slug: "cod-points-3",
        category: "top-up",
        img: "/images/cp.png",
        packages: [
            {
                uc: "80 CP",
                price: "TK90"
            },
            {
                uc: "420 CP",
                price: "TK420"
            },
            {
                uc: "880 CP",
                price: "TK800"
            }
        ]
    },
    {
        id: 7,
        name: "Embybd",
        slug: "embybd-movie-server",
        category: "subscription",
        img: "/images/Emby-UniQbd.png",
        packages: [
            {
                uc: "1 Month",
                price: "TK90"
            },
            {
                uc: "3 Month",
                price: "TK260"
            },
            {
                uc: "6 Month",
                price: "TK420"
            }
        ]
    },
    {
        id: 8,
        name: "FIFA Mobile",
        slug: "fifa-mobile",
        category: "top-up",
        img: "/images/FIFA-Mobile.png",
        packages: [
            {
                uc: "100 Points",
                price: "TK90"
            },
            {
                uc: "310 Points",
                price: "TK260"
            },
            {
                uc: "520 Points",
                price: "TK420"
            }
        ]
    },
    {
        id: 9,
        name: "Once Human",
        slug: "once-human",
        category: "top-up",
        img: "/images/Once-Human.png",
        packages: [
            {
                uc: "100 Credits",
                price: "TK90"
            },
            {
                uc: "310 Credits",
                price: "TK260"
            },
            {
                uc: "520 Credits",
                price: "TK420"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/data/giftcard.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// data/games.js
__turbopack_context__.s([
    "giftcard",
    ()=>giftcard
]);
const giftcard = [
    {
        id: 1,
        name: "itunes gift card",
        slug: "itunes-card",
        img: "/images/itunes.png",
        packages: [
            {
                uc: "60 UC",
                price: "৳70"
            },
            {
                uc: "325 UC",
                price: "৳350"
            },
            {
                uc: "660 UC",
                price: "৳700"
            }
        ]
    },
    {
        id: 2,
        name: "Discord Nitro",
        slug: "discord-nitro",
        img: "/images/nitro.png",
        packages: [
            {
                uc: "100 Diamonds",
                price: "৳90"
            },
            {
                uc: "310 Diamonds",
                price: "৳260"
            },
            {
                uc: "520 Diamonds",
                price: "৳420"
            }
        ]
    },
    {
        id: 3,
        name: "Stream Gift Card",
        slug: "stream-card",
        img: "/images/Stream.png",
        packages: [
            {
                uc: "80 CP",
                price: "৳90"
            },
            {
                uc: "420 CP",
                price: "৳420"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            }
        ]
    },
    {
        id: 4,
        name: "Visa Card",
        slug: "visa-card",
        img: "/images/visa.png",
        packages: [
            {
                uc: "80 CP",
                price: "৳90"
            },
            {
                uc: "420 CP",
                price: "৳420"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            }
        ]
    },
    {
        id: 5,
        name: "Amazon Gift Card",
        slug: "amazon-gift-card",
        img: "/images/Amazon.png",
        packages: [
            {
                uc: "80 CP",
                price: "৳90"
            },
            {
                uc: "420 CP",
                price: "৳420"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            }
        ]
    },
    {
        id: 6,
        name: "PlayStation Gift Card",
        slug: "playstation-gift-card",
        img: "/images/playstation.png",
        packages: [
            {
                uc: "80 CP",
                price: "৳90"
            },
            {
                uc: "420 CP",
                price: "৳420"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            }
        ]
    },
    {
        id: 7,
        name: "PlayStation Gift Card",
        slug: "playstation-gift-card",
        img: "/images/playstation.png",
        packages: [
            {
                uc: "80 CP",
                price: "৳90"
            },
            {
                uc: "420 CP",
                price: "৳420"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            }
        ]
    },
    {
        id: 8,
        name: "Amazon Gift Card",
        slug: "amazon-gift-card",
        img: "/images/Amazon.png",
        packages: [
            {
                uc: "80 CP",
                price: "৳90"
            },
            {
                uc: "420 CP",
                price: "৳420"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            },
            {
                uc: "880 CP",
                price: "৳800"
            }
        ]
    },
    {
        id: 9,
        name: "itunes gift card",
        slug: "itunes-card",
        img: "/images/itunes.png",
        packages: [
            {
                uc: "60 UC",
                price: "৳70"
            },
            {
                uc: "325 UC",
                price: "৳350"
            },
            {
                uc: "660 UC",
                price: "৳700"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/products/[slug]/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TiltCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/TiltCard.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$games$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/data/games.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$giftcard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/data/giftcard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CartContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-toastify/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const ProductDetails = ()=>{
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const slug = params.slug;
    // Find product from games or giftcards
    const product = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$games$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["games"].find((game)=>game.slug === slug) || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$2f$giftcard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["giftcard"].find((gc)=>gc.slug === slug);
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mt-20 text-2xl font-bold",
            children: "Product Not Found"
        }, void 0, false, {
            fileName: "[project]/src/app/products/[slug]/page.js",
            lineNumber: 22,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const [selectedPackage, setSelectedPackage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [gameID, setGameID] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const { addToCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CartContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartContext"]);
    const handleAddToCart = ()=>{
        if (!selectedPackage) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("⚠️ Please select a package!");
        // Top-up products require a Game ID
        if (product.category?.toLowerCase().includes("top up") && !gameID.trim()) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("⚠️ Please enter your Player ID!");
        }
        addToCart({
            product,
            selectedPkg: {
                id: selectedPackage.id,
                label: selectedPackage.label,
                price: selectedPackage.price,
                img: selectedPackage.img
            },
            playerId: gameID,
            quantity
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("🛒 Added to cart!");
    };
    // Calculate subtotal and total
    const price = selectedPackage ? Number(selectedPackage.price.replace("TK", "").replace(",", "").trim()) : product.price ? Number(product.price.replace("TK", "").replace(",", "").trim()) : 0;
    const subtotal = price * quantity;
    const total = subtotal;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "min-h-screen py-16 px-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-10 grid md:grid-cols-2 gap-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$TiltCard$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    product: product
                }, product.id, false, {
                    fileName: "[project]/src/app/products/[slug]/page.js",
                    lineNumber: 74,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-text text-4xl font-bold mb-6",
                            children: product.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/products/[slug]/page.js",
                            lineNumber: 78,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        product.packages && product.packages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-text text-xl font-semibold mb-4",
                                    children: "Select Package"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-8",
                                    children: product.packages.map((pack, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>setSelectedPackage(pack),
                                            className: `package relative group cursor-pointer
                      transform-gpu transition-all duration-500
                      hover:-translate-y-1 hover:scale-[1.03]
                      active:scale-[0.97]
                      flex flex-col items-center justify-center
                      px-5 py-5 rounded-md text-sm font-semibold text-text
                      bg-gradient-to-br from-package/40 via-package/10 to-transparent
                      backdrop-blur-3xl border border-white/10
                      ${selectedPackage === pack ? "-translate-y-1 scale-[1.05] shadow" : "shadow-md hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg font-bold tracking-wide",
                                                    children: pack.price
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                                    lineNumber: 105,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs opacity-70 mt-1",
                                                    children: pack.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                                    lineNumber: 106,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 88,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 86,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex flex-col gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-text font-semibold mb-1",
                                    children: "Quantity"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 115,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setQuantity((prev)=>Math.max(1, prev - 1)),
                                            className: "w-10 h-10 flex text-text items-center justify-center bg-button/10 shadow-lg shadow-button/20 rounded-lg hover:bg-button/20 transition",
                                            children: "-"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative w-20 text-center text-text font-semibold px-4 py-2 rounded-xl bg-button/10 backdrop-blur-xl shadow-lg shadow-button/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-button/30",
                                            children: quantity
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setQuantity((prev)=>prev + 1),
                                            className: "w-10 h-10 text-text flex items-center justify-center bg-button/10 shadow-lg shadow-button/20 rounded-lg hover:bg-button/20 transition",
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 126,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/products/[slug]/page.js",
                            lineNumber: 114,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        product.category?.toLowerCase().includes("top up") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block font-semibold mb-2 text-text",
                                    children: "Game ID"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 138,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: gameID,
                                    onChange: (e)=>setGameID(e.target.value),
                                    placeholder: "Enter Player ID",
                                    className: "w-full px-4 py-3 rounded-xl bg-imgcard border border-white/10 focus:border-button outline-none shadow-inner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 139,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/products/[slug]/page.js",
                            lineNumber: 137,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-imgcard backdrop-blur-3xl transition-all duration-300 px-4 py-4 my-10 rounded-2xl border-button shadow-lg shadow-button/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-bold text-text text-lg mb-4 text-button",
                                    children: "Order Summary"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-600",
                                            children: "Subtotal"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 153,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: [
                                                subtotal,
                                                " TK"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 154,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between border-t pt-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-lg",
                                            children: "Total"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold text-lg text-button",
                                            children: [
                                                total,
                                                " TK"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/products/[slug]/page.js",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/products/[slug]/page.js",
                            lineNumber: 150,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "px-8 py-3 bg-button text-white rounded-lg shadow-lg transform transition active:translate-y-1 active:shadow-sm hover:scale-105",
                                    children: "Buy Now"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleAddToCart,
                                    className: "px-8 py-3 bg-button text-white rounded-lg shadow-lg transform transition active:translate-y-1 active:shadow-sm hover:scale-105",
                                    children: "Add to Cart"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/products/[slug]/page.js",
                                    lineNumber: 167,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/products/[slug]/page.js",
                            lineNumber: 163,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/products/[slug]/page.js",
                    lineNumber: 77,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/products/[slug]/page.js",
            lineNumber: 72,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/products/[slug]/page.js",
        lineNumber: 71,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ProductDetails, "YOfFtpXW0bAZG9fizOGDTN3zVEk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
    ];
});
_c = ProductDetails;
const __TURBOPACK__default__export__ = ProductDetails;
var _c;
__turbopack_context__.k.register(_c, "ProductDetails");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_ec78f546._.js.map