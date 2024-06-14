import {useState, useEffect, ChangeEvent} from "react";
import { useNavigate } from "react-router-dom";
import { onError } from "../lib/errorLib";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsPause, BsPlay } from "react-icons/bs";

export default function YouTubePlayer() {
    const [songSpeed, setSongSpeed] = useState(100);
    const [loopSong, setLoopSong] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [currentSeek, setCurrentSeek] = useState(0);
    const [songDuration, setSongDuration] = useState(0)
    //const [player, setPlayer] = useState<null | HTMLAudioElement>(null);

    const nav = useNavigate()

    useEffect(() => {

        async function onLoad() {
            try {

            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, []);



    function handleSetSongSpeed(newRate: number) {
        setSongSpeed(newRate)
        /*
        if (player && player.current) {
            player.current.playbackRate = (newRate / 100)
        }*/
    }

    function handleSetLoop(event: ChangeEvent<HTMLInputElement>) {
        const loopIt = event.target.checked
        /*
        if (player && player.current) {
            player.current.loop = loopIt
        }

         */

        setLoopSong(loopIt);

    }

    function updateSongControls() {
        /*
        setSongDuration(player?.current?.duration || 0)
        if (player?.current) {
            player.current.ontimeupdate = () => {
                setCurrentSeek(player?.current?.currentTime || 0);
            }
            player.current.onended = () => {
                if (!player.current?.loop) {
                    setPlaying(false);
                }
            };
        }
         */
    }


    function handlePlay() {
        updateSongControls();
        /*
        if (player?.current?.paused) {
            // @ts-ignore
            player?.current.play();
            setPlaying(true);
        } else {
            // @ts-ignore
            player?.current.pause();
            setPlaying(false);
        }

         */
    }

    function handleSeek(val: number) {
        /*
        if (player && player.current)
            player.current.currentTime = val

         */
        setCurrentSeek(val);
    }

    function formatTime(time: number) {
        const mins = time/60
        const secs = ("0" + (Math.trunc(time) % 60)).slice(-2);

        return Math.trunc(mins) + ":" + secs
    }

    return (
        <div className="Songs">
                <Stack gap={3}>
                    <p>Song: </p>
                    <div>YOUTUBE PLAYER HERE</div>
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
                </Stack>
        </div>
    );
}