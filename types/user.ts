export type CanvasUser = {
    // the ID of the Account object
    id: number;
    // The display name of the account
    name: string;
    // The UUID of the account
    uuid: string;
    // The account's parent ID, or null if this is the root account
    parent_account_id: number | null;
    // The ID of the root account, or null if this is the root account
    root_account_id: number | null;
    // The storage quota for the account in megabytes, if not otherwise specified
    default_storage_quota_mb: number;
    // The storage quota for a user in the account in megabytes, if not otherwise
    // specified
    default_user_storage_quota_mb: number;
    // The storage quota for a group in the account in megabytes, if not otherwise
    // specified
    default_group_storage_quota_mb: number;
    // The default time zone of the account. Allowed time zones are
    // {http://www.iana.org/time-zones IANA time zones} or friendlier
    // {http://api.rubyonrails.org/classes/ActiveSupport/TimeZone.html Ruby on Rails
    // time zones}.
    default_time_zone: string;
    // The account's identifier in the Student Information System. Only included if
    // the user has permission to view SIS information.
    sis_account_id: string;
    // The account's identifier in the Student Information System. Only included if
    // the user has permission to view SIS information.
    integration_id: string;
    // The id of the SIS import if created through SIS. Only included if the user
    // has permission to manage SIS information.
    sis_import_id: number;
    // The number of courses directly under the account (available via include)
    course_count: number;
    // The number of sub-accounts directly under the account (available via include)
    sub_account_count: number;
    // The account's identifier that is sent as context_id in LTI launches.
    lti_guid: string;
    // The state of the account. Can be 'active' or 'deleted'.
    workflow_state: 'active' | 'deleted';
    // The URL of the account's avatar
    avatar_url: string;
  }