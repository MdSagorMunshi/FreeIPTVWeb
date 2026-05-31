import { get, set, del } from 'idb-keyval';
import { Playlist } from '@/types';

export const savePlaylistToDB = async (id: string, playlist: Playlist) => {
  await set(`playlist_${id}`, playlist);
};

export const getPlaylistFromDB = async (id: string): Promise<Playlist | undefined> => {
  return await get(`playlist_${id}`);
};

export const deletePlaylistFromDB = async (id: string) => {
  await del(`playlist_${id}`);
};
