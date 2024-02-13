import React, {useEffect, useState} from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import {SongType} from "../types/song.ts";
import {onError} from "../lib/errorLib.ts";
import {API} from "aws-amplify";
import {LinkContainer} from "react-router-bootstrap";
import {BsPencilSquare} from "react-icons/bs";

export default function Home() {
    const [songs, setSongs] = useState<Array<SongType>>([]);
    const { isAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function onLoad() {
            if (!isAuthenticated) {
                return;
            }

            try {
                const songs = await loadSongs();
                setSongs(songs);
            } catch (e) {
                onError(e);
            }

            setIsLoading(false);
        }

        onLoad();
    }, [isAuthenticated]);

    function loadSongs() {
        return API.get("songs", "/songs", {});
    }


    function formatDate(str: undefined | string) {
        return !str ? "" : new Date(str).toLocaleString();
    }

    function renderSongsList(songs: SongType[]) {
        return (
            <>
                <LinkContainer to="/songs/new">
                    <ListGroup.Item action className="py-3 text-nowrap text-truncate">
                        <BsPencilSquare size={17} />
                        <span className="ms-2 fw-bold">Upload a new song</span>
                    </ListGroup.Item>
                </LinkContainer>
                {songs.map(({ songId, songName, createdAt }) => (
                    <LinkContainer key={songId} to={`/songs/${songId}`}>
                        <ListGroup.Item action className="text-nowrap text-truncate">
                            <span className="fw-bold">{songName.trim()}</span>
                            <br />
                            <span className="text-muted">
              Created: {formatDate(createdAt)}
            </span>
                        </ListGroup.Item>
                    </LinkContainer>
                ))}
            </>
        );
    }

    function renderLander() {
        return (
            <div className="lander">
                <h1>Music Works</h1>
                <p className="text-muted">A collection of music tools</p>
            </div>
        );
    }

    function renderSongs() {
        return (
            <div className="songs">
                <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Songs</h2>
                <ListGroup>{!isLoading && renderSongsList(songs)}</ListGroup>
            </div>
        );
    }

    return (
        <div className="Home">
            {isAuthenticated ? renderSongs() : renderLander()}
        </div>
    );
}