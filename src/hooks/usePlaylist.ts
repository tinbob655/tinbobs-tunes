import {useContext} from "react";
import type {PlaylistContextType} from "../context/playlistContext.tsx";
import {PlaylistContext} from "../context/playlistContext.tsx";

export function usePlaylist(): PlaylistContextType {
    return useContext(PlaylistContext);
}