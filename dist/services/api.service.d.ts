import { MemberPayload } from "../types/userInformation";
import { DepositHistoryPayload } from '../types/depositHistory';
type MemberInfoOk = {
    status_code: 200;
    data: MemberPayload;
};
type MemberInfoNotFound = {
    status_code: 404;
    mess?: string;
    data?: MemberPayload;
};
type MemberInfoErr = {
    status_code: number;
    mess: string;
    data?: MemberPayload;
};
export type GetMemberInfoResponse = MemberInfoOk | MemberInfoNotFound | MemberInfoErr;
export declare const getMemberInfo: (account: string) => Promise<GetMemberInfoResponse>;
type FullDepositHistoryOk = {
    status_code: 200;
    data: DepositHistoryPayload;
    mess?: string;
};
type FullDepositHistoryNotFound = {
    status_code: 404;
    mess?: string;
    data?: DepositHistoryPayload;
};
type FullDepositHistoryErr = {
    status_code: number;
    mess: string;
    data?: DepositHistoryPayload;
};
export type FullDepositHistoryResponse = FullDepositHistoryOk | FullDepositHistoryNotFound | FullDepositHistoryErr;
export declare const getFullDepositHistory: (account: string, start_time: string, end_time: string) => Promise<FullDepositHistoryResponse>;
interface AddPointParams {
    account: string;
    point: number;
    audit: number;
    Memo: string;
    PortalMemo: string;
    site: string;
    value_memo: string | null;
}
export declare const add_point: ({ account, point, audit, Memo, PortalMemo, site, value_memo, }: AddPointParams) => Promise<true | 400>;
export {};
//# sourceMappingURL=api.service.d.ts.map