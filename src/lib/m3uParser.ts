import { Channel, Playlist } from '@/types';

export const parseM3U = (content: string): Playlist => {
  const lines = content.split('\n');
  const channels: Channel[] = [];
  const groups = new Set<string>();
  
  let currentChannel: Partial<Channel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Parse metadata
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      
      currentChannel.name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
      currentChannel.logo = logoMatch ? logoMatch[1] : '';
      currentChannel.group = groupMatch ? groupMatch[1] : 'Uncategorized';
      currentChannel.id = Math.random().toString(36).substr(2, 9);
      
      groups.add(currentChannel.group);
    } else if (line && !line.startsWith('#')) {
      // This is a stream URL
      if (currentChannel.name) {
        currentChannel.url = line;
        channels.push(currentChannel as Channel);
        currentChannel = {}; // Reset for the next channel
      }
    }
  }

  return {
    name: 'Default Playlist',
    channels,
    groups: Array.from(groups).sort()
  };
};
