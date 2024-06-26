import {useState, useEffect, ChangeEvent} from "react"
import { onError } from "../lib/errorLib"

import Stack from "react-bootstrap/Stack"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import { BsPause, BsPlay } from "react-icons/bs"
import YouTube, {YouTubeEvent, YouTubePlayer} from "react-youtube"
import getVideoId from 'get-video-id'


export default function YouTubeSongPlayer() {
    const [songSpeed, setSongSpeed] = useState(100)
    const [songUrl, setSongUrl] = useState("")
    const [loopSong, setLoopSong] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [currentSeek, setCurrentSeek] = useState(0)
    const [songDuration, setSongDuration] = useState(0)
    const [player, setPlayer] = useState<null | YouTubePlayer>(null)


    const playerOpts = {
        height: '100%',
        width: '100%',
        playerVars: {
            controls: 1,
        },
    }

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
        const { id } = getVideoId(newUrl)

        player?.loadVideoById(id) // {url, startSeconds, endSeconds}
        // Duration?
        console.log(player)
        console.log(player?.getDuration())
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
        player?.setLoop(loopIt)
        setLoopSong(loopIt)

    }

    function updateSongControls() {
        setSongDuration(player?.getDuration() || 0)
        setCurrentSeek(player?.getCurrentTime())
    }

    function handlePlay() {
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
        setCurrentSeek(val)
        player?.seekTo(val)
    }

    function formatTime(time: number) {
        const mins = time/60
        const secs = ("0" + (Math.trunc(time) % 60)).slice(-2);

        return Math.trunc(mins) + ":" + secs
    }


    function onReady(event: YouTubeEvent) {
        setPlayer(event.target)
        console.log("onReady")
    }

    function onPlay() {
        updateSongControls()
    }

    function onEnd() {
        if (loopSong) {
            player?.playVideo()
        }
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
                    <div className="YouDiv">
                        <YouTube
                            videoId={""}
                            opts={playerOpts}
                            onReady={onReady}
                            onPlay={onPlay}
                            onPause={()=>{}}
                            onEnd={onEnd}
                            onError={()=>{}}
                            onStateChange={()=>{}}
                            onPlaybackRateChange={()=>{}}
                            onPlaybackQualityChange={()=>{}}
                        />
                    </div>
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