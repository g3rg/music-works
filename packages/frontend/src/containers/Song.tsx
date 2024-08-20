import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../lib/errorLib";
import config from "../config.ts";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import LoaderButton from "../components/LoaderButton.tsx";
import { SongType } from "../types/song.ts";
import { s3Upload } from "../lib/awsLib.ts";
import "./Song.css"

export default function Song() {
    const file = useRef<null | File>(null)
    const { id } = useParams();
    const nav = useNavigate();
    const [song, setSong] = useState<null| SongType>(null);
    const [songName, setSongName] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        function loadSong() {
            return API.get("songs", `/songs/${id}`, {});
        }

        async function onLoad() {
            try {
                const song = await loadSong();
                const { songName, songFilename: songFilename } = song;

                if (songFilename) {
                    song.songFileURL = await Storage.vault.get(songFilename);
                }

                setSongName(songName);
                setSong(song);
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);

    function validateForm() {
        return songName.length > 0;
    }

    function formatFilename(str: string) {
        return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.files === null) return;
        file.current = event.currentTarget.files[0];
    }

    function saveSong(song: SongType) {
        return API.put("songs", `/songs/${id}`, {
            body: song,
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        let songFilename;

        event.preventDefault();

        if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
            alert(
                `Please pick a file smaller than ${
                    config.MAX_ATTACHMENT_SIZE / 1000000
                } MB.`
            );
            return;
        }

        setIsLoading(true);

        try {
            if (file.current) {
                songFilename = await s3Upload(file.current);
            } else if (song && song.songFilename) {
                songFilename = song.songFilename;
            }

            await saveSong({
                songName: songName,
                songFilename: songFilename,
            });
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function deleteSong() {
        return API.del("songs", `/songs/${id}`, {});
    }

    async function handleDelete(event: React.FormEvent<HTMLModElement>) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this song?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteSong();
            nav("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }


    return (
        <div className="Songs">
            {song && (
                <Form onSubmit={handleSubmit}>
                    <Stack gap={3}>
                        <Form.Group controlId="content">
                            <Form.Control
                                size="lg"
                                as="textarea"
                                value={songName}
                                onChange={(e) => setSongName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mt-2" controlId="file">
                            <Form.Label>Song File</Form.Label>
                            {song.songFilename && (
                                <p>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={song.songFileURL}
                                    >
                                        {formatFilename(song.songFilename)}
                                    </a>
                                </p>
                            )}
                            <Form.Control onChange={handleFileChange} type="file"/>
                        </Form.Group>

                        <Stack gap={1}>
                            <LoaderButton
                                size="lg"
                                type="submit"
                                isLoading={isLoading}
                                disabled={!validateForm()}
                            >
                                Save
                            </LoaderButton>
                            <LoaderButton
                                size="lg"
                                variant="danger"
                                onClick={handleDelete}
                                isLoading={isDeleting}
                            >
                                Delete
                            </LoaderButton>
                        </Stack>
                    </Stack>
                </Form>
            )}
        </div>
    );
}