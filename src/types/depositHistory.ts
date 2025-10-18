type ApiDateString = string;

export interface DepositHistoryPayload {
  Code: number;
  Error: any[];
  Result: {
    Records: DepositRecord[];
  };
}

export interface DepositRecord {
  Account: string;
  Amount: number;
  Id: number;
  IsIncome: boolean;
  IsLostDiscount: boolean;
  IsReal: boolean;
  IsShowIsReal: boolean;
  MemberId: number;
  MemberLevelId: number;
  MemberLevelName: string;
  Memo: string;
  Subtotal: number;
  Time: ApiDateString;
  TypeForMember: string;
  TypeString: string;
}