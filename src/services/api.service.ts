
import axios from 'axios';
import { MemberPayload } from "../types/userInformation";
import { DepositHistoryPayload } from '../types/depositHistory';
import logger from '../winston';

const BE_API_URL = process.env.BE_API_URL || 'https://api-bo-thai-789bet.06789bet.com';
const SITE_LABEL = process.env.BE_API_SITE || 'thai_789bet';

// Get Member Information
type MemberInfoOk = { status_code: 200; data: MemberPayload };
type MemberInfoNotFound = { status_code: 404; mess?: string, data?: MemberPayload };
type MemberInfoErr = { status_code: number; mess: string, data?: MemberPayload };
export type GetMemberInfoResponse = MemberInfoOk | MemberInfoNotFound | MemberInfoErr;

export const getMemberInfo = async ( account: string ): Promise<GetMemberInfoResponse> => {
  try {
    const url = new URL('/get-member-bo/get-info-member', BE_API_URL);
    url.search = new URLSearchParams({ site: SITE_LABEL, account }).toString();

    const res = await axios.get(url.toString(), {
      timeout: 10000,
      validateStatus: () => true
    });
    
    if (res && typeof res.data === 'object' && res.data && 'status_code' in res.data) {
      return res.data as GetMemberInfoResponse;
    }
    if (res.status === 404) return { status_code: 404, mess: 'Member not found' };
    if (res.status >= 200 && res.status < 300) return { status_code: 200, data: res.data as MemberPayload };
    return { status_code: res.status || 502, mess: `Upstream error (${res.status})` };
  } catch (e: any) {
    logger.error('getMemberInfo error:', e.message);
    console.error('getMemberInfo error:', e.message);
    return { status_code: 502, mess: 'Network or timeout error' };
  }
};


// Get Deposit history
type FullDepositHistoryOk = { status_code: 200; data: DepositHistoryPayload; mess?: string };
type FullDepositHistoryNotFound = { status_code: 404; mess?: string, data?: DepositHistoryPayload; };
type FullDepositHistoryErr = { status_code: number; mess: string, data?: DepositHistoryPayload; };
export type FullDepositHistoryResponse = FullDepositHistoryOk | FullDepositHistoryNotFound | FullDepositHistoryErr;

export const getFullDepositHistory = async ( account: string, start_time: string, end_time: string ): Promise<FullDepositHistoryResponse> => {
  try {
    const url = new URL('/jpk-bo/full-recharge-history-no-manual', BE_API_URL);
    url.search = new URLSearchParams({ site: SITE_LABEL, account, start_time, end_time }).toString();

    const res = await axios.get(url.toString(), {
      timeout: 10000,
      validateStatus: () => true
    });

    const d: any = res.data;
    if (res.status >= 200 && res.status < 300) return { status_code: 200, data: d };

    if (d && typeof d === 'object' && 'Code' in d) {
      const code = Number(d.Code);
      const msg: string | undefined = d.Message;

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
    if (res.status === 404) return { status_code: 404, mess: 'Deposit history not found' };


    return { status_code: res.status || 502, mess: `Upstream error (${res.status})` };
  } catch (e: any) {
    logger.error(`[Get Full Deposit History API] System Error - ${e.message}`);
    console.error('getFullDepositHistory error:', e.message);
    return { status_code: 502, mess: 'Network or timeout error' };
  }
};

// Add Point
interface AddPointParams {
  account: string;
  point: number;
  audit: number;
  Memo: string;
  PortalMemo: string;
  site: string;
  value_memo: string | null;
}

export const add_point = async ({
  account,
  point,
  audit,
  Memo,
  PortalMemo,
  site,
  value_memo,
}: AddPointParams): Promise<true | 400> => {
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

    const response = await axios.post(BE_API_URL + `/add-point-bo`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data === true ? true : 400;
  } catch (error) {
    logger.error(`[Add_Point API] System Error - ${error}`);
    return 400;
  }
};
