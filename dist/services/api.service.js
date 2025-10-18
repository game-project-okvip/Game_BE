"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_point = exports.getFullDepositHistory = exports.getMemberInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const winston_1 = __importDefault(require("../winston"));
const BE_API_URL = process.env.BE_API_URL || 'https://api-bo-thai-789bet.06789bet.com';
const SITE_LABEL = process.env.BE_API_SITE || 'thai_789bet';
const getMemberInfo = async (account) => {
    try {
        const url = new URL('/get-member-bo/get-info-member', BE_API_URL);
        url.search = new URLSearchParams({ site: SITE_LABEL, account }).toString();
        const res = await axios_1.default.get(url.toString(), {
            timeout: 10000,
            validateStatus: () => true
        });
        if (res && typeof res.data === 'object' && res.data && 'status_code' in res.data) {
            return res.data;
        }
        if (res.status === 404)
            return { status_code: 404, mess: 'Member not found' };
        if (res.status >= 200 && res.status < 300)
            return { status_code: 200, data: res.data };
        return { status_code: res.status || 502, mess: `Upstream error (${res.status})` };
    }
    catch (e) {
        winston_1.default.error('getMemberInfo error:', e.message);
        console.error('getMemberInfo error:', e.message);
        return { status_code: 502, mess: 'Network or timeout error' };
    }
};
exports.getMemberInfo = getMemberInfo;
const getFullDepositHistory = async (account, start_time, end_time) => {
    try {
        const url = new URL('/jpk-bo/full-recharge-history-no-manual', BE_API_URL);
        url.search = new URLSearchParams({ site: SITE_LABEL, account, start_time, end_time }).toString();
        const res = await axios_1.default.get(url.toString(), {
            timeout: 10000,
            validateStatus: () => true
        });
        const d = res.data;
        if (res.status >= 200 && res.status < 300)
            return { status_code: 200, data: d };
        if (d && typeof d === 'object' && 'Code' in d) {
            const code = Number(d.Code);
            const msg = d.Message;
            if (code === 200) {
                return { status_code: 200, data: d.Data ?? null, mess: msg };
            }
            if (code === 404) {
                return { status_code: 404, mess: msg ?? 'Deposit history not found' };
            }
            return {
                status_code: code || res.status || 502,
                mess: msg ?? `Upstream error (${res.status})`
            };
        }
        // Fallback to HTTP status
        if (res.status === 404)
            return { status_code: 404, mess: 'Deposit history not found' };
        return { status_code: res.status || 502, mess: `Upstream error (${res.status})` };
    }
    catch (e) {
        winston_1.default.error(`[Get Full Deposit History API] System Error - ${e.message}`);
        console.error('getFullDepositHistory error:', e.message);
        return { status_code: 502, mess: 'Network or timeout error' };
    }
};
exports.getFullDepositHistory = getFullDepositHistory;
const add_point = async ({ account, point, audit, Memo, PortalMemo, site, value_memo, }) => {
    try {
        const PortalMemoValue = value_memo
            ? `${PortalMemo} - รหัสตั๋ว: ${value_memo}`
            : PortalMemo;
        const payload = {
            AccountsString: account,
            Amount: point,
            Audit: audit,
            Memo,
            PortalMemo: PortalMemoValue,
            TimeStamp: Date.now(),
            site,
        };
        const response = await axios_1.default.post(BE_API_URL + `/add-point-bo`, payload, { headers: { "Content-Type": "application/json" } });
        return response.data === true ? true : 400;
    }
    catch (error) {
        winston_1.default.error(`[Add_Point API] System Error - ${error}`);
        return 400;
    }
};
exports.add_point = add_point;
//# sourceMappingURL=api.service.js.map