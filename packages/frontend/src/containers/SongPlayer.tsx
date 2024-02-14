import { useState, useEffect } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { SongType } from "../types/song.ts";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

export default function Song() {
    const { id } = useParams();
    const [song, setSong] = useState<null| SongType>(null);
    const [songSpeed, setSongSpeed] = useState(100);

    const nav = useNavigate()

    useEffect(() => {
        function loadSong() {
            return API.get("songs", `/songs/${id}`, {});
        }

        async function onLoad() {
            try {
                const song = await loadSong();
                const { songFilename } = song;

                if (songFilename) {
                    song.songFileURL = await Storage.vault.get(songFilename);
                }

                setSong(song);
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);



    function setSongSpeedAndPlaybackRate( newRate: number) {
        setSongSpeed(newRate)
        let player = document.getElementById('audioPlayer')
        if (player) {
            //@ts-ignore
            player.playbackRate = (newRate / 100)
        }
    }

    return (
        <div className="Songs">
            {song && (
                <Stack gap={3}>
                    <p>Song: {song.songName }</p>
                    <p>Playback Rate <span id="currentPbr">{songSpeed}%</span></p>
                    <audio id="audioPlayer" controls>
                        <source src={song.songFileURL}
                                type='audio/mp3'/>
                    </audio>
                    <input id="pbr" type="range"
                           min="50" max="150" step="1"
                           value={songSpeed}
                           onChange={(event) => setSongSpeedAndPlaybackRate(parseInt(event.target.value))}/>
                    <Button onClick={() => nav(`/songs/${song.songId}`)}>Edit</Button>
                </Stack>
            )}
        </div>
    );
}