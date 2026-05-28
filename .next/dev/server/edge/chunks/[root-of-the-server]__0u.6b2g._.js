(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__0u.6b2g._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/Downloads/fit-transformacao-pro-corrigido/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$fit$2d$transformacao$2d$pro$2d$corrigido$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/fit-transformacao-pro-corrigido/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$fit$2d$transformacao$2d$pro$2d$corrigido$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/fit-transformacao-pro-corrigido/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$fit$2d$transformacao$2d$pro$2d$corrigido$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/fit-transformacao-pro-corrigido/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
;
async function middleware(request) {
    let response = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$fit$2d$transformacao$2d$pro$2d$corrigido$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request
    });
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$fit$2d$transformacao$2d$pro$2d$corrigido$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createServerClient"])(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: {
            get: (n)=>request.cookies.get(n)?.value,
            set (n, v, o) {
                request.cookies.set({
                    name: n,
                    value: v,
                    ...o
                });
                response = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$fit$2d$transformacao$2d$pro$2d$corrigido$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request
                });
                response.cookies.set({
                    name: n,
                    value: v,
                    ...o
                });
            },
            remove (n, o) {
                request.cookies.set({
                    name: n,
                    value: '',
                    ...o
                });
                response = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$fit$2d$transformacao$2d$pro$2d$corrigido$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
                    request
                });
                response.cookies.set({
                    name: n,
                    value: '',
                    ...o
                });
            }
        }
    });
    await supabase.auth.getUser();
    return response;
}
const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0u.6b2g._.js.map