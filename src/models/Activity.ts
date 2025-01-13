export interface Activity {
    ActivityId: string; // Guid -> string
    Subject: string;
    ScheduledStart: Date | null; // DateTime? -> Date | null
    ScheduledEnd: Date | null; // DateTime? -> Date | null
    StateCode: number | null; // int? -> number | null
    ActivityTypeCode: string; // int? -> number | null
    RegardingObjectId: string; // Guid -> string
    OwnerId: string; // Guid -> string
    CreatedOn: Date | null; // DateTime? -> Date | null
  }