// e.g. "/Date(1754833775612)/"
type ApiDateString = string;

export interface MemberPayload {
  Code: number;                 // 200
  Error: any[];
  ReplyTime: ApiDateString;
  Result: {
    Gs: GameSuppliersBlock;
    Member: MemberProfile;
  };
  DepositTypes: string[];
  WithdrawTypes: string[];
  DepositTimes: number;
  DepositTotal: number;
  WithdrawTimes: number;
  WithdrawTotal: number;
  Limit: number;
  Accounts: BankAccount[];
  Agent_new: string;
}

export interface GameSuppliersBlock {
  BonusInfo: any | null;
  SortedList: GameSupplierEntry[];
}

export interface GameSupplierEntry {
  EventWallet: any | null;
  GameAccount: string | null;
  GameSupplierId: number;
  Name: string;
  TransferAllowLessThanOne: boolean;
  Wallet: number | null;
  WalletUpdatedTime: ApiDateString | null;
  AvailableBalance: boolean;
}

export interface MemberProfile {
  Account: string;
  Balance: number;
  Birthday: ApiDateString | null;
  ChangePasswordPassValidateOneTime: boolean;
  DiscountSettingId: number;
  DiscountSettingName: string;
  Email: string | null;
  GroupAccountApplyIds: any[];
  Id: number;
  IdNumber: string | null;
  IsHighRisk: boolean;
  IsMaliciouslyLoginEnable: boolean;
  IsNeedRegionValidate: boolean;
  IsRestrictedLogin: boolean;
  JoinTime: ApiDateString;
  LatestLogin: {
    Id: number;
    IP: string;
    Time: ApiDateString;
  };
  MemberLastDeposit: {
    Amount: number;
    MemberId: number;
    MemberTransactionId: number;
    Time: ApiDateString;
  } | null;
  MemberLevelSettingId: number;
  MemberLevelSettingName: string;
  Memo: string | null;
  Mobile: string | null;
  Name: string | null;
  Parents: ParentInfo[];
  QQ: string | null;
  RegisterInfo: {
    RegisterDevice: number;
    RegisterUrl: string;
  };
  Sex: string | number | null;
  SexString: string;
  SourceUrl: string | null;
  State: number;
  StateString: string;
  Wallet: number;
  WithdrawApplicationIds: any[];
  LockOtherRegionExceptPreLoginRegion: boolean;
  CountryCode: string | null;
  IsWithdrawn: boolean;
  UsedApp: boolean;
  FirstUseAppTime: ApiDateString | null;
}

export interface ParentInfo {
  Account: string;
  AgentLevelId: number;
  AgentLevelName: string;
}

export interface BankAccount {
  Account: string;
  City: string;
  Id: number;
  Memo: string | null;
  Province: string;
  BankName: string;
}
