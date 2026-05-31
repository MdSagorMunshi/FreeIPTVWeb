export interface Channel {
  id: string;
  name: string;
  logo: string;
  group: string;
  url: string;
}

export interface Playlist {
  name: string;
  channels: Channel[];
  groups: string[];
}
