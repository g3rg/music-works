import {ChangeEvent, useEffect, useState} from "react";
import {onError} from "../lib/errorLib.ts";
import {useParams} from "react-router-dom";
import YouTube, {YouTubeEvent, YouTubePlayer} from "react-youtube"
import getVideoId from 'get-video-id'
import {PlaylistEntryType, PlaylistType} from "../types/playlist.ts";
import "./PlaylistPlayer.css"

export default function PlaylistPlayer() {

    const { id } = useParams();

    const [playlist, setPlaylist] =useState<null | PlaylistType>(null);
    const [songIndex, setSongIndex] = useState(-1)
    const [title, setTitle] = useState<undefined|string>('')
    const [artist, setArtist] = useState<undefined|string>('')
    const [player, setPlayer] = useState<null | YouTubePlayer>(null)

    const playerOpts = {
        height: '35%',
        width: '35%',
        playerVars: {
            controls: 1,
        },
    }

    function onReady(event: YouTubeEvent) {
        setPlayer(event.target)
    }

    function onPlay() {

    }

    function onEnd() {
        console.log("END")
        console.log(playlist?.playlistData?.length)
        if (songIndex+1 < (playlist?.playlistData?.length)) {
            console.log(`set Song index ${songIndex} + 1`)
            setSongIndex(songIndex+1)
        } else {
            setSongIndex(1)
        }
    }

    const dummPlaylist: PlaylistType = {
        playlistId: '1234',
        playlistName: "All of Greg's Songs",
        playlistData: [
            {},
            {
                songTitle: "Fell on Black Days",
                artist: "Soundgarden",
                url: "https://youtu.be/ySzrJ4GRF7s?si=B3zSu-rswmeh1kLc",
                startTime: 0,
                endTime: 0,
                instrumentPages: {
                    "Guitar": {
                        "Tuning": "Standard",
                        "Tab": `
                        [Riff 1]                            [Riff 2]                            [Riff 3]             
|----------------------------|      |-------------------0-------|       |---------------------------------0-|
|----------------------------|      |-------------------0-------|       |---------------------------------0-|
|----------------------------|      |-------------------0-------|       |---------------------------------0-|
|--9--x-------7-0------------|      |--9--x-------7-0---9-------|       |--9---9-9------9----------7-7/9--9-|
|--7--x--9br--7-0-7-7-7-7-x--|      |--7--x--9br--7-0-7-7-------|       |--7---7-7--9---7--9--7-7--5-5/7--7-|
|--0-----7br------8-8-8-8-x--|      |--0-----7br------8-8-------|       |-----------7------7--5-5---------8-|


[Riff 4]                        [Riff 5]
|-----------------------|       |-------------------------------------------------|
|-----------------------|       |-------------------------------------------------|
|-----------------------|       |-------------------------------------------------|
|--9--x-------7-0-------|       |--7-7-7-9-------7-0------------9--x-------7-0----|
|--7--x--9br--7-0-7/----|       |--5-5-5-7--9br--7-0-7-7-7-7-x--7--x--9br--7-0-7--|
|--0-----7br------8/----|       |-----------7br------8-8-8-8-x--0-----7br------8--|
                                        

[Bridge]
|---------------------------------------------------------------------------|
|---------------------------------------------------------------------------|
|----------9--13--14--16h17p16p14--16-17---19~---17-16-14~---14\\--|x2
|--9--9-9--x---x---x---0------------0--0-----0-----0-----------0------|
|--x--x-x--7--11--12--------------------------------------------------|
|--7--7-7-------------------------------------------------------------------|
 
|-------------------------------------------------------------------------------------|
|-------------------------------------------------------------------------------------|
|----------9--13--14--16h17p16\\14---16-17---19~---16h17p16\\14---16-17---16~--|
|--9--9-9--x---x---x---0-------------0-------0-----0-------------0-------0------|
|--x--x-x--7--11--12------------------------------------------------------------|
|--7--7-7-----------------------------------------------------------------------------|
                                                            [Backing for solo]
|-----------------------------------------------------|     |---------------------------------0--|
|-----------------------------------------------------|     |---------------------------------0--|
|----16h17p16\\14---16-17---19~---17-16-14---12-11\\----|     |--9--9-9-------9-----------------0--|
|--0-------------0-------0-----0----------0-----------|     |--9--9-9---9---9--9---7-7--12----9--|
|-----------------------------------------------------|     |--7--7-7---9---7--9---7-7--12--7-7--|
|-----------------------------------------------------|     |-----------7------7---5-5--10--8-8--|
`
                    },
                    "Lyrics": `
                    Whatsoever I've feared has come to life
And whatsoever I've fought off became my life
Just when everyday seemed to greet me with a smile
Sunspots have faded, now I'm doing time
Now I'm doing time
'Cause I fell on black days
I fell on black days
Whomsoever I've cured, I've sickened now
And whomsoever I've cradled, I've put you down
I'm a search light soul they say
But I can't see it in the night
I'm only faking when I get it right
When I get it right

'Cause I fell on black days
I fell on black days
How would I know
That this could be my fate?
How would I know
That this could be my fate? Yeah

So what you wanted to see good
Has made you blind
And what you wanted to be yours
Has made it mine
So don't you lock up something
That you wanted to see fly
Hands are for shaking
No, not tying, no, not tying
I sure don't mind a change
I sure don't mind a change
Yeah, I sure don't mind, sure don't mind a change
I sure don't mind a change
'Cause I fell on black days
I fell on black days
How would I know
That this could be my fate?
How would I know
That this could be my fate?
How would I know
That this could be my fate?
How would I know
That this could be my fate?
I sure don't mind a change`
                }
            },
            {
                songTitle: "Godless",
                artist: "Dandy Warhols",
                url: "https://youtu.be/LduipA_XUJ8?si=pvljnhm3rPlvR-sK",
                startTime: 0,
                endTime: 0,
                instrumentPages: {
                    "Guitar": {
                        "Tuning": "Standard",
                        "Tab": `
[Intro]
Dm G Dm G Dm F C D    x2

[Verse 1]
Dm                G
Hey I said you're godless and
  Dm                  G
it seems like you're a soulless friend
  Dm              F
as spotless as you were back then
 C                  D
I swear that you are godless

[Verse 2]
Dm                 G
Hey I guess you're lonely when
 Dm              G
I gave you all it took so then
 Dm                F
a stranger there is ever been
 C                    D
I guess, it's what you wanted

[Interlude]
Dm G Dm G Dm F C D

Dm    G     Dm             G
  It seems lonely I would be
Dm          F
I begged, I plead
           C               D
but this is all that I have gotten

[Interlude]
Dm G Dm G Dm F C D 
(randomly picking at first)

[Verse 3]
Dm             G
Hey as for the day my friend
  Dm                  G
to hope that you could ever bend
 Dm               F
I swear you are, I swear you are
 C                   D
I swear, that you are godless

[Verse 4]
Dm                G
Hey I said you're godless
Dm               G
hey and you're a souless friend
Dm                F
hey I said you're heartless
     C        D
and I swear, I swear`
                    }
                }
            },
            {
                songTitle: "Mother",
                artist: "Danzig",
                url: "https://youtu.be/7inLYcK369M?si=vglZXk7nCIYMdNix",
                startTime: 0,
                endTime: 0,
                instrumentPages: {
                    "Guitar": {
                        "Tuning": "Standard",
                        "Tab": ``

                    },
                    "Lyrics": ``
                }
            },
            {
                songTitle: "Drive",
                artist: "Incubus",
                url: "https://www.youtube.com/watch?v=fgT9zGkiLig",
                startTime: 0,
                endTime: 0,
                instrumentPages: {
                    "Guitar": {
                        "Tuning": "Standard",
                        "Tab": ``

                    },
                    "Lyrics": ``
                }
            },


        ]
    }

    useEffect(() => {
        function loadPlaylist(id: string) {
            console.log(`Load Playlist ${id}`)
            return dummPlaylist
            // API.get("songs", `/playlist/${id}`, {});
        }

        async function onLoad() {
            try {
                if (id) {
                    const pl = await loadPlaylist(id)
                    setPlaylist(pl)
                    setSongIndex(0)
                }
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);

    useEffect( () => {
        const song = playlist?.playlistData[songIndex]
        setTitle(song?.songTitle)
        setArtist(song?.artist)
        if (song && song.url) {
            const {id} = getVideoId(song?.url)
            player?.loadVideoById(id) // {url, startSeconds, endSeconds}
        }
    }, [id, songIndex])

    const handleSongChange = ( event: ChangeEvent<HTMLSelectElement> )=> {
        console.log(event.target.value)
        setSongIndex(parseInt(event.target.value))
    }

    const renderSongSelector = (songs : undefined|PlaylistEntryType[]) => {
        return (
            <select onChange={ handleSongChange }>
                {songs?.map( (song, idx) => {
                    return (
                        <option key={idx} value={idx}>{ song?.songTitle } - { song?.artist }</option>
                    )
                })}
            </select>
        )
    }

    return (
        <div>
            {playlist?.playlistName}<br/>
            {renderSongSelector(playlist?.playlistData)}<br/>
            Title: {title}<br/>
            Artist: {artist}<br/>

            <div className="YouDiv">
                <YouTube
                    videoId={""}
                    opts={playerOpts}
                    onReady={onReady}
                    onPlay={onPlay}
                    onPause={() => {
                    }}
                    onEnd={onEnd}
                    onError={() => {
                    }}
                />
            </div>
            <br/>

            Play Button <br/>

        </div>
    )
}