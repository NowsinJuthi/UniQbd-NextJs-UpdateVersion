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
            className: "relative bg-imgcard backdrop-blur-3xl cursor-pointer   flex flex-col items-center justify-center px-4 py-4 rounded-xl text-sm font-medium text-button   hover:shadow-2xl border-button shadow-inner shadow-button/30 transform-gpu will-change-transform",
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
                price: "70 TK"
            },
            {
                uc: "325 UC",
                price: "350 TK"
            },
            {
                uc: "660 UC",
                price: "700 TK"
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
                price: "90 TK"
            },
            {
                uc: "310 Diamonds",
                price: "260 TK"
            },
            {
                uc: "520 Diamonds",
                price: "420 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "70 TK"
            },
            {
                uc: "325 UC",
                price: "350 TK"
            },
            {
                uc: "660 UC",
                price: "700 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "90 TK"
            },
            {
                uc: "3 Month",
                price: "260 TK"
            },
            {
                uc: "6 Month",
                price: "420 TK"
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
                price: "90 TK"
            },
            {
                uc: "310 Points",
                price: "260 TK"
            },
            {
                uc: "520 Points",
                price: "420 TK"
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
                price: "90 TK"
            },
            {
                uc: "310 Credits",
                price: "260 TK"
            },
            {
                uc: "520 Credits",
                price: "420 TK"
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
                price: "70 TK"
            },
            {
                uc: "325 UC",
                price: "350 TK"
            },
            {
                uc: "660 UC",
                price: "700 TK"
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
                price: "90 TK"
            },
            {
                uc: "310 Diamonds",
                price: "260 TK"
            },
            {
                uc: "520 Diamonds",
                price: "420 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "90 TK"
            },
            {
                uc: "420 CP",
                price: "420 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
            },
            {
                uc: "880 CP",
                price: "800 TK"
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
                price: "70 TK"
            },
            {
                uc: "325 UC",
                price: "350 TK"
            },
            {
                uc: "660 UC",
                price: "700 TK"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/products/[slug]/page.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/src/app/products/[slug]/page.js'\n\nExpression expected");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_fa57a8a3._.js.map