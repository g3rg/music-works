import React, {useRef, useState} from "react";
import Form from "react-bootstrap/Form";
import {useNavigate} from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewSong.css";
import {API} from "aws-amplify";
import {SongType} from "../types/song.ts";
import {onError} from "../lib/errorLib.ts";
import {s3Upload} from "../lib/awsLib.ts";

export default function NewSong() {
    const file = useRef<null | File>(null);
    const nav = useNavigate();
    const [songName, setSongName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return songName.length > 0;
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if ( event.currentTarget.files === null ) return
        file.current = event.currentTarget.files[0];
    }

    function createSong(song: SongType) {
        return API.post("songs", "/songs", {
            body: song,
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
            const attachment = file.current
                ? await s3Upload(file.current)
                : undefined;

            await createSong({ songName, songFileURL: attachment });
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    return (
        <div className="NewSong">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="songName">
                    <Form.Label>Song Name</Form.Label>
                    <Form.Control
                        value={songName}
                        onChange={(e) => setSongName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mt-2" controlId="file">
                    <Form.Label>Song File</Form.Label>
                    <Form.Control onChange={handleFileChange} type="file" />
                </Form.Group>
                <LoaderButton
                    size="lg"
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create
                </LoaderButton>
            </Form>
        </div>
    );
}
