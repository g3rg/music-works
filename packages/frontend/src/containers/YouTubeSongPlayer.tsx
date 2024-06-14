import React, {useState, useEffect, ChangeEvent} from "react";
import { useNavigate } from "react-router-dom";
import { onError } from "../lib/errorLib";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { BsPause, BsPlay } from "react-icons/bs";
import YouTube, {YouTubeEvent, YouTubePlayer} from "react-youtube";

export default function YouTubeSongPlayer() {
    const [songSpeed, setSongSpeed] = useState(100)
    const [songUrl, setSongUrl] = useState("")
    const [loopSong, setLoopSong] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [currentSeek, setCurrentSeek] = useState(0)
    const [songDuration, setSongDuration] = useState(0)
    const [player, setPlayer] = useState<null | YouTubePlayer>(null)

    const nav = useNavigate()

    const playerOpts = {
        playerVars: {
            controls: 0,
        },
    }

    /*
    const opts = {
        height: '390',
        width: '640',
        playerVars: {
        // https://developers.google.com/youtube/player_parameters
           autoplay: 1,
        },
    }
 */

    useEffect(() => {

        async function onLoad() {
            try {

            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, []);

    function handleSongUrlChange(newUrl: string) {
        let newId = newUrl
        /*
        FORMATS:
        U32RXRW1n8I
        https://www.youtube.com/watch?v=U32RXRW1n8I
        https://www.youtube.com/watch?v=U32RXRW1n8I&ts=5

        https://www.youtube.com/watch?v=1w7OgIMMRc4&pp=ygUSc3dlZXQgY2hpbGQgbyBtaW5l
        https://youtu.be/U32RXRW1n8I?t=1606

        http://www.youtube.com/v/U32RXRW1n8I?version=3
         */

        if (newUrl.indexOf("watch?v=") > -1) {
            let tmp = newUrl.substring(newUrl.indexOf("watch?v=") + "watch?v=".length)
            newId=tmp.substring(0, Math.max(tmp.indexOf("&"), tmp.length))
            console.log(newId)
        }

        player?.loadVideoById(newId) // {url, startSeconds, endSeconds}
        setSongUrl(newUrl)
    }


    function handleSetSongSpeed(newRate: number) {
        setSongSpeed(newRate)
        if (player) {
            player.setPlaybackRate(newRate / 100)
        }
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
        // player.playVideo();
        // pauseVideo playVideoAt setLoop seekTo setPlaybackRate getDuration getCurrentTime getPlayerMode getPlayerState
        updateSongControls();
        if (player?.getPlayerState() === 1) {
            player?.pauseVideo();
            setPlaying(false);
        } else {
            player?.playVideo();
            setPlaying(true);
        }

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


    function onReady(event: YouTubeEvent) {
        setPlayer(event.target);
    }

    return (
        <div className="Songs">
                <Stack gap={3}>
                    <p>Song: </p>
                    <Form.Group controlId="content">
                        <Form.Control
                            size="lg"
                            value={songUrl}
                            placeholder="Youtube Url"
                            onChange={(e) => handleSongUrlChange(e.target.value)}
                        />
                    </Form.Group>
                    <YouTube
                        videoId={"ieXwRuKjBts"}
                        opts={playerOpts}
                        onReady={onReady}
                        onPlay={()=>{}}
                        onPause={()=>{}}
                        onEnd={()=>{}}
                        onError={()=>{}}
                        onStateChange={()=>{}}
                        onPlaybackRateChange={()=>{}}
                        onPlaybackQualityChange={()=>{}}
                    />
                    <p>Seek: {formatTime(currentSeek)} / {formatTime(songDuration)}</p>
                    <Form.Range id="seek"
                                min="0" max={songDuration} step="1"
                                value={currentSeek}
                                onChange={(event)=>handleSeek(parseInt(event.target.value))}/>
                    <p>Playback Rate <span id="currentPbr">{songSpeed}%</span></p>
                    <Form.Range id="pbr"
                                min="50" max="150" step="5"
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