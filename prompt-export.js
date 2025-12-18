"use strict";

/**
 * Export helpers v1.2 (CLEAN FINAL)
 * - window.nvDownloadText(filename, mime, text)
 * - window.nvBuildMD(item)
 */

(function () {
    const FLAG = "__NV_EXPORT_V1__";
    if (window[FLAG]) return;
    window[FLAG] = true;

    function resolveProdSafeDebugMode() {
        if (typeof window === "undefined" || typeof window.location === "undefined") return false;

        let params;
        try {
            params = new URLSearchParams(window.location.search);
        } catch (_) {
            return false;
        }

        if (params.get("debug") !== "1") return false;

        try {
            if (window.localStorage.getItem("NV_DEBUG") !== "1") return false;
        } catch (_) {
            return false;
        }

        const host = window.location.hostname || "";
        return host === "localhost" || host === "127.0.0.1" || host === "[::1]";
    }

    const PROD_SAFE_DEBUG_MODE =
        typeof window.__NV_PROD_SAFE_DEBUG__ === "boolean"
            ? window.__NV_PROD_SAFE_DEBUG__
            : resolveProdSafeDebugMode();

    window.__NV_PROD_SAFE_DEBUG__ = PROD_SAFE_DEBUG_MODE;
    window.__NV_PROD_SAFE_DEBUG_FN__ = resolveProdSafeDebugMode;

    // Lokal geliştirmede export AÇIK. Prod’da istersen sonradan true yaparsın.
    const NV_READONLY_PROD_SAFE = false;

    function nvExportAllowed() {
        if (NV_READONLY_PROD_SAFE) return false;
        if (!PROD_SAFE_DEBUG_MODE) return true;
        return window.localStorage?.getItem("NV_EXPORT") === "1";
    }

    window.nvDownloadText = function nvDownloadText(filename, mime, text) {
        if (!nvExportAllowed()) {
            console.warn("Export disabled. Debug modda açmak için: localStorage.NV_EXPORT='1'");
            return;
        }
        const blob = new Blob([text], { type: `${mime};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 700);
    };

    window.nvBuildMD = function nvBuildMD(item) {
        if (!nvExportAllowed()) return "";

        const tags = Array.isArray(item?.tags) ? item.tags : [];
        return [
            `## ${item?.title || "NEUROVA Prompt"}`,
            ``,
            item?.id ? `**ID:** \`${item.id}\`` : null,
            item?.category ? `**Category:** ${item.category}` : null,
            item?.role ? `**Role:** ${item.role}` : null,
            tags.length ? `**Tags:** ${tags.map(t => `#${t}`).join(" ")}` : null,
            item?.safeNote ? `**SafeNote:** ${item.safeNote}` : null,
            ``,
            `---`,
            ``,
            `### TR`,
            "```text",
            item?.lang?.tr || "",
            "```",
            ``,
            `### EN`,
            "```text",
            item?.lang?.en || "",
            "```"
        ].filter(Boolean).join("\n");
    };
})();
