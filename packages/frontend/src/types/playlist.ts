export interface PlaylistEntryType {
    songTitle?: string;
    artist?: string;
    url?: string;
    leadTime?: number,
    startTime?: number,
    endTime?: number,
    instrumentPages?:{}
}

export interface PlaylistType {
    playlistId?: string;
    playlistName: string;
    playlistData: PlaylistEntryType[];
}