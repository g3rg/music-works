import {useState, useEffect, ChangeEvent, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { SongType } from "../types/song.ts";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsPause, BsPlay } from "react-icons/bs";

export default function Song() {
    const {id} = useParams();
    const [song, setSong] = useState<null | SongType>(null);
    const [songSpeed, setSongSpeed] = useState(100);
    const [loopSong, setLoopSong] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [currentSeek, setCurrentSeek] = useState(0);
    const [songDuration, setSongDuration] = useState(0)
    //const [player, setPlayer] = useState<null | HTMLAudioElement>(null);

    const player = useRef<HTMLAudioElement>(null);

    const nav = useNavigate()

    useEffect(() => {
        function loadSong() {
            return API.get("songs", `/songs/${id}`, {});
        }

        async function onLoad() {
            try {
                const song = await loadSong();
                const {songFilename} = song;

                if (songFilename) {
                    song.songFileURL = await Storage.vault.get(songFilename);
                }

                setSong(song);

                if (player && player.current) {
                    player.current.ontimeupdate = () => {
                        setCurrentSeek(player?.current?.currentTime || 0);
                    }
                    player.current.onended = () => {
                        if (!player.current?.loop) {
                            setPlaying(false);
                        }
                    };
                    if (player.current.duration)
                        setSongDuration(player.current.duration);
                }
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id, player]);



    function handleSetSongSpeed(newRate: number) {
        setSongSpeed(newRate)
        if (player && player.current) {
            player.current.playbackRate = (newRate / 100)
        }
    }

    function handleSetLoop(event: ChangeEvent<HTMLInputElement>) {
        const loopIt = event.target.checked
        if (player && player.current) {
            player.current.loop = loopIt
        }

        setLoopSong(loopIt);

    }
    /*
    Audio Player fields and methods:
    .controlsList
    .crossOrigin?
    .currentSrc
    .currentTime
    .defaultPlaybackRate
    .duration
    .ended
    .loop
    .muted
    .paused
    .playbackRate
    .preservesPitch
    .volume
     */

    function handlePlay() {
        setSongDuration(player?.current?.duration || 0)
        if (player?.current?.paused) {
            // @ts-ignore
            player?.current.play();
            setPlaying(true);
        } else {
            // @ts-ignore
            player?.current.pause();
            setPlaying(false);
        }
    }

    function handleSeek(val: number) {
        if (player && player.current)
            player.current.currentTime = val
        setCurrentSeek(val);
    }

    function formatTime(time: number) {
        const mins = time/60
        const secs = ("0" + (Math.trunc(time) % 60)).slice(-2);

        return Math.trunc(mins) + ":" + secs
    }

    return (
        <div className="Songs">
            {song && (
                <Stack gap={3}>
                    <p>Song: {song.songName}</p>
                    <audio id="audioPlayer"
                           ref={player}>
                        <source src={song.songFileURL}
                                type='audio/mp3'/>
                    </audio>

                    <p>Seek: {formatTime(currentSeek)} / {formatTime(songDuration)}</p>
                    <Form.Range id="seek"
                                min="0" max={songDuration} step="1"
                                value={currentSeek}
                                onChange={(event)=>handleSeek(parseInt(event.target.value))}/>
                    <p>Playback Rate <span id="currentPbr">{songSpeed}%</span></p>
                    <Form.Range id="pbr"
                                min="50" max="150" step="0.1"
                                value={songSpeed}
                                onChange={(event: {
                                    target: { value: string; };
                                }) => handleSetSongSpeed(parseInt(event.target.value))}/>
                    <Form.Group>
                        <Form.Label>Loop Playback</Form.Label>
                        <Form.Check type="checkbox" id="chkLoop" value={"" + loopSong}
                                    onChange={(event) => handleSetLoop(event)}/>
                    </Form.Group>
                    <table>
                        <tbody>
                        <tr>
                            <td><Button onClick={() => handlePlay()}>&nbsp;&nbsp;&nbsp;
                                {
                                    playing && (
                                        <BsPause/>
                                    )
                                }
                                {
                                    !playing && (
                                        <BsPlay/>
                                    )
                                }
                                &nbsp;&nbsp;&nbsp;</Button></td>
                        </tr>
                        </tbody>
                    </table>
                    <Button onClick={() => nav(`/songs/${song.songId}`)}>Edit</Button>
                </Stack>
            )}
        </div>
    );
}